import { CommercialButtons_artwork } from "__generated__/CommercialButtons_artwork.graphql"
import { CommercialButtons_me } from "__generated__/CommercialButtons_me.graphql"
import { AuctionTimerState } from "lib/Components/Bidding/Components/Timer"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { getCurrentEmissionState } from "lib/store/GlobalStore"
import { Schema, Track, track as _track } from "lib/utils/track"
import { Button, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { BidButtonFragmentContainer } from "./BidButton"
import { BuyNowButtonFragmentContainer } from "./BuyNowButton"
import { InquiryButtonsFragmentContainer } from "./InquiryButtons"
import { MakeOfferButtonFragmentContainer } from "./MakeOfferButton"

export interface CommercialButtonProps {
  artwork: CommercialButtons_artwork
  me: CommercialButtons_me
  // EditionSetID is passed down from the edition selected by the user
  editionSetID?: string
  auctionState: AuctionTimerState
}

const track: Track<CommercialButtonProps> = _track

@track()
export class CommercialButtons extends React.Component<CommercialButtonProps> {
  @track({
    action_name: Schema.ActionNames.ContactGallery,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.CommercialButtons,
  })
  handleInquiry() {
    SwitchBoard.presentNavigationViewController(this, `/inquiry/${this.props.artwork.slug}`)
  }

  render() {
    const { artwork, me, auctionState } = this.props
    const { isBuyNowable, isAcquireable, isOfferable, isInquireable, isInAuction, editionSets, isForSale } = artwork
    const noEditions = (editionSets && editionSets.length === 0) || !editionSets
    const newFirstInquiry = getCurrentEmissionState().options.AROptionsNewFirstInquiry

    if (isInAuction && artwork.sale && auctionState !== AuctionTimerState.CLOSED && isForSale) {
      return (
        <>
          {isBuyNowable && noEditions ? (
            <>
              <BidButtonFragmentContainer artwork={artwork} me={me} auctionState={auctionState} />
              <Spacer mb={1} />
              <BuyNowButtonFragmentContainer
                variant="secondaryOutline"
                artwork={artwork}
                // @ts-ignore STRICTNESS_MIGRATION
                editionSetID={this.props.editionSetID}
              />
            </>
          ) : (
            <BidButtonFragmentContainer artwork={artwork} me={me} auctionState={auctionState} />
          )}
        </>
      )
    } else if (isOfferable && isAcquireable) {
      return (
        <>
          <BuyNowButtonFragmentContainer
            artwork={artwork}
            // @ts-ignore STRICTNESS_MIGRATION
            editionSetID={this.props.editionSetID}
          />
          <Spacer mb={1} />
          <MakeOfferButtonFragmentContainer
            artwork={artwork}
            // @ts-ignore STRICTNESS_MIGRATION
            editionSetID={this.props.editionSetID}
            variant="secondaryOutline"
          />
        </>
      )
    } else if (isAcquireable) {
      // @ts-ignore STRICTNESS_MIGRATION
      return <BuyNowButtonFragmentContainer artwork={artwork} editionSetID={this.props.editionSetID} />
    } else if (isOfferable) {
      // @ts-ignore STRICTNESS_MIGRATION
      return <MakeOfferButtonFragmentContainer artwork={artwork} editionSetID={this.props.editionSetID} />
    } else if (isInquireable && !newFirstInquiry) {
      return (
        <Button onPress={() => this.handleInquiry()} size="large" block width={100}>
          Contact gallery
        </Button>
      )
    } else if (isInquireable && newFirstInquiry) {
      return <InquiryButtonsFragmentContainer artwork={artwork} editionSetID={this.props.editionSetID} />
    } else {
      return <></>
    }
  }
}

export const CommercialButtonsFragmentContainer = createFragmentContainer(CommercialButtons, {
  artwork: graphql`
    fragment CommercialButtons_artwork on Artwork {
      slug
      isAcquireable
      isOfferable
      isInquireable
      isInAuction
      isBuyNowable
      isForSale
      editionSets {
        id
      }

      sale {
        isClosed
      }

      ...BuyNowButton_artwork
      ...BidButton_artwork
      ...MakeOfferButton_artwork
      ...InquiryButtons_artwork
    }
  `,
  me: graphql`
    fragment CommercialButtons_me on Me {
      ...BidButton_me
    }
  `,
})
