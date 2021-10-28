import { ActionType, ContextModule, OwnerType, TappedShowGroup } from "@artsy/cohesion"
import { ShowsRail_showsConnection } from "__generated__/ShowsRail_showsConnection.graphql"
import { SectionTitle } from "lib/Components/SectionTitle"
import { ShowCardContainer } from "lib/Components/ShowCard"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Spacer } from "palette"
import React, { useEffect } from "react"
import { FlatList } from "react-native"
import { createFragmentContainer } from "react-relay"
import { useTracking } from "react-tracking"
import { graphql } from "relay-hooks"

interface ShowsRailProps {
  title: string
  showsConnection: ShowsRail_showsConnection
  onHide?: () => void
  onShow?: () => void
}

export const ShowsRail: React.FC<ShowsRailProps> = ({ title, showsConnection, onHide, onShow }) => {
  const tracking = useTracking()

  const shows = extractNodes(showsConnection)

  const hasShows = shows?.length

  useEffect(() => {
    hasShows ? onShow?.() : onHide?.()
  }, [hasShows])

  if (!hasShows) {
    return null
  }

  return (
    <>
      <Flex mx={2}>
        <SectionTitle title={title} />
      </Flex>
      <Flex>
        <FlatList
          horizontal
          initialNumToRender={2}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => <Spacer ml="2" />}
          ListFooterComponent={() => <Spacer ml="2" />}
          ItemSeparatorComponent={() => <Spacer ml="2" />}
          data={shows}
          keyExtractor={(item) => `${item.internalID}`}
          renderItem={({ item, index }) => (
            <ShowCardContainer
              show={item}
              onPress={() => {
                tracking.trackEvent(tracks.tappedThumbnail(item.internalID, item.slug || "", index))
              }}
            />
          )}
        />
      </Flex>
    </>
  )
}

export const ShowsRailFragmentContainer = createFragmentContainer(ShowsRail, {
  showsConnection: graphql`
    fragment ShowsRail_showsConnection on ShowConnection {
      edges {
        node {
          internalID
          slug
          ...ShowCard_show
        }
      }
    }
  `,
})

export const tracks = {
  tappedThumbnail: (showID?: string, showSlug?: string, index?: number): TappedShowGroup => ({
    action: ActionType.tappedShowGroup,
    context_module: ContextModule.showsRail,
    context_screen_owner_type: OwnerType.home,
    destination_screen_owner_type: OwnerType.show,
    destination_screen_owner_id: showID,
    destination_screen_owner_slug: showSlug,
    horizontal_slide_position: index,
    type: "thumbnail",
  }),
}
