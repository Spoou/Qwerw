import { themeGet } from "@styled-system/theme-get"
import {
  ArtworkRailCard_artwork$data,
  ArtworkRailCard_artwork$key,
} from "__generated__/ArtworkRailCard_artwork.graphql"
import { getUrgencyTag } from "app/utils/getUrgencyTag"
import { compact } from "lodash"
import { Flex, Spacer, Text, useColor } from "palette"
import { useMemo } from "react"
import { GestureResponderEvent, PixelRatio } from "react-native"
import { graphql, useFragment } from "react-relay"
import styled from "styled-components/native"
import { saleMessageOrBidInfo as defaultSaleMessageOrBidInfo } from "../ArtworkGrids/ArtworkGridItem"
import OpaqueImageView from "../OpaqueImageView/OpaqueImageView"
import { LARGE_RAIL_IMAGE_WIDTH } from "./LargeArtworkRail"
import { SMALL_RAIL_IMAGE_WIDTH } from "./SmallArtworkRail"

export const ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT = 60

export const ARTWORK_RAIL_CARD_IMAGE_HEIGHT = {
  small: 230,
  large: 320,
}

export type ArtworkCardSize = "small" | "large"

export interface ArtworkRailCardProps {
  artwork: ArtworkRailCard_artwork$key
  hideArtistName?: boolean
  hidePartnerName?: boolean
  isRecentlySoldArtwork?: boolean
  lotLabel?: string | null
  lowEstimateDisplay?: string
  highEstimateDisplay?: string
  onPress?: (event: GestureResponderEvent) => void
  priceRealizedDisplay?: string
  size: ArtworkCardSize
  testID?: string
}

export const ArtworkRailCard: React.FC<ArtworkRailCardProps> = ({
  hideArtistName = false,
  hidePartnerName = false,
  isRecentlySoldArtwork = false,
  lotLabel,
  lowEstimateDisplay,
  highEstimateDisplay,
  onPress,
  priceRealizedDisplay,
  size,
  testID,
  ...restProps
}) => {
  const fontScale = PixelRatio.getFontScale()

  const artwork = useFragment(artworkFragment, restProps.artwork)

  const { artistNames, date, partner, title, image } = artwork

  const saleMessage = defaultSaleMessageOrBidInfo({ artwork, isSmallTile: true })

  const urgencyTag =
    artwork?.sale?.isAuction && !artwork?.sale?.isClosed
      ? getUrgencyTag(artwork?.sale?.endAt)
      : null

  const getTextHeightByArtworkSize = (cardSize: ArtworkCardSize) => {
    if (cardSize === "small") {
      return ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT + 30
    }
    return ARTWORK_RAIL_TEXT_CONTAINER_HEIGHT + (isRecentlySoldArtwork ? 30 : 0)
  }

  const containerWidth = useMemo(() => {
    const imageDimensions = getImageDimensions({
      width: image?.resized?.width ?? 0,
      height: image?.resized?.height ?? 0,
      maxHeight: ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size],
    })

    switch (size) {
      case "small":
        return artwork.image?.resized?.width
      case "large":
        if (imageDimensions.width <= SMALL_RAIL_IMAGE_WIDTH) {
          return SMALL_RAIL_IMAGE_WIDTH
        } else if (imageDimensions.width >= LARGE_RAIL_IMAGE_WIDTH) {
          return LARGE_RAIL_IMAGE_WIDTH
        } else {
          return imageDimensions.width
        }

      default:
        assertNever(size)
        break
    }
  }, [image?.resized?.height, image?.resized?.width])

  return (
    <ArtworkCard onPress={onPress || undefined} testID={testID}>
      <Flex>
        <ArtworkRailCardImage
          containerWidth={containerWidth}
          image={image}
          size={size}
          urgencyTag={urgencyTag}
        />
        <Flex
          my={1}
          width={containerWidth}
          // Recently sold artworks require more space for the text container
          // to accommodate the estimate and realized price
          style={{
            height: fontScale * getTextHeightByArtworkSize(size),
          }}
        >
          {!!lotLabel && (
            <Text lineHeight="20" color="black60" numberOfLines={1}>
              Lot {lotLabel}
            </Text>
          )}
          {!hideArtistName && !!artistNames && (
            <Text numberOfLines={size === "small" ? 2 : 1} lineHeight="20" variant="xs">
              {artistNames}
            </Text>
          )}
          <Flex flexDirection="row">
            {!!title && (
              <Text
                lineHeight="20"
                color="black60"
                numberOfLines={size === "small" ? 2 : 1}
                variant="xs"
                fontStyle="italic"
              >
                {title}
              </Text>
            )}
            {!!date && (
              <Text
                lineHeight="20"
                color="black60"
                numberOfLines={size === "small" ? 2 : 1}
                variant="xs"
              >
                {title && date ? ", " : ""}
                {date}
              </Text>
            )}
          </Flex>
          {!hidePartnerName && !!partner?.name && (
            <Text lineHeight="20" color="black60" numberOfLines={1}>
              {partner?.name}
            </Text>
          )}
          {!!isRecentlySoldArtwork && size === "large" && (
            <>
              <Spacer mt={2} />
              <Flex flexDirection="row" justifyContent="space-between">
                <Text variant="xs" color="black60" numberOfLines={1} fontWeight="500">
                  Estimate
                </Text>
                <Text variant="xs" color="black60" numberOfLines={1} fontWeight="500">
                  {compact([lowEstimateDisplay, highEstimateDisplay]).join("—")}
                </Text>
              </Flex>
              <Flex flexDirection="row" justifyContent="space-between">
                <Text variant="xs" color="blue100" numberOfLines={1} fontWeight="500">
                  Sold For (incl. premium)
                </Text>
                <Text variant="xs" color="blue100" numberOfLines={1} fontWeight="500">
                  {priceRealizedDisplay}
                </Text>
              </Flex>
            </>
          )}

          {!!saleMessage && !isRecentlySoldArtwork && (
            <Text lineHeight="20" variant="xs" color="black100" numberOfLines={1} fontWeight={500}>
              {saleMessage}
            </Text>
          )}
        </Flex>
      </Flex>
    </ArtworkCard>
  )
}

