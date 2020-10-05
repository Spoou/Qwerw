import { SaleArtworksRail_me } from "__generated__/SaleArtworksRail_me.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { SaleArtworkTileRailCardContainer } from "lib/Components/SaleArtworkTileRailCard"
import { SectionTitle } from "lib/Components/SectionTitle"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Spacer } from "palette"
import React, { useRef } from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  me: SaleArtworksRail_me
}

export const INITIAL_NUMBER_TO_RENDER = 4

export const SaleArtworksRail: React.FC<Props> = ({ me }) => {
  const navRef = useRef<any>(null)

  const artworks = extractNodes(me?.saleArtworksRail)

  return (
    <Flex mt={3} ref={navRef}>
      <Flex mx={2}>
        <SectionTitle title="Lots by artists you follow" />
      </Flex>
      <AboveTheFoldFlatList
        horizontal
        ListHeaderComponent={() => <Spacer mr={2}></Spacer>}
        ListFooterComponent={() => <Spacer mr={2}></Spacer>}
        ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
        showsHorizontalScrollIndicator={false}
        data={artworks}
        initialNumToRender={INITIAL_NUMBER_TO_RENDER}
        windowSize={3}
        renderItem={({ item: artwork }) => (
          <SaleArtworkTileRailCardContainer
            onPress={() => {
              SwitchBoard.presentNavigationViewController(navRef.current, artwork.href!)
            }}
            saleArtwork={artwork.saleArtwork!}
            useSquareAspectRatio
            useCustomSaleMessage
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </Flex>
  )
}

export const SaleArtworksRailContainer = createFragmentContainer(SaleArtworksRail, {
  me: graphql`
    fragment SaleArtworksRail_me on Me {
      saleArtworksRail: lotsByFollowedArtistsConnection(first: 10, includeArtworksByFollowedArtists: true) {
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
})
