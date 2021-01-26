import { AuctionResultQuery, AuctionResultQueryResponse } from "__generated__/AuctionResultQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ratioColor } from "lib/Components/Lists/AuctionResult"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useStickyScrollHeader } from "lib/utils/useStickyScrollHeader"
import { capitalize } from "lodash"
import moment from "moment"
import { Box, Flex, Separator, Spacer, Text } from "palette"
import React, { useCallback, useEffect, useState } from "react"
import { Animated, Image, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment"
import { getImageDimensions } from "../Sale/Components/SaleArtworkListItem"

const CONTAINER_HEIGHT = 80

interface Props {
  artist: AuctionResultQueryResponse["artist"]
  auctionResult: AuctionResultQueryResponse["auctionResult"]
}

const AuctionResult: React.FC<Props> = ({ artist, auctionResult }) => {
  const [imageHeight, setImageHeight] = useState<number>(0)
  const [imageWidth, setImageWidth] = useState<number>(0)

  useEffect(() => {
    if (auctionResult?.images?.thumbnail?.url) {
      Image.getSize(auctionResult.images.thumbnail.url, (width, height) => {
        const imageDimensions = getImageDimensions(height, width, CONTAINER_HEIGHT)
        setImageHeight(imageDimensions.height)
        setImageWidth(imageDimensions.width)
      })
    }
  }, [])

  const { headerElement, scrollProps } = useStickyScrollHeader({
    header: (
      <Flex flex={1} pl={6} pr={4} pt={0.5} flexDirection="row">
        <Text variant="subtitle" numberOfLines={1} style={{ flexShrink: 1 }}>
          {auctionResult?.title}
        </Text>
        {!!auctionResult?.dateText && <Text variant="subtitle">, {auctionResult?.dateText}</Text>}
      </Flex>
    ),
  })

  const getRatio = useCallback(() => {
    if (!auctionResult?.priceRealized?.cents || !auctionResult.estimate?.low) {
      return null
    }
    return auctionResult.priceRealized.cents / auctionResult.estimate.low
  }, [auctionResult?.priceRealized, auctionResult?.estimate])

  const getDifference = useCallback(() => {
    if (!auctionResult?.priceRealized?.cents || !auctionResult.estimate?.low) {
      return null
    }
    return (auctionResult.priceRealized.cents - auctionResult.estimate.low) / 100
  }, [auctionResult?.priceRealized, auctionResult?.estimate])

  const ratio = getRatio()
  const difference = getDifference()

  const stats = []
  const makeRow = (label: string, value: string, options?: { fullWidth?: boolean; testID?: string }) => (
    <Flex key={label} mb={1}>
      <Flex style={{ opacity: 0.5 }}>
        <Separator mb={1} />
      </Flex>
      {options?.fullWidth ? (
        <Flex>
          <Text color="black60" mb={1}>
            {label}
          </Text>
          <Text>{value}</Text>
        </Flex>
      ) : (
        <Flex flexDirection="row" justifyContent="space-between">
          <Text style={{ width: "35%" }} color="black60">
            {label}
          </Text>
          <Flex width="65%" pl={15}>
            <Text pl={2} textAlign="right" testID={options?.testID}>
              {value}
            </Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
  if (auctionResult?.estimate?.display) {
    const { currency, estimate } = auctionResult
    stats.push(makeRow("Estimate range", `${estimate.display} ${currency}`))
  }
  if (auctionResult?.mediumText) {
    stats.push(makeRow("Medium", capitalize(auctionResult.mediumText)))
  }
  if (auctionResult?.dimensionText) {
    stats.push(makeRow("Dimensions", auctionResult.dimensionText))
  }
  if (auctionResult?.dateText) {
    stats.push(makeRow("Year created", auctionResult.dateText))
  }
  if (auctionResult?.saleDate) {
    stats.push(makeRow("Sale date", moment(auctionResult.saleDate).utc().format("MMM D, YYYY"), { testID: "saleDate" }))
  }
  if (auctionResult?.organization) {
    stats.push(makeRow("Auction house", auctionResult.organization))
  }
  if (auctionResult?.saleTitle) {
    stats.push(makeRow("Sale name", auctionResult.saleTitle))
  }
  if (auctionResult?.location) {
    stats.push(makeRow("Sale location", auctionResult.location))
  }
  if (auctionResult?.description) {
    stats.push(makeRow("Description", auctionResult.description, { fullWidth: true }))
  }

  const hasSalePrice = !!auctionResult?.priceRealized?.display && !!auctionResult.currency
  const now = moment()
  const isFromPastMonth = auctionResult?.saleDate
    ? moment(auctionResult.saleDate).isAfter(now.subtract(1, "month"))
    : false
  const salePriceMessage =
    auctionResult?.boughtIn === true ? "Bought in" : isFromPastMonth ? "Awaiting results" : "Not available"

  return (
    <>
      <Animated.ScrollView {...scrollProps}>
        <FancyModalHeader hideBottomDivider />
        <Box px={2} pb={4}>
          <Flex mt={1} mb={4} style={{ flexDirection: "row" }}>
            {!!auctionResult?.images?.thumbnail?.url && !!imageHeight && !!imageWidth ? (
              <Flex height={CONTAINER_HEIGHT} width={CONTAINER_HEIGHT} justifyContent="center">
                <Image
                  style={{ height: imageHeight, width: imageWidth }}
                  source={{ uri: auctionResult?.images?.thumbnail?.url }}
                />
              </Flex>
            ) : (
              <Box style={{ height: CONTAINER_HEIGHT, width: CONTAINER_HEIGHT }} backgroundColor="black10" />
            )}
            <Flex justifyContent="center" flex={1} ml={2}>
              <TouchableWithoutFeedback
                onPress={() => artist?.href && navigate(artist.href)}
                hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              >
                <Text variant="mediumText">{artist?.name}</Text>
              </TouchableWithoutFeedback>
              <Text variant="title">
                {auctionResult?.title}
                {!!auctionResult?.dateText && `, ${auctionResult?.dateText}`}
              </Text>
            </Flex>
          </Flex>
          {!!hasSalePrice && (
            <Flex flexDirection="row">
              <Text variant="title" mb={1} mr={1}>
                Realized price
              </Text>
              <TouchableOpacity style={{ top: 1 }} hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Image source={require("@images/info.png")} />
              </TouchableOpacity>
            </Flex>
          )}
          <Text variant="largeTitle">
            {hasSalePrice ? `${auctionResult?.priceRealized?.display} ${auctionResult?.currency}` : salePriceMessage}
          </Text>
          {!!ratio && (
            <Flex flexDirection="row" mt={1}>
              <Flex borderRadius={2} overflow="hidden">
                <Flex
                  position="absolute"
                  width="100%"
                  height="100%"
                  backgroundColor={ratioColor(ratio)}
                  opacity={0.1}
                />
                <Text testID="ratio" variant="mediumText" color={ratioColor(ratio)} px="5px">
                  {ratio.toFixed(2)}x{" "}
                  {!!difference &&
                    `(${difference > 0 ? "+" : ""}${new Intl.NumberFormat().format(difference)} ${
                      auctionResult?.currency
                    })`}
                </Text>
              </Flex>
              <Text variant="text" color="black60" ml={1}>
                low estimate
              </Text>
            </Flex>
          )}
          <Text variant="title" mt={4} mb={1}>
            Stats
          </Text>
          {stats}
        </Box>
      </Animated.ScrollView>
      {headerElement}
    </>
  )
}

export const AuctionResultQueryRenderer: React.FC<{
  auctionResultInternalID: string
  artistID: string
  environment: RelayModernEnvironment
}> = ({ auctionResultInternalID, artistID, environment }) => {
  return (
    <QueryRenderer<AuctionResultQuery>
      environment={environment || defaultEnvironment}
      query={graphql`
        query AuctionResultQuery($auctionResultInternalID: String!, $artistID: String!) {
          auctionResult(id: $auctionResultInternalID) {
            artistID
            boughtIn
            categoryText
            currency
            dateText
            description
            dimensions {
              height
              width
            }
            dimensionText
            estimate {
              display
              high
              low
            }
            images {
              thumbnail {
                url(version: "square140")
                height
                width
                aspectRatio
              }
            }
            location
            mediumText
            organization
            priceRealized {
              cents
              centsUSD
              display
            }
            saleDate
            saleTitle
            title
          }
          artist(id: $artistID) {
            name
            href
          }
        }
      `}
      variables={{
        auctionResultInternalID,
        artistID,
      }}
      render={renderWithPlaceholder({
        Container: AuctionResult,
        renderPlaceholder: LoadingSkeleton,
      })}
    />
  )
}

const LoadingSkeleton = () => {
  const stats = []
  for (let i = 0; i < 8; i++) {
    stats.push(
      <Flex flexDirection="row" justifyContent="space-between" mb={2} key={i}>
        <PlaceholderBox width={CONTAINER_HEIGHT + Math.round(Math.random() * CONTAINER_HEIGHT)} height={20} />
        <PlaceholderBox width={CONTAINER_HEIGHT + Math.round(Math.random() * CONTAINER_HEIGHT)} height={20} />
      </Flex>
    )
  }
  return (
    <Flex mx={2}>
      <Spacer height={70} />

      <Flex flexDirection="row">
        {/* Image */}
        <PlaceholderBox width={CONTAINER_HEIGHT} height={CONTAINER_HEIGHT} />
        <Flex ml={2} mt={1}>
          {/* Artist name */}
          <PlaceholderBox width={100} height={20} />
          <Spacer mb={1} />
          {/* Artwork name */}
          <PlaceholderBox width={150} height={25} />
        </Flex>
      </Flex>
      <Spacer mb={4} />
      {/* "Realized price" */}
      <PlaceholderBox width={100} height={15} />
      <Spacer mb={1} />
      {/* Price */}
      <PlaceholderBox width={120} height={40} />
      <Spacer mb={1} />
      {/* Ratio */}
      <PlaceholderBox width={200} height={20} />
      <Spacer mb={4} />
      {/* "Stats" */}
      <PlaceholderBox width={60} height={30} />
      <Spacer mb={2} />
      {stats}
    </Flex>
  )
}
