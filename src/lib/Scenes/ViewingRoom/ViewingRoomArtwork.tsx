import { Box, Button, color, EyeOpenedIcon, Flex, Sans, Separator, Serif, Spacer } from "@artsy/palette"
import { ViewingRoomArtwork_selectedArtwork$key } from "__generated__/ViewingRoomArtwork_selectedArtwork.graphql"
import { ViewingRoomArtwork_viewingRoomInfo$key } from "__generated__/ViewingRoomArtwork_viewingRoomInfo.graphql"
import { ViewingRoomArtworkQuery } from "__generated__/ViewingRoomArtworkQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { cm2in } from "lib/utils/conversions"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "lib/utils/placeholders"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import _ from "lodash"
import { LargeCard } from "palette"
import React, { useRef } from "react"
import { FlatList, NativeModules, ScrollView, TouchableHighlight, TouchableWithoutFeedback } from "react-native"
import { useTracking } from "react-tracking"
import { graphql, useFragment, useQuery } from "relay-hooks"
import { ImageCarousel } from "../Artwork/Components/ImageCarousel/ImageCarousel"
import { tagForStatus } from "./Components/ViewingRoomsListItem"

const Constants = NativeModules.ARCocoaConstantsModule
const ApiModule = NativeModules.ARTemporaryAPIModule

interface ViewingRoomArtworkProps {
  selectedArtwork: ViewingRoomArtwork_selectedArtwork$key
  viewingRoomInfo: ViewingRoomArtwork_viewingRoomInfo$key
}

const selectedArtworkFragmentSpec = graphql`
  fragment ViewingRoomArtwork_selectedArtwork on Artwork {
    title
    artistNames
    date
    description
    saleMessage
    href
    slug
    image {
      url(version: "larger")
      aspectRatio
    }
    isHangable
    widthCm
    heightCm
    id
    images {
      ...ImageCarousel_images @relay(mask: false) # We need this because ImageCarousel uses regular react-relay and we have relay-hooks here.
    }
  }
`

const viewingRoomInfoFragmentSpec = graphql`
  fragment ViewingRoomArtwork_viewingRoomInfo on ViewingRoom {
    title
    partner {
      name
    }
    heroImage: image {
      imageURLs {
        normalized
      }
    }
    status
    distanceToOpen
    distanceToClose
    internalID
    slug
  }
`

export const ViewingRoomArtworkContainer: React.FC<ViewingRoomArtworkProps> = props => {
  const selectedArtwork = useFragment(selectedArtworkFragmentSpec, props.selectedArtwork)
  const vrInfo = useFragment(viewingRoomInfoFragmentSpec, props.viewingRoomInfo)

  const navRef = useRef(null)
  const { height: screenHeight } = useScreenDimensions()

  const { trackEvent } = useTracking()

  const viewInAR = () => {
    const [widthIn, heightIn] = [selectedArtwork.widthCm!, selectedArtwork.heightCm!].map(cm2in)

    ApiModule.presentAugmentedRealityVIR(
      selectedArtwork.image!.url!,
      widthIn,
      heightIn,
      selectedArtwork.slug,
      selectedArtwork.id
    )
  }

  const moreImages = _.drop(selectedArtwork.images!, 1)

  const tag = tagForStatus(vrInfo.status, vrInfo.distanceToOpen, vrInfo.distanceToClose)

  return (
    <ProvideScreenTracking
      info={tracks.screen(vrInfo.internalID, vrInfo.slug, selectedArtwork.id, selectedArtwork.slug)}
    >
      <ScrollView ref={navRef}>
        <Flex>
          <ImageCarousel images={[selectedArtwork.images![0]] as any} cardHeight={screenHeight} />
          {!!(Constants.AREnabled && selectedArtwork.isHangable) && (
            <Flex
              position="absolute"
              bottom="1"
              right="1"
              backgroundColor="white100"
              borderColor="black5"
              borderWidth={1}
              borderRadius={2}
            >
              <TouchableWithoutFeedback onPress={viewInAR}>
                <Flex flexDirection="row" mx="1" height={24} alignItems="center">
                  <EyeOpenedIcon />
                  <Spacer ml={5} />
                  <Sans size="2">View on wall</Sans>
                </Flex>
              </TouchableWithoutFeedback>
            </Flex>
          )}
        </Flex>
        <Box mt="2" mx="2">
          <Sans size="5t" color="black100" weight="medium">
            {selectedArtwork.artistNames}
          </Sans>
          <Sans size="4t" color="black60">
            {selectedArtwork.title}, {selectedArtwork.date}
          </Sans>
          <Spacer mt="2" />
          <Sans size="4t" color="black100">
            {selectedArtwork.saleMessage}
          </Sans>
          {!!selectedArtwork.description && (
            <>
              <Spacer mt="2" />
              <Serif size="4t">{selectedArtwork.description}</Serif>
            </>
          )}
          <Spacer mt="4" />
          <Button
            variant="primaryBlack"
            size="medium"
            block
            onPress={() => {
              trackEvent(tracks.tap(vrInfo.internalID, vrInfo.slug, selectedArtwork.id, selectedArtwork.slug))
              SwitchBoard.presentNavigationViewController(navRef.current!, selectedArtwork.href!)
            }}
          >
            View more details
          </Button>
        </Box>

        {moreImages.length > 0 && (
          <>
            <Box mx="2">
              <Spacer mt="3" />
              <Separator />
              <Spacer mt="3" />
              <Sans size="4" weight="medium">
                More images
              </Sans>
              <Spacer mt="2" />
            </Box>
            <FlatList
              data={moreImages}
              keyExtractor={(_item, index) => `${index}`}
              renderItem={({ item }) => <ImageCarousel images={[item] as any} cardHeight={screenHeight} />}
              ItemSeparatorComponent={() => <Spacer mt={0.5} />}
            />
          </>
        )}

        <Box mx="2">
          <Spacer mt="3" />
          <Separator />
          <Spacer mt="3" />
          <Sans size="4" weight="medium">
            In viewing room
          </Sans>
          <Spacer mt="2" />
        </Box>
        <TouchableHighlight
          onPress={() => SwitchBoard.presentNavigationViewController(navRef.current!, `/viewing-room/${vrInfo.slug!}`)}
          underlayColor={color("white100")}
          activeOpacity={0.8}
        >
          <LargeCard
            title={vrInfo.title}
            subtitle={vrInfo.partner!.name!}
            image={vrInfo.heroImage?.imageURLs?.normalized ?? ""}
            tag={tag}
          />
        </TouchableHighlight>
      </ScrollView>
    </ProvideScreenTracking>
  )
}

