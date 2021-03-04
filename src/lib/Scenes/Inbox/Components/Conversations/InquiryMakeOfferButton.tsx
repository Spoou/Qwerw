import { InquiryMakeOfferButtonOrderMutation } from "__generated__/InquiryMakeOfferButtonOrderMutation.graphql"
import { InquiryMakeOfferButton_artwork } from "__generated__/MakeOfferButton_artwork.graphql"
import { navigate } from "lib/navigation/navigate"
import { Schema, Track, track as _track } from "lib/utils/track"
import { Button, ButtonVariant } from "palette"
import React from "react"
import { Alert } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

export interface InquiryMakeOfferButtonProps {
  artwork: InquiryMakeOfferButton_artwork
  relay: RelayProp
  // EditionSetID is passed down from the edition selected by the user
  editionSetID: string | null
  variant?: ButtonVariant
  buttonText?: string
  impulseConversationId: string
}

export interface State {
  isCommittingCreateOfferOrderMutation: boolean
  showCheckoutFlowModal: boolean
  orderUrl: string | null
}

// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
const track: Track<InquiryMakeOfferButtonProps, State> = _track

@track()
export class InquiryMakeOfferButton extends React.Component<InquiryMakeOfferButtonProps, State> {
  state = {
    isCommittingCreateOfferOrderMutation: false,
    showCheckoutFlowModal: false,
    orderUrl: null,
  }

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  onMutationError(error) {
    Alert.alert("Sorry, we couldn't process the request.", "Please try again or contact orders@artsy.net for help.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Retry",
        onPress: () => {
          this.handleCreateInquiryOfferOrder()
        },
      },
    ])
    console.log("src/lib/Scenes/Artwork/Components/InquiryMakeOfferButton.tsx", error)
  }

  // @track({
  //   action_name: Schema.ActionNames.MakeOffer,
  //   action_type: Schema.ActionTypes.Tap,
  //   context_module: Schema.ContextModules.Conversation,
  // })
  handleCreateInquiryOfferOrder() {
    const { relay, artwork, editionSetID } = this.props
    const { isCommittingCreateOfferOrderMutation } = this.state
    const { internalID } = artwork

    if (isCommittingCreateOfferOrderMutation) {
      return
    }

    this.setState({ isCommittingCreateOfferOrderMutation: true }, () => {
      if (relay && relay.environment) {
        commitMutation<InquiryMakeOfferButtonOrderMutation>(relay.environment, {
          mutation: graphql`
            mutation InquiryMakeOfferButtonOrderMutation($input: CommerceCreateInquiryOfferOrderWithArtworkInput!) {
              commerceCreateInquiryOfferOrderWithArtwork(input: $input) {
                orderOrError {
                  __typename
                  ... on CommerceOrderWithMutationSuccess {
                    order {
                      internalID
                      mode
                    }
                  }
                  ... on CommerceOrderWithMutationFailure {
                    error {
                      type
                      code
                      data
                    }
                  }
                }
              }
            }
          `,
          variables: {
            input: {
              artworkId: internalID,
              editionSetId: editionSetID,
              impulseConversationId: this.props.impulseConversationId,
            },
          },
          onCompleted: (data) => {
            this.setState({ isCommittingCreateOfferOrderMutation: false }, () => {
              const {
                // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
                commerceCreateInquiryOfferOrderWithArtwork: { orderOrError },
              } = data
              if (orderOrError.__typename === "CommerceOrderWithMutationFailure") {
                this.onMutationError(orderOrError.error)
              } else if (orderOrError.__typename === "CommerceOrderWithMutationSuccess") {
                navigate(`/orders/${orderOrError.order.internalID}`, {
                  modal: true,
                  passProps: { orderID: orderOrError.order.internalID },
                })
              }
            })
          },
          onError: (error) =>
            this.setState({ isCommittingCreateOfferOrderMutation: false }, () => this.onMutationError(error)),
        })
      }
    })
  }

  render() {
    const { isCommittingCreateOfferOrderMutation } = this.state

    return (
      <Button
        onPress={() => this.handleCreateInquiryOfferOrder()}
        loading={isCommittingCreateOfferOrderMutation}
        size="large"
        block
        width={100}
        variant={this.props.variant}
        haptic
      >
        {this.props.buttonText ? this.props.buttonText : "Make offer"}
      </Button>
    )
  }
}

export const InquiryMakeOfferButtonFragmentContainer = createFragmentContainer(InquiryMakeOfferButton, {
  artwork: graphql`
    fragment InquiryMakeOfferButton_artwork on Artwork {
      internalID
    }
  `,
})
