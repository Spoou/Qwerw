import { SavedSearches_me } from "__generated__/SavedSearches_me.graphql"
import { SAVED_SERCHES_PAGE_SIZE } from "lib/data/constants"
import { extractNodes } from "lib/utils/extractNodes"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Separator, Spinner, useTheme } from "palette"
import React from "react"
import { useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { AlertListItem } from "./AlertListItem"

interface SavedSearchesProps {
  me: SavedSearches_me
  relay: RelayPaginationProp
}

export const SavedSearches: React.FC<SavedSearchesProps> = (props) => {
  const { me, relay } = props
  const { space } = useTheme()
  const { width } = useScreenDimensions()
  const [fetchingMore, setFetchingMore] = useState(false)
  const items = extractNodes(me.recentlyViewedArtworksConnection)

  const loadMore = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }
    setFetchingMore(true)
    relay.loadMore(SAVED_SERCHES_PAGE_SIZE, (error) => {
      if (error) {
        console.log(error.message)
      }
      setFetchingMore(false)
    })
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <Separator width={width - 2 * space(2)} mx={2} />}
      renderItem={({ item }) => {
        return (
          <AlertListItem
            title={item.slug}
            pills={["Unique", "Painting", "$10,000-$50,000", "Limted Edition"]}
            onPress={() => {
              console.log("pressed")
            }}
          />
        )
      }}
      onEndReached={loadMore}
      ListFooterComponent={
        fetchingMore ? (
          <Flex alignItems="center" mt={2} mb={4}>
            <Spinner />
          </Flex>
        ) : null
      }
    />
  )
}

export const SavedSearchesContainer = createPaginationContainer(
  SavedSearches,
  {
    me: graphql`
      fragment SavedSearches_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" }) {
        recentlyViewedArtworksConnection(first: $count, after: $cursor)
          @connection(key: "SavedSearches_recentlyViewedArtworksConnection") {
          edges {
            node {
              id
              slug
            }
          }
        }
      }
    `,
  },
  {
    getVariables(_props, { count, cursor }) {
      return {
        count,
        cursor,
      }
    },
    getConnectionFromProps(props) {
      return props.me.recentlyViewedArtworksConnection
    },
    query: graphql`
      query SavedSearchesQuery($count: Int!, $cursor: String) {
        me {
          ...SavedSearches_me @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
