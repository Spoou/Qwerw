import { OrderHistoryRow_order } from "__generated__/OrderHistoryRow_order.graphql"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { getTrackingUrl } from "lib/utils/getTrackingUrl"
import moment from "moment"
import { Box, Button, Flex, Text } from "palette"
import React from "react"
import { Image, Linking } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface OrderHistoryRowProps {
  order: OrderHistoryRow_order
}

export const OrderHistoryRow: React.FC<OrderHistoryRowProps> = ({ order }) => {
  const [lineItem] = extractNodes(order?.lineItems)
  const { artwork } = lineItem
  const trackingUrl = getTrackingUrl(lineItem)
  const orderIsInactive = order.state === "CANCELED" || order.state === "REFUNDED"

  return (
    <Flex width="100%" data-test-id="order-container">
      <Flex mb={1}>
        <Flex flexDirection="row" justifyContent="space-between">
          <Flex justifyContent="center" data-test-id="image-container" mr={2}>
            {!!artwork?.image ? (
              <Image
                source={{ uri: artwork?.image?.resized?.url }}
                style={{ height: 50, width: 50 }}
                data-test-id="image"
              />
            ) : (
              <Box width={50} height={50} backgroundColor="black10" data-test-id="image-box" />
            )}
          </Flex>
          <Flex width="40%" flexGrow={1} mr={2}>
            <Text variant="mediumText" data-test-id="artist-names" ellipsizeMode="tail" numberOfLines={1}>
              {artwork?.artistNames}
            </Text>
            <Text variant="caption" color="black60" data-test-id="partner-name" ellipsizeMode="tail" numberOfLines={1}>
              {artwork?.partner?.name}
            </Text>
            <Text variant="caption" color="black60" data-test-id="date">
              {moment(order.createdAt).format("l")}
            </Text>
          </Flex>
          <Flex>
            <Text textAlign="right" variant="text" data-test-id="price">
              {order.buyerTotal}
            </Text>
            <Text
              textAlign="right"
              variant="caption"
              color={order.state === "CANCELED" ? "red100" : "black60"}
              style={{ textTransform: "capitalize" }}
              data-test-id="order-status"
            >
              {order.state.toLowerCase()}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      {trackingUrl ? (
        <Flex flexDirection="row" justifyContent="space-between" mb={1}>
          <Box width="50%" paddingRight={0.5}>
            <Button
              block
              variant="secondaryGray"
              onPress={() => navigate(`/user/purchases/${order.internalID}`)}
              data-test-id="view-order-button"
            >
              View Order
            </Button>
          </Box>
          <Box width="50%" paddingLeft={0.5}>
            <Button
              paddingLeft={0.5}
              width="50%"
              block
              variant="primaryBlack"
              onPress={() => Linking.openURL(trackingUrl)}
              data-test-id="track-package-button"
            >
              Track Package
            </Button>
          </Box>
        </Flex>
      ) : (
        <Box data-test-id="view-order-button-box">
          {!orderIsInactive && (
            <Button
              mb={1}
              block
              variant="secondaryGray"
              onPress={() => navigate(`/user/purchases/${order.internalID}`)}
              data-test-id="view-order-button"
            >
              View Order
            </Button>
          )}
        </Box>
      )}
    </Flex>
  )
}

export const OrderHistoryRowContainer = createFragmentContainer(OrderHistoryRow, {
  order: graphql`
    fragment OrderHistoryRow_order on CommerceOrder {
      internalID
      state
      buyerTotal(precision: 2)
      createdAt
      itemsTotal
      lineItems(first: 1) {
        edges {
          node {
            shipment {
              trackingUrl
              trackingNumber
            }
            artwork {
              image {
                resized(width: 55) {
                  url
                }
              }
              partner {
                name
              }
              title
              artistNames
            }
            fulfillments(first: 1) {
              edges {
                node {
                  trackingId
                }
              }
            }
          }
        }
      }
    }
  `,
})
