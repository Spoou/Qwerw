import { editCollectedArtwork } from "@artsy/cohesion"
import { MyCollectionArtworkFullDetails_artwork } from "__generated__/MyCollectionArtworkFullDetails_artwork.graphql"
import { MyCollectionArtworkFullDetailsQuery } from "__generated__/MyCollectionArtworkFullDetailsQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { navigate, popParentViewController, popToRoot } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { GlobalStore } from "lib/store/GlobalStore"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Flex, Spacer } from "palette"
import React from "react"
import { ActivityIndicator } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { MyCollectionArtworkMetaFragmentContainer } from "../Artwork/Components/MyCollectionArtworkMeta"

const MyCollectionArtworkFullDetails: React.FC<{ artwork: MyCollectionArtworkFullDetails_artwork }> = (props) => {
  const { trackEvent } = useTracking()
  return (
    <Flex>
      <FancyModalHeader
        rightButtonText="Edit"
        onRightButtonPress={() => {
          trackEvent(tracks.editCollectedArtwork(props.artwork.internalID, props.artwork.slug))
          GlobalStore.actions.myCollection.artwork.startEditingArtwork(props.artwork as any)
          navigate("my-collection/add-my-collection-artwork", {
            passProps: {
              mode: "edit",
              artwork: props.artwork,
              onSuccess: () => {
                popParentViewController()
              },
              onDelete: () => {
                setTimeout(() => {
                  popToRoot()
                }, 50)
              },
            },
          })
        }}
      >
        Artwork Details
      </FancyModalHeader>
      <Spacer my={0.5} />
      <MyCollectionArtworkMetaFragmentContainer artwork={props.artwork} viewAll />
    </Flex>
  )
}

export const MyCollectionArtworkFullDetailsContainer = createFragmentContainer(MyCollectionArtworkFullDetails, {
  artwork: graphql`
    fragment MyCollectionArtworkFullDetails_artwork on Artwork {
      ...MyCollectionArtwork_sharedProps @relay(mask: false)
      ...MyCollectionArtworkMeta_artwork
      internalID
      slug
    }
  `,
})

export const MyCollectionArtworkFullDetailsQueryRenderer: React.FC<{
  artworkSlug: string
}> = ({ artworkSlug }) => {
  return (
    <QueryRenderer<MyCollectionArtworkFullDetailsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyCollectionArtworkFullDetailsQuery($artworkSlug: String!) {
          artwork(id: $artworkSlug) {
            ...MyCollectionArtworkFullDetails_artwork
          }
        }
      `}
      variables={{
        artworkSlug,
      }}
      render={renderWithPlaceholder({
        Container: MyCollectionArtworkFullDetailsContainer,
        renderPlaceholder: () => (
          <Flex flexGrow={1}>
            <FancyModalHeader>Artwork Details</FancyModalHeader>
            <Flex alignItems="center" justifyContent="center" flexGrow={1}>
              <ActivityIndicator />
            </Flex>
          </Flex>
        ),
      })}
    />
  )
}

const tracks = {
  editCollectedArtwork: (internalID: string, slug: string) => {
    return editCollectedArtwork({ contextOwnerId: internalID, contextOwnerSlug: slug })
  },
}
