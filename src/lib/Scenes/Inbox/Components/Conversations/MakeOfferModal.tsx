import { ActionType, OwnerType } from "@artsy/cohesion"
import { MakeOfferModal_artwork } from "__generated__/MakeOfferModal_artwork.graphql"
import { MakeOfferModalQuery, MakeOfferModalQueryResponse } from "__generated__/MakeOfferModalQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { dismissModal } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { CollapsibleArtworkDetailsFragmentContainer as CollapsibleArtworkDetails } from "lib/Scenes/Artwork/Components/CommercialButtons/CollapsibleArtworkDetails"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { BorderBox, Button, Flex, Text } from "palette"
import React, { useState } from "react"
import { ScrollView, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { InquiryMakeOfferButtonFragmentContainer as InquiryMakeOfferButton } from "./InquiryMakeOfferButton"

import { EditionSelectBox } from "./EditionSelectBox"

interface MakeOfferModalProps {
  artwork: MakeOfferModal_artwork
  conversationID: string
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({ ...props }) => {
  const { artwork, conversationID } = props
  const { editionSets } = artwork

  const knownEditionSets = (editionSets as unknown) as Array<{ internalID: string }>
  const [selectedEdition, setSelectedEdition] = useState<string | null>(
    editionSets?.length === 1 ? knownEditionSets[0].internalID : null
  )

  const selectEdition = (editionSetID: string, isAvailable?: boolean) => {
    if (isAvailable) {
      setSelectedEdition(editionSetID)
    }
  }

  return (
    <View>
      <FancyModalHeader rightButtonDisabled hideBottomDivider>
        Make Offer
      </FancyModalHeader>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Flex p={1.5}>
          <Text variant="largeTitle">Confirm Artwork</Text>
          <Text variant="small" color="black60">
            Make sure the artwork below matches the intended work you're making an offer on.
          </Text>
          <BorderBox p={0} my={2}>
            <CollapsibleArtworkDetails hasSeparator={false} artwork={artwork} />
          </BorderBox>
          {!!artwork.isEdition && artwork.editionSets!.length > 1 && (
            <Flex mb={1}>
              <Text color="black100" mb={1}>
                Which edition are you interested in?
              </Text>
              {artwork.editionSets?.map((edition) => (
                <EditionSelectBox
                  edition={edition!}
                  selected={edition!.internalID === selectedEdition}
                  onPress={selectEdition}
                  key={`edition-set-${edition?.internalID}`}
                />
              ))}
            </Flex>
          )}
          <InquiryMakeOfferButton
            variant="primaryBlack"
            buttonText="Confirm"
            artwork={artwork}
            disabled={!!artwork.isEdition && !selectedEdition}
            editionSetID={selectedEdition ? selectedEdition : null}
            conversationID={conversationID}
          />
          <Button
            mt={1}
            size="large"
            variant="secondaryOutline"
            block
            width={100}
            onPress={() => {
              dismissModal()
            }}
          >
            Cancel
          </Button>
          <Flex bg="black5" p={1} mt={1} mb={6}>
            <Text variant="small">
              Making an offer doesn’t guarantee you the work, as the seller might be receiving competing offers.
            </Text>
          </Flex>
        </Flex>
      </ScrollView>
    </View>
  )
}

export const MakeOfferModalFragmentContainer = createFragmentContainer(MakeOfferModal, {
  artwork: graphql`
    fragment MakeOfferModal_artwork on Artwork {
      ...CollapsibleArtworkDetails_artwork
      ...InquiryMakeOfferButton_artwork
      internalID
      isEdition
      editionSets {
        internalID
        editionOf
        isOfferableFromInquiry
        listPrice {
          ... on Money {
            display
          }
          ... on PriceRange {
            display
          }
        }
        dimensions {
          cm
          in
        }
      }
    }
  `,
})

export const MakeOfferModalQueryRenderer: React.FC<{
  artworkID: string
  conversationID: string
}> = ({ artworkID, conversationID }) => {
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={{
        action: ActionType.screen,
        context_screen_owner_type: OwnerType.conversationMakeOfferConfirmArtwork,
        context_screen_referrer_type: OwnerType.conversation,
      }}
    >
      <QueryRenderer<MakeOfferModalQuery>
        environment={defaultEnvironment}
        query={graphql`
          query MakeOfferModalQuery($artworkID: String!) {
            artwork(id: $artworkID) {
              ...MakeOfferModal_artwork
            }
          }
        `}
        variables={{
          artworkID,
        }}
        render={renderWithLoadProgress<MakeOfferModalQueryResponse>(({ artwork }) => (
          <MakeOfferModalFragmentContainer artwork={artwork!} conversationID={conversationID} />
        ))}
      />
    </ProvideScreenTrackingWithCohesionSchema>
  )
}
