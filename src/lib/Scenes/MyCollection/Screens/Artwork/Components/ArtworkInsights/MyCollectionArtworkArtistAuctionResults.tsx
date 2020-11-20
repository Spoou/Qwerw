import { MyCollectionArtworkArtistAuctionResults_artwork } from "__generated__/MyCollectionArtworkArtistAuctionResults_artwork.graphql"
import { Divider } from "lib/Components/Bidding/Components/Divider"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { extractNodes } from "lib/utils/extractNodes"
import { DateTime } from "luxon"
import { Box, Flex, Spacer, Text } from "palette"
import React from "react"
import { TouchableWithoutFeedback, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { InfoButton } from "./InfoButton"

interface MyCollectionArtworkArtistAuctionResultsProps {
  artwork: MyCollectionArtworkArtistAuctionResults_artwork
}

const MyCollectionArtworkArtistAuctionResults: React.FC<MyCollectionArtworkArtistAuctionResultsProps> = (props) => {
  const results = extractNodes(props?.artwork?.artist?.auctionResultsConnection)

  if (!results.length) {
    return null
  }

  return (
    <View>
      <ScreenMargin>
        <InfoButton
          title="Auction Results"
          modalContent={
            <>
              <Text>
                This data set includes 36 months of auction results from top commercial auction houses and sales hosted
                on Artsy.
              </Text>
              <Spacer my={1} />
              <Text>Last updated Aug 30, 2020.</Text>
            </>
          }
        />

        <Spacer my={0.5} />

        <TouchableWithoutFeedback
          onPress={() => navigate(`/artist/${props?.artwork?.artist?.slug!}/auction-results`)}
          data-test-id="AuctionsResultsButton"
        >
          <Box>
            {results.map(({ title, saleDate, priceRealized, internalID, images }) => {
              const dateOfSale = DateTime.fromISO(saleDate as string).toLocaleString(DateTime.DATE_MED)
              const salePrice = priceRealized?.centsUSD === 0 ? null : priceRealized?.display

              return (
                <Box my={0.5} key={internalID}>
                  <Box my={0.5}>
                    <Flex flexDirection="row">
                      <Box pr={1}>
                        <OpaqueImageView imageURL={images?.thumbnail?.url} width={80} height={60} />
                      </Box>
                      <Box pr={1} maxWidth="80%">
                        <Flex flexDirection="row">
                          <Text style={{ flexShrink: 1 }}>{title}</Text>
                        </Flex>
                        <Text color="black60" my={0.5}>
                          Sold {dateOfSale}
                        </Text>

                        {!!salePrice && (
                          <Box>
                            <Text>{salePrice}</Text>
                          </Box>
                        )}
                      </Box>
                    </Flex>
                  </Box>
                </Box>
              )
            })}
          </Box>
        </TouchableWithoutFeedback>

        <Spacer my={1} />

        <Box>
          <CaretButton
            onPress={() => navigate(`/artist/${props?.artwork?.artist?.slug!}/auction-results`)}
            text="Explore auction results"
          />
        </Box>
      </ScreenMargin>

      <Box my={3}>
        <Divider />
      </Box>
    </View>
  )
}

export const MyCollectionArtworkArtistAuctionResultsFragmentContainer = createFragmentContainer(
  MyCollectionArtworkArtistAuctionResults,
  {
    artwork: graphql`
      fragment MyCollectionArtworkArtistAuctionResults_artwork on Artwork {
        artist {
          slug
          auctionResultsConnection(
            first: 3
            sort: DATE_DESC # organizations: $organizations # categories: $categories # sizes: $sizes # earliestCreatedYear: $createdAfterYear # latestCreatedYear: $createdBeforeYear # allowEmptyCreatedDates: $allowEmptyCreatedDates
          ) {
            edges {
              node {
                internalID
                title
                dimensionText
                images {
                  thumbnail {
                    url
                  }
                }
                description
                dateText
                saleDate
                priceRealized {
                  display
                  centsUSD
                }
              }
            }
          }
        }
      }
    `,
  }
)
