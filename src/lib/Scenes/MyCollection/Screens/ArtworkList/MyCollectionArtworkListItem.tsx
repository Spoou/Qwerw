import { MyCollectionArtworkListItem_artwork } from "__generated__/MyCollectionArtworkListItem_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { AppStore } from "lib/store/AppStore"
import { artworkMediumCategories } from "lib/utils/artworkMediumCategories"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { capitalize } from "lodash"
import { Box, color, Flex, Sans } from "palette"
import React from "react"
import { Image as RNImage } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

interface MyCollectionArtworkListItemProps {
  artwork: MyCollectionArtworkListItem_artwork
}

const MyCollectionArtworkListItem: React.FC<MyCollectionArtworkListItemProps> = ({ artwork }) => {
  const imageURL = artwork?.image?.url
  const { width } = useScreenDimensions()
  const mediums: { [medium: string]: string } = artworkMediumCategories.reduce(
    (acc, cur) => ({ ...acc, [cur.value]: cur.label }),
    {}
  )

  const { artist, artistNames, medium, slug, title } = artwork

  const lastUploadedPhoto = AppStore.useAppState((state) => state.myCollection.artwork.sessionState.lastUploadedPhoto)
  const renderImage = () => {
    if (!!imageURL) {
      return (
        <OpaqueImageView
          data-test-id="Image"
          imageURL={imageURL.replace(":version", "square")}
          width={90}
          height={90}
        />
      )
    } else if (lastUploadedPhoto) {
      return (
        <RNImage
          data-test-id="Image"
          style={{ width: 90, height: 90, resizeMode: "cover" }}
          source={{ uri: lastUploadedPhoto.path }}
        />
      )
    } else {
      return <Box data-test-id="Image" bg={color("black30")} width={90} height={90} />
    }
  }

  return (
    <TouchElement
      onPress={() => {
        if (!!artist) {
          navigate("/my-collection/artwork/" + slug, {
            passProps: {
              medium,
              artistInternalID: artist.internalID,
            },
          })
        } else {
          console.warn("MyCollectionArtworkListItem: Error: Missing artist.artistID")
        }
      }}
    >
      <Flex
        my={1}
        mx={2}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        maxWidth={width}
        overflow="hidden"
      >
        <Flex flexDirection="row" alignItems="center">
          {renderImage()}
          <Box m={1} maxWidth={width} style={{ flex: 1 }}>
            <Sans size="4">{artistNames}</Sans>
            {!!title ? (
              <Sans size="3t" color="black60" numberOfLines={2} style={{ flex: 1 }}>
                {title}
              </Sans>
            ) : null}
            {!!medium ? (
              <Sans size="3t" color="black60" numberOfLines={2} style={{ flex: 1 }}>
                {mediums[medium] || capitalize(medium)}
              </Sans>
            ) : null}
          </Box>
        </Flex>
      </Flex>
    </TouchElement>
  )
}

export const MyCollectionArtworkListItemFragmentContainer = createFragmentContainer(MyCollectionArtworkListItem, {
  artwork: graphql`
    fragment MyCollectionArtworkListItem_artwork on Artwork {
      artist {
        internalID
      }
      image {
        url
      }
      artistNames
      medium
      slug
      title
    }
  `,
})

const TouchElement = styled.TouchableHighlight.attrs({
  underlayColor: color("white100"),
  activeOpacity: 0.8,
})``

export const tests = {
  TouchElement,
}
