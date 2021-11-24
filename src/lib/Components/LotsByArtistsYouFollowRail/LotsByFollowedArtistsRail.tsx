import { OwnerType } from "@artsy/cohesion"
import { LotsByFollowedArtistsRail_me } from "__generated__/LotsByFollowedArtistsRail_me.graphql"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import { SaleArtworkTileRailCardContainer } from "lib/Components/SaleArtworkTileRailCard"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { isCloseToEdge } from "lib/utils/isCloseToEdge"
import { Flex } from "palette"
import React, { useEffect, useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

export const PAGE_SIZE = 6

interface Props {
  title: string
  me: LotsByFollowedArtistsRail_me
  relay: RelayPaginationProp
  onHide?: () => void
  onShow?: () => void
}

export const LotsByFollowedArtistsRail: React.FC<Props> = ({ title, me, relay, onShow, onHide }) => {
  const [isLoading, setIsLoading] = useState(false)

  const artworks = extractNodes(me?.lotsByFollowedArtistsConnection)
  const hasArtworks = artworks?.length

  useEffect(() => {
    hasArtworks ? onShow?.() : onHide?.()
  }, [hasArtworks])

  if (!hasArtworks) {
    return null
  }

  const fetchNextPage = () => {
    if (!relay.hasMore() || isLoading) {
      return
    }

    setIsLoading(true)

    relay.loadMore(PAGE_SIZE, (error) => {
      setIsLoading(false)

      if (error) {
        // FIXME: Handle error
        console.error("LotsByFollowedArtistsRail.tsx", error.message)
      }
    })
  }

  return (
    <Flex>
      <Flex mx={2}>
        <SectionTitle title={title} onPress={() => navigate("/lots-by-artists-you-follow")} />
      </Flex>
      <CardRailFlatList
        data={artworks}
        initialNumToRender={PAGE_SIZE}
        windowSize={3}
        renderItem={({ item: artwork }) => (
          <SaleArtworkTileRailCardContainer
            onPress={() => {
              navigate(artwork.href!)
            }}
            saleArtwork={artwork.saleArtwork!}
            useSquareAspectRatio
            useCustomSaleMessage
            contextScreenOwnerType={OwnerType.sale}
          />
        )}
        keyExtractor={(item) => item.id}
        onScroll={isCloseToEdge(fetchNextPage)}
      />
    </Flex>
  )
}

export const LotsByFollowedArtistsRailContainer = createPaginationContainer(
  LotsByFollowedArtistsRail,
  {
    me: graphql`
      fragment LotsByFollowedArtistsRail_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 6 }, cursor: { type: "String" }) {
        lotsByFollowedArtistsConnection(
          first: $count
          after: $cursor
          includeArtworksByFollowedArtists: true
          isAuction: true
          liveSale: true
        ) @connection(key: "LotsByFollowedArtistsRail_lotsByFollowedArtistsConnection") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              href
              saleArtwork {
                ...SaleArtworkTileRailCard_saleArtwork
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.me?.lotsByFollowedArtistsConnection
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
      query LotsByFollowedArtistsRailQuery($cursor: String, $count: Int!) {
        me {
          ...LotsByFollowedArtistsRail_me @arguments(cursor: $cursor, count: $count)
        }
      }
    `,
  }
)
