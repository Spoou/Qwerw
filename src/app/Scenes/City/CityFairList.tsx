import { CityFairList_city } from "__generated__/CityFairList_city.graphql"
import {
  CityFairListQuery,
  CityFairListQueryVariables,
} from "__generated__/CityFairListQuery.graphql"
import { PAGE_SIZE } from "app/Components/constants"
import Spinner from "app/Components/Spinner"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { isCloseToBottom } from "app/utils/isCloseToBottom"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { Schema, screenTrack } from "app/utils/track"
import { Box, Separator, Serif } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { TabFairItemRow } from "./Components/TabFairItemRow"

interface Props extends Pick<CityFairListQueryVariables, "citySlug"> {
  city: CityFairList_city
  relay: RelayPaginationProp
}

interface State {
  fetchingNextPage: boolean
}

@screenTrack((props: Props) => ({
  context_screen: Schema.PageNames.CityGuideFairsList,
  context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
  context_screen_owner_slug: props.city.slug! /* STRICTNESS_MIGRATION */,
  context_screen_owner_id: props.city.slug! /* STRICTNESS_MIGRATION */,
}))
class CityFairList extends React.Component<Props, State> {
  state = {
    fetchingNextPage: false,
  }

  fetchData = () => {
    const { relay } = this.props

    if (!relay.hasMore() || relay.isLoading()) {
      return
    }
    this.setState({ fetchingNextPage: true })
    relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.error("CityFairList.tsx #fetchData", error.message)
        // FIXME: Handle error
      }
      this.setState({ fetchingNextPage: false })
    })
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  renderItem = (item) => {
    return (
      <Box py={2}>
        <TabFairItemRow item={item.node} />
      </Box>
    )
  }

  // @TODO: Implement test for this component https://artsyproduct.atlassian.net/browse/LD-562
  render() {
    const {
      city: {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        fairs: { edges },
      },
    } = this.props
    const { fetchingNextPage } = this.state
    return (
      <Box mx={2}>
        <FlatList
          ListHeaderComponent={() => {
            return (
              <Box pt={6} mt={3} mb={2}>
                <Serif size="8">Fairs</Serif>
              </Box>
            )
          }}
          data={edges}
          ItemSeparatorComponent={() => <Separator />}
          keyExtractor={(item) => item.node.internalID}
          renderItem={({ item }) => this.renderItem(item)}
          onScroll={isCloseToBottom(this.fetchData)}
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          ListFooterComponent={
            !!fetchingNextPage && <Spinner style={{ marginTop: 20, marginBottom: 20 }} />
          }
        />
      </Box>
    )
  }
}

export const CityFairListContainer = createPaginationContainer(
  CityFairList,
  {
    city: graphql`
      fragment CityFairList_city on City
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String", defaultValue: "" }
      ) {
        slug
        fairs: fairsConnection(first: $count, after: $cursor, status: CURRENT, sort: START_AT_ASC)
          @connection(key: "CityFairList_fairs") {
          edges {
            node {
              internalID
              name
              exhibition_period: exhibitionPeriod(format: SHORT)
              counts {
                partners
              }
              location {
                coordinates {
                  lat
                  lng
                }
              }
              image {
                image_url: imageURL
                aspect_ratio: aspectRatio
                url
              }
              profile {
                icon {
                  internalID
                  href
                  height
                  width
                  url(version: "square140")
                }
                id
                slug
                name
              }
              start_at: startAt
              end_at: endAt
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.city && props.city.fairs
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        citySlug: props.citySlug,
        ...fragmentVariables,
        count,
        cursor,
      }
    },
    query: graphql`
      query CityFairListPaginationQuery($count: Int!, $cursor: String, $citySlug: String!) {
        city(slug: $citySlug) {
          ...CityFairList_city @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)

interface CityFairListProps {
  citySlug: string
}
export const CityFairListQueryRenderer: React.FC<CityFairListProps> = ({ citySlug }) => {
  return (
    <QueryRenderer<CityFairListQuery>
      environment={defaultEnvironment}
      query={graphql`
        query CityFairListQuery($citySlug: String!) {
          city(slug: $citySlug) {
            ...CityFairList_city
          }
        }
      `}
      variables={{ citySlug }}
      render={renderWithLoadProgress(CityFairListContainer)}
    />
  )
}
