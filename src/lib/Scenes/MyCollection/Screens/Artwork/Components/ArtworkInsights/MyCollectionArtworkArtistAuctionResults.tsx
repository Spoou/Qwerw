import { ContextModule, OwnerType, tappedInfoBubble } from "@artsy/cohesion"
import { MyCollectionArtworkArtistAuctionResults_artwork } from "__generated__/MyCollectionArtworkArtistAuctionResults_artwork.graphql"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import { AuctionResultFragmentContainer } from "lib/Components/Lists/AuctionResult"
import { navigate } from "lib/navigation/navigate"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { extractNodes } from "lib/utils/extractNodes"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Flex, Separator, Spacer, Text } from "palette"
import React from "react"
import { FlatList, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { InfoButton } from "./InfoButton"

interface MyCollectionArtworkArtistAuctionResultsProps {
  artwork: MyCollectionArtworkArtistAuctionResults_artwork
}

const MyCollectionArtworkArtistAuctionResults: React.FC<MyCollectionArtworkArtistAuctionResultsProps> = (props) => {
  const { trackEvent } = useTracking()
  const auctionResults = extractNodes(props?.artwork?.artist?.auctionResultsConnection)

  if (!auctionResults.length) {
    return null
  }

  return (
    <View>
      <ScreenMargin>
        <Box my={3}>
          <Separator />
        </Box>
        <InfoButton
          title={`Auction Results for ${props?.artwork?.artist?.name}`}
          modalContent={
            <>
              <Text>
                This data set includes the latest lots from auction sales at top commercial auction houses. Lots are
                updated daily.
              </Text>
            </>
          }
          onPress={() => trackEvent(tracks.tappedInfoBubble(props?.artwork?.internalID, props?.artwork?.slug))}
        />

        <Spacer my={0.5} />

        <FlatList
          data={auctionResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AuctionResultFragmentContainer auctionResult={item} />}
          ListHeaderComponent={() => (
            <Flex px={2}>
              <Text variant="title">Auction results</Text>
              <Text variant="small" color="black60">
                Sorted by most recent sale date
              </Text>
              <Separator mt="2" />
            </Flex>
          )}
          ItemSeparatorComponent={() => (
            <Flex px={2}>
              <Separator />
            </Flex>
          )}
          style={{ width: useScreenDimensions().width, left: -20 }}
        />
        <Separator />
        <Box pt={3}>
          <CaretButton
            onPress={() => navigate(`/artist/${props?.artwork?.artist?.slug!}/auction-results`)}
            text="Explore auction results"
          />
        </Box>
      </ScreenMargin>
    </View>
  )
}

export const MyCollectionArtworkArtistAuctionResultsFragmentContainer = createFragmentContainer(
  MyCollectionArtworkArtistAuctionResults,
  {
    artwork: graphql`
      fragment MyCollectionArtworkArtistAuctionResults_artwork on Artwork {
        internalID
        slug
        artist {
          slug
          name
          auctionResultsConnection(
            first: 3
            sort: DATE_DESC # organizations: $organizations # categories: $categories # sizes: $sizes # earliestCreatedYear: $createdAfterYear # latestCreatedYear: $createdBeforeYear # allowEmptyCreatedDates: $allowEmptyCreatedDates
          ) {
            edges {
              node {
                id
                ...AuctionResult_auctionResult
              }
            }
          }
        }
      }
    `,
  }
)

const tracks = {
  tappedInfoBubble: (internalID: string, slug: string) => {
    return tappedInfoBubble({
      contextModule: ContextModule.myCollectionArtwork,
      contextScreenOwnerType: OwnerType.myCollectionArtwork,
      contextScreenOwnerId: internalID,
      contextScreenOwnerSlug: slug,
      subject: "auctionResults",
    })
  },
}
