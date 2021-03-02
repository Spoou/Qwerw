import { ReviewOfferButton_order } from "__generated__/ReviewOfferButton_order.graphql"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { useEventTiming } from "lib/utils/useEventTiming"
import { DateTime } from "luxon"
import { AlertCircleFillIcon, ArrowRightIcon, Flex, MoneyFillIcon, Text } from "palette"
import React, { useEffect } from "react"
import { TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { returnButtonMessaging } from "./utils/returnButtonMessaging"

export interface ReviewOfferButtonProps {
  order: ReviewOfferButton_order
}

export const ReviewOfferButton: React.FC<ReviewOfferButtonProps> = ({ order }) => {
  const [buttonBackgroundColor, setButtonBackgroundColor] = React.useState("green100")
  const [buttonMessage, setButtonMessage] = React.useState("")
  const [buttonSubMessage, setButtonSubMessage] = React.useState("Tap to view")
  const [showMoneyIconInButton, setShowMoneyIconInButton] = React.useState(true)

  const { hours } = useEventTiming({
    currentTime: DateTime.local().toString(),
    startAt: order.lastOffer?.createdAt,
    endAt: order.stateExpiresAt || undefined,
  })

  useEffect(() => {
    const nodeCount = extractNodes(order.offers).length

    const { backgroundColor, message, subMessage, showMoneyIcon } = returnButtonMessaging({
      state: order.state,
      stateReason: order.stateReason,
      nodeCount,
      lastOfferFromParticipant: order.lastOffer?.fromParticipant,
      hoursTillExpiration: hours,
    })

    setButtonMessage(message)
    setButtonSubMessage(subMessage)
    setShowMoneyIconInButton(showMoneyIcon)
    setButtonBackgroundColor(backgroundColor)
  })

  const onTap = (orderID: string | null, state: string | null) => {
    if (state === "PENDING") {
      // ORDER CONFIRMATION PAGE DOESN'T EXIST YET
    } else {
      navigate(`/orders/${orderID}/review`)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => onTap(order?.internalID, order?.state)}>
      <Flex
        px={2}
        justifyContent="space-between"
        alignItems="center"
        bg={buttonBackgroundColor}
        flexDirection="row"
        height={60}
      >
        <Flex flexDirection="row">
          {showMoneyIconInButton ? (
            <AlertCircleFillIcon mt="3px" fill="white100" />
          ) : (
            <MoneyFillIcon mt="3px" fill="white100" />
          )}
          <Flex flexDirection="column" pl={1}>
            <Text color="white100" variant="mediumText">
              {buttonMessage}
            </Text>
            <Text color="white100" variant="caption">
              {buttonSubMessage}
            </Text>
          </Flex>
        </Flex>
        <Flex>
          <ArrowRightIcon fill="white100" />
        </Flex>
      </Flex>
    </TouchableWithoutFeedback>
  )
}

export const ReviewOfferButtonFragmentContainer = createFragmentContainer(ReviewOfferButton, {
  order: graphql`
    fragment ReviewOfferButton_order on CommerceOrder {
      __typename
      internalID
      state
      stateReason
      stateExpiresAt(format: "MMM D")
      ... on CommerceOfferOrder {
        lastOffer {
          fromParticipant
          createdAt
        }
        offers(first: 5) {
          edges {
            node {
              internalID
            }
          }
        }
      }
    }
  `,
})
