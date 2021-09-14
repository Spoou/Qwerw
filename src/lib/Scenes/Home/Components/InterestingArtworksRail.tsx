import { InterestingArtworksRail_me } from "__generated__/InterestingArtworksRail_me.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Theme } from "palette"
import React, { useImperativeHandle, useRef, useState } from "react"
import { FlatList, View } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import HomeAnalytics from "../homeAnalytics"
import { SmallTileRailContainer } from "./SmallTileRail"
import { RailScrollProps } from "./types"

const PAGE_SIZE = 10

interface InterestingArtworksRailProps {
  me: InterestingArtworksRail_me
  relay: RelayPaginationProp
}

const InterestingArtworksRail: React.FC<InterestingArtworksRailProps & RailScrollProps> = ({
  me,
  relay,
  scrollRef,
}) => {
  const railRef = useRef<View>(null)
  const listRef = useRef<FlatList<any>>(null)

  useImperativeHandle(scrollRef, () => ({
    scrollToTop: () => listRef.current?.scrollToOffset({ offset: 0, animated: false }),
  }))

  const { hasMore, isLoading, loadMore } = relay
  // TODO: Add spinner when loading more data
  const [_loadingMoreData, setLoadingMoreData] = useState(false)

  // This is to satisfy the TypeScript compiler based on Metaphysics types.
  const artworks = extractNodes(me.newWorksByInterestingArtists)

  const loadMoreArtworks = () => {
    if (!hasMore() || isLoading()) {
      return
    }

    setLoadingMoreData(true)

    loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.error(error.message)
      }

      setLoadingMoreData(false)
    })
  }

  return artworks.length ? (
    <Theme>
      <View ref={railRef}>
        <Flex pl="2" pr="2">
          <SectionTitle title={"New Works For You"} subtitle="Discover Artworks From Artists You Love" />
        </Flex>
        {
          <SmallTileRailContainer
            listRef={listRef}
            artworks={artworks as any}
            contextModule={HomeAnalytics.artworkRailContextModule("a-key")}
            onEndReached={loadMoreArtworks}
            onEndReachedThreshold={0.1}
          />
        }
      </View>
    </Theme>
  ) : null
}

export const InterestingArtworksRailContainer = createPaginationContainer(
  InterestingArtworksRail,
  {
    me: graphql`
      fragment InterestingArtworksRail_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 6 }, cursor: { type: "String" }) {
        newWorksByInterestingArtists(first: $count, after: $cursor)
          @connection(key: "InterestingArtworksRail_newWorksByInterestingArtists") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              ...SmallTileRail_artworks
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.me?.newWorksByInterestingArtists
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query InterestingArtworksRailQuery($cursor: String, $count: Int!) {
        me {
          ...InterestingArtworksRail_me @arguments(cursor: $cursor, count: $count)
        }
      }
    `,
  }
)