export interface ArtworkRailCardImageProps {
  image: ArtworkRailCard_artwork$data["image"]
  size: ArtworkCardSize
  urgencyTag?: string | null
  containerWidth?: number | null
}

const ArtworkRailCardImage: React.FC<ArtworkRailCardImageProps> = ({
  image,
  size,
  urgencyTag = null,
  containerWidth,
}) => {
  const color = useColor()

  const { width, height, src } = image?.resized || {}

  if (!src) {
    return (
      <Flex
        bg={color("black30")}
        width={width}
        height={ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size]}
        style={{ borderRadius: 2 }}
      />
    )
  }

  const imageDimensions = getImageDimensions({
    width: width ?? 0,
    height: height ?? 0,
    maxHeight: ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size],
  })

  return (
    <Flex>
      <Flex width={containerWidth}>
        <OpaqueImageView
          style={{ maxHeight: ARTWORK_RAIL_CARD_IMAGE_HEIGHT[size] }}
          imageURL={src}
          height={imageDimensions.height}
          width={containerWidth!}
        />
      </Flex>
      {!!urgencyTag && (
        <Flex
          backgroundColor={color("white100")}
          position="absolute"
          px="5px"
          py="3px"
          bottom="5px"
          left="5px"
          borderRadius={2}
          alignSelf="flex-start"
        >
          <Text variant="xs" color={color("black100")} numberOfLines={1}>
            {urgencyTag}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

const getImageDimensions = ({
  height,
  width,
  maxHeight,
}: {
  height: number
  width: number
  maxHeight: number
}) => {
  const aspectRatio = width / height
  if (height > maxHeight) {
    const maxWidth = maxHeight * aspectRatio
    return { width: maxWidth, height: maxHeight }
  }
  return { width, height }
}

const artworkFragment = graphql`
  fragment ArtworkRailCard_artwork on Artwork @argumentDefinitions(width: { type: "Int" }) {
    id
    slug
    internalID
    href
    artistNames
    date
    image {
      resized(width: $width) {
        src
        srcSet
        width
        height
      }
      aspectRatio
    }
    sale {
      isAuction
      isClosed
      endAt
    }
    saleMessage
    saleArtwork {
      counts {
        bidderPositions
      }
      currentBid {
        display
      }
    }
    partner {
      name
    }
    title
    realizedPrice
  }
`

const ArtworkCard = styled.TouchableHighlight.attrs(() => ({
  underlayColor: themeGet("colors.white100"),
  activeOpacity: 0.8,
}))``