const tracks = {
  screen: (vrId: string, vrSlug: string, artworkId: string, artworkSlug: string) => ({
    screen: Schema.PageNames.ViewingRoomArtworkPage,
    context_screen: Schema.PageNames.ViewingRoomArtworkPage,
    context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
    context_screen_owner_id: vrId,
    context_screen_owner_slug: vrSlug,
    artwork_id: artworkId,
    artwork_slug: artworkSlug,
  }),
  tap: (vrId: string, vrSlug: string, artworkId: string, artworkSlug: string) => ({
    action: Schema.ActionNames.TappedViewMoreDetails,
    context_screen: Schema.PageNames.ViewingRoomArtworks,
    context_screen_owner_type: Schema.OwnerEntityTypes.ViewingRoom,
    context_screen_owner_id: vrId,
    context_screen_owner_slug: vrSlug,
    destination_screen: Schema.PageNames.ArtworkPage,
    destination_screen_owner_id: artworkId,
    destination_screen_owner_slug: artworkSlug,
  }),
}

const query = graphql`
  query ViewingRoomArtworkQuery($viewingRoomID: ID!, $artworkID: String!) {
    artwork(id: $artworkID) {
      ...ViewingRoomArtwork_selectedArtwork
    }

    viewingRoom(id: $viewingRoomID) {
      ...ViewingRoomArtwork_viewingRoomInfo
    }
  }
`

const Placeholder = () => (
  <ProvidePlaceholderContext>
    <PlaceholderBox width="100%" height="60%" />
    <Flex mt="2">
      <PlaceholderText width={130 + Math.random() * 100} marginTop={10} />
      <PlaceholderText width={100 + Math.random() * 100} marginTop={8} />
      <PlaceholderText width={100 + Math.random() * 100} marginTop={15} />
    </Flex>
  </ProvidePlaceholderContext>
)

export const ViewingRoomArtworkQueryRenderer: React.FC<{ viewing_room_id: string; artwork_id: string }> = ({
  viewing_room_id: viewingRoomID,
  artwork_id: artworkID,
}) => {
  const { props, error } = useQuery<ViewingRoomArtworkQuery>(
    query,
    { viewingRoomID, artworkID },
    { networkCacheConfig: { force: true } }
  )
  if (props) {
    return <ViewingRoomArtworkContainer selectedArtwork={props.artwork!} viewingRoomInfo={props.viewingRoom!} />
  }
  if (error) {
    throw error
  }

  return <Placeholder />
}
