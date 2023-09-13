import {
  Box,
  Flex,
  Image,
  Spacer,
  Text,
  Touchable,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import { ArtistHeader_artist$data } from "__generated__/ArtistHeader_artist.graphql"
import { ArtistHeader_me$data } from "__generated__/ArtistHeader_me.graphql"
import { navigate } from "app/system/navigation/navigate"
import { isPad } from "app/utils/hardware"
import { pluralize } from "app/utils/pluralize"
import { LayoutChangeEvent, ViewProps } from "react-native"
import { RelayProp, createFragmentContainer, graphql } from "react-relay"

export const ARTIST_HEADER_HEIGHT = 156
const ARTIST_IMAGE_TABLET_HEIGHT = 375
const ARTIST_HEADER_SCROLL_MARGIN = 100

interface Props {
  artist: ArtistHeader_artist$data
  me: ArtistHeader_me$data
  relay: RelayProp
  onLayoutChange?: ViewProps["onLayout"]
}

export const ArtistHeader: React.FC<Props> = ({ artist, me, onLayoutChange }) => {
  const { width } = useScreenDimensions()
  const { updateScrollYOffset } = useScreenScrollContext()
  const isTablet = isPad()

  const getBirthdayString = () => {
    const birthday = artist.birthday
    if (!birthday) {
      return ""
    }

    const leadingSubstring = artist.nationality ? ", b." : ""

    if (birthday.includes("born")) {
      return birthday.replace("born", leadingSubstring)
    } else if (birthday.includes("Est.") || birthday.includes("Founded")) {
      return " " + birthday
    }

    return leadingSubstring + " " + birthday
  }

  const descriptiveString = (artist.nationality || "") + getBirthdayString()

  const bylineRequired = artist.nationality || artist.birthday

  const imageSize = isTablet ? ARTIST_IMAGE_TABLET_HEIGHT : width

  const handleOnLayout = ({ nativeEvent, ...rest }: LayoutChangeEvent) => {
    if (nativeEvent.layout.height > 0) {
      updateScrollYOffset(nativeEvent.layout.height - ARTIST_HEADER_SCROLL_MARGIN)
      onLayoutChange?.({ nativeEvent, ...rest })
    }
  }

  // TODO: Remove this when we have real data
  const hasAlerts = true
  const numberOfAlerts = 2

  console.log("me.savedSearchesConnection!.totalCount", me.savedSearchesConnection!.totalCount)

  return (
    <Flex pointerEvents="box-none" onLayout={handleOnLayout}>
      {!!artist.coverArtwork?.image?.url && (
        <Flex pointerEvents="none">
          <Image
            accessibilityLabel={`${artist.name} cover image`}
            src={artist.coverArtwork.image.url}
            aspectRatio={width / imageSize}
            width={width}
            height={imageSize}
            style={{ alignSelf: "center" }}
          />
          <Spacer y={2} />
        </Flex>
      )}
      <Box px={2} pointerEvents="none">
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Flex flex={1}>
            <Text variant="lg">{artist.name}</Text>
            {!!bylineRequired && (
              <Text variant="lg" color="black60">
                {descriptiveString}
              </Text>
            )}
          </Flex>
        </Flex>
      </Box>

      {Number(me?.savedSearchesConnection?.totalCount) > 0 && (
        <Box mx={2} maxWidth={120}>
          <Touchable
            haptic
            onPress={() => {
              navigate(`/my-profile/saved-search-alerts?artistIDs=${artist.internalID}`)
            }}
          >
            <Text variant="xs" color="blue100">
              {me.savedSearchesConnection!.totalCount}{" "}
              {pluralize("Alert", me.savedSearchesConnection!.totalCount!)} Set
            </Text>
          </Touchable>
        </Box>
      )}
      <Spacer y={1} />
    </Flex>
  )
}

export const ArtistHeaderFragmentContainer = createFragmentContainer(ArtistHeader, {
  artist: graphql`
    fragment ArtistHeader_artist on Artist {
      birthday
      coverArtwork {
        image {
          url(version: "large")
        }
      }
      internalID
      name
      nationality
    }
  `,
  me: graphql`
    fragment ArtistHeader_me on Me @argumentDefinitions(artistID: { type: "ID!" }) {
      savedSearchesConnection(first: 10, artistIDs: [$artistID]) {
        totalCount
      }
    }
  `,
})
