import { SaleHeader_sale } from "__generated__/SaleHeader_sale.graphql"
import { saleTime } from "lib/utils/saleTime"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import moment from "moment"
import { Flex, Text } from "palette"
import React from "react"
import { Animated, Dimensions, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { CaretButton } from "../../../Components/Buttons/CaretButton"
import OpaqueImageView from "../../../Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "../../../navigation/navigate"

export const COVER_IMAGE_HEIGHT = 260

interface AnimatedValue {
  interpolate({}): {}
}

interface Props {
  sale: SaleHeader_sale
  scrollAnim: AnimatedValue
}

export const SaleHeader: React.FC<Props> = ({ sale, scrollAnim }) => {
  const saleTimeDetails = saleTime(sale)

  return (
    <>
      {!!sale.coverImage?.url && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: COVER_IMAGE_HEIGHT,
            width: "100%",
            opacity: scrollAnim.interpolate({
              inputRange: [0, COVER_IMAGE_HEIGHT],
              outputRange: [1, 0],
            }),
            transform: [
              {
                translateY: scrollAnim.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [0, 0, 0.5],
                }),
              },
            ],
          }}
        >
          <OpaqueImageView
            imageURL={sale.coverImage.url}
            style={{
              width: Dimensions.get("window").width,
              height: COVER_IMAGE_HEIGHT,
            }}
          >
            {!!sale.endAt && !!moment().isAfter(sale.endAt) && (
              <Flex
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  width: Dimensions.get("window").width,
                  height: COVER_IMAGE_HEIGHT,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text variant="subtitle" fontWeight="500" color="white">
                  Auction closed
                </Text>
              </Flex>
            )}
          </OpaqueImageView>
        </Animated.View>
      )}
      <View
        style={{
          backgroundColor: "white",
          marginTop: !!sale.coverImage?.url ? COVER_IMAGE_HEIGHT : useScreenDimensions().safeAreaInsets.top + 40,
        }}
      >
        <Flex mx="2" mt="2">
          <Text variant="largeTitle" testID="saleName">
            {sale.name}
          </Text>
          <Flex my="1">
            {saleTimeDetails.absolute !== null && (
              <Text style={{ fontWeight: "bold" }} variant="text">
                {saleTimeDetails.absolute}
              </Text>
            )}
            {!!saleTimeDetails.relative && (
              <Text variant="text" color="black60">
                {saleTimeDetails.relative}
              </Text>
            )}
          </Flex>
          <CaretButton
            text="More info about this auction"
            onPress={() => {
              navigate(`auction/${sale.slug}/info`)
            }}
            withFeedback
          />
        </Flex>
      </View>
    </>
  )
}

export const SaleHeaderContainer = createFragmentContainer(SaleHeader, {
  sale: graphql`
    fragment SaleHeader_sale on Sale {
      name
      slug
      liveStartAt
      endAt
      startAt
      timeZone
      coverImage {
        url
      }
    }
  `,
})
