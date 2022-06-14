import { AverageSalePriceSelectArtistItem_artist$data } from "__generated__/AverageSalePriceSelectArtistItem_artist.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { Flex, NoArtworkIcon, Text, Touchable } from "palette"
import React, { useState } from "react"
import { AverageSalePriceSelectArtistModal } from "./AverageSalePriceSelectArtist"

interface AverageSalePriceAtAuctionProps {
  artistData: AverageSalePriceSelectArtistItem_artist$data
}

export const AverageSalePriceAtAuction: React.FC<AverageSalePriceAtAuctionProps> = ({
  artistData,
}) => {
  const [isVisible, setVisible] = useState<boolean>(false)
  const [selectedArtist, setSelectedArtist] =
    useState<AverageSalePriceSelectArtistItem_artist$data>(artistData)

  return (
    <Flex mx={2} pt={6}>
      <Text variant="lg" mb={0.5} testID="Average_Auction_Price_title">
        Average Auction Price
      </Text>
      <Text variant="xs">Track price stability or growth for your artists.</Text>

      {/* Artists Info */}
      <Flex py={2} flexDirection="row" justifyContent="space-between" alignItems="center">
        {!selectedArtist.imageUrl ? (
          <Flex
            width={40}
            height={40}
            borderRadius={20}
            backgroundColor="black10"
            alignItems="center"
            justifyContent="center"
            style={{ marginTop: 3 }}
          >
            <NoArtworkIcon width={28} height={28} opacity={0.3} />
          </Flex>
        ) : (
          <Flex
            width={40}
            height={40}
            borderRadius={20}
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            // To align the image with the text we have to add top margin to compensate the line height.
            style={{ marginTop: 3 }}
          >
            <OpaqueImageView width={40} height={40} imageURL={selectedArtist.imageUrl} />
          </Flex>
        )}
        {/* Sale Artwork Artist Name, Birthday and Nationality */}
        <Flex flex={1} pl={1}>
          {!!selectedArtist.name && (
            <Text variant="md" ellipsizeMode="middle" numberOfLines={2}>
              {selectedArtist.name}
            </Text>
          )}
        </Flex>

        <Touchable onPress={() => setVisible(true)} haptic>
          <Text style={{ textDecorationLine: "underline" }} variant="xs" color="black60">
            Change Artist
          </Text>
        </Touchable>
      </Flex>

      <AverageSalePriceSelectArtistModal
        visible={isVisible}
        closeModal={() => setVisible(false)}
        onItemPress={(artist) => {
          setSelectedArtist(artist)
          setVisible(false)
        }}
      />
    </Flex>
  )
}
