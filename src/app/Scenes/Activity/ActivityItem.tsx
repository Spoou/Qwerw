import { ActionType } from "@artsy/cohesion"
import { ClickedActivityPanelNotificationItem } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { ActivityItem_item$key } from "__generated__/ActivityItem_item.graphql"
import { OpaqueImageView } from "app/Components/OpaqueImageView2"
import {
  ExpiresInTimer,
  shouldDisplayExpiresInTimer,
} from "app/Scenes/Activity/components/ExpiresInTimer"
import { useMarkNotificationAsRead } from "app/Scenes/Activity/mutations/useMarkNotificationAsRead"
import { navigateToActivityItem } from "app/Scenes/Activity/utils/navigateToActivityItem"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { TouchableOpacity } from "react-native"
import { graphql, useFragment } from "react-relay"
import { useTracking } from "react-tracking"
import { ActivityItemTypeLabel } from "./ActivityItemTypeLabel"
import { isArtworksBasedNotification } from "./utils/isArtworksBasedNotification"

interface ActivityItemProps {
  item: ActivityItem_item$key
}

const UNREAD_INDICATOR_SIZE = 8
const ARTWORK_IMAGE_SIZE = 55

export const ActivityItem: React.FC<ActivityItemProps> = (props) => {
  const enableNavigateToASingleNotification = useFeatureFlag("AREnableSingleActivityPanelScreen")
  const enableNewActivityPanelManagement = useFeatureFlag("AREnableSingleActivityPanelScreen") // true // useFeatureFlag("AREnableNewActivityPanelManagement")

  const markAsRead = useMarkNotificationAsRead()
  const tracking = useTracking()
  const item = useFragment(activityItemFragment, props.item)
  const artworks = extractNodes(item.artworksConnection)
  const artworksCount = item.objectsCount
  const remainingArtworksCount = artworksCount - 4
  const plural = artworksCount > 1
  const shouldDisplayCounts =
    isArtworksBasedNotification(item.notificationType) && remainingArtworksCount > 0

  const handlePress = () => {
    tracking.trackEvent(tracks.tappedNotification(item.notificationType))

    if (item.isUnread) {
      markAsRead(item)
    }

    if (enableNavigateToASingleNotification) {
      navigate(`/notification/${item.internalID}`)
    } else {
      navigateToActivityItem(item.targetHref)
    }
  }

  if (enableNewActivityPanelManagement) {
    return (
      <TouchableOpacity activeOpacity={0.65} onPress={handlePress}>
        <Flex flexDirection="row" alignItems="center">
          <Flex flex={1}>
            <Flex flexDirection="column" py={2}>
              <Flex py={1} flexDirection="row" alignItems="center">
                {artworks.map((artwork) => {
                  return (
                    <Flex
                      key={`${item.internalID}-${artwork.internalID}`}
                      mr={1}
                      accessibilityLabel="Activity Artwork Image"
                    >
                      <OpaqueImageView
                        imageURL={artwork.image?.preview?.src}
                        width={ARTWORK_IMAGE_SIZE}
                        height={ARTWORK_IMAGE_SIZE}
                      />
                    </Flex>
                  )
                })}
                {!!shouldDisplayCounts && (
                  <Text variant="xs" color="black60" accessibilityLabel="Remaining artworks count">
                    + {remainingArtworksCount}
                  </Text>
                )}
              </Flex>

              <Text variant="sm-display" fontWeight="bold">
                {artworksCount} new work{plural ? "s" : ""} by {item.title}
              </Text>

              <Flex flexDirection="row">
                <ActivityItemTypeLabel notificationType={item.notificationType} />

                <Text variant="xs">{item.publishedAt}</Text>
              </Flex>
            </Flex>
          </Flex>
          {!!item.isUnread && (
            <Flex
              width={UNREAD_INDICATOR_SIZE}
              height={UNREAD_INDICATOR_SIZE}
              borderRadius={UNREAD_INDICATOR_SIZE / 2}
              bg="blue100"
              accessibilityLabel="Unread notification indicator"
            />
          )}
        </Flex>
      </TouchableOpacity>
    )
  }
  return (
    <TouchableOpacity activeOpacity={0.65} onPress={handlePress}>
      <Flex py={2} flexDirection="row" alignItems="center">
        <Flex flex={1}>
          <Flex flexDirection="row">
            <ActivityItemTypeLabel notificationType={item.notificationType} />

            <Text variant="xs" color="black60">
              {item.publishedAt}
            </Text>
          </Flex>

          <Text variant="sm-display" fontWeight="bold">
            {item.title}
          </Text>

          {item.notificationType !== "PARTNER_OFFER_CREATED" && (
            <Text variant="sm-display">{item.message}</Text>
          )}

          {shouldDisplayExpiresInTimer(item) && <ExpiresInTimer item={item} />}

          <Spacer y={1} />

          <Flex flexDirection="row" alignItems="center">
            {artworks.map((artwork) => {
              return (
                <Flex
                  key={`${item.internalID}-${artwork.internalID}`}
                  mr={1}
                  accessibilityLabel="Activity Artwork Image"
                >
                  <OpaqueImageView
                    imageURL={artwork.image?.preview?.src}
                    width={ARTWORK_IMAGE_SIZE}
                    height={ARTWORK_IMAGE_SIZE}
                  />
                </Flex>
              )
            })}

            {!!shouldDisplayCounts && (
              <Text variant="xs" color="black60" accessibilityLabel="Remaining artworks count">
                + {remainingArtworksCount}
              </Text>
            )}
          </Flex>
        </Flex>

        {!!item.isUnread && (
          <Flex
            width={UNREAD_INDICATOR_SIZE}
            height={UNREAD_INDICATOR_SIZE}
            borderRadius={UNREAD_INDICATOR_SIZE / 2}
            bg="blue100"
            accessibilityLabel="Unread notification indicator"
          />
        )}
      </Flex>
    </TouchableOpacity>
  )
}

const activityItemFragment = graphql`
  fragment ActivityItem_item on Notification {
    internalID
    id
    title
    message
    publishedAt(format: "RELATIVE")
    targetHref
    isUnread
    notificationType
    objectsCount

    item {
      ... on PartnerOfferCreatedNotificationItem {
        available
        expiresAt
      }
    }

    artworksConnection(first: 4) {
      edges {
        node {
          internalID
          title
          image {
            aspectRatio
            preview: cropped(width: 116, height: 116, version: "normalized") {
              src
            }
          }
        }
      }
    }
  }
`

const tracks = {
  tappedNotification: (notificationType: string): ClickedActivityPanelNotificationItem => ({
    action: ActionType.clickedActivityPanelNotificationItem,
    notification_type: notificationType,
  }),
}
