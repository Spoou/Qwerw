import { Spacer, Flex, Join } from "@artsy/palette-mobile"
import { ArtworkCommercialButtons_artwork$key } from "__generated__/ArtworkCommercialButtons_artwork.graphql"
import { ArtworkCommercialButtons_me$key } from "__generated__/ArtworkCommercialButtons_me.graphql"
import { ArtworkCommercialButtons_partnerOffer$key } from "__generated__/ArtworkCommercialButtons_partnerOffer.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ArtworkStore } from "app/Scenes/Artwork/ArtworkStore"
import { BuyNowButton } from "app/Scenes/Artwork/Components/CommercialButtons/BuyNowButton"
import { InquiryButtonsFragmentContainer } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryButtons"
import { MakeOfferButtonFragmentContainer } from "app/Scenes/Artwork/Components/CommercialButtons/MakeOfferButton"
import { getTimer } from "app/utils/getTimer"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Children } from "react"
import { useFragment, graphql } from "react-relay"
import { BidButtonFragmentContainer } from "./CommercialButtons/BidButton"

interface ArtworkCommercialButtonsProps {
  artwork: ArtworkCommercialButtons_artwork$key
  me: ArtworkCommercialButtons_me$key
  partnerOffer: ArtworkCommercialButtons_partnerOffer$key
}

const RowContainer: React.FC = ({ children }) => {
  const childArray = Children.map(children, (child) => {
    return <Flex flex={1}>{child}</Flex>
  })

  return (
    <Flex flexDirection="row" alignItems="center">
      <Join separator={<Spacer x={1} />}>{childArray}</Join>
    </Flex>
  )
}

export const ArtworkCommercialButtons: React.FC<ArtworkCommercialButtonsProps> = ({
  artwork,
  partnerOffer,
  me,
}) => {
  const artworkData = useFragment(artworkFragment, artwork)
  const meData = useFragment(meFragment, me)
  const partnerOfferData = useFragment(partnerOfferFragment, partnerOffer)
  const selectedEditionId = ArtworkStore.useStoreState((state) => state.selectedEditionId)
  const auctionState = ArtworkStore.useStoreState((state) => state.auctionState)

  const AREnablePartnerOfferOnArtworkScreen = useFeatureFlag("AREnablePartnerOfferOnArtworkScreen")
  const { hasEnded: partnerOfferEnded } = getTimer(partnerOfferData?.endAt || "")

  const isBiddableInAuction = artworkData.isInAuction && artworkData.sale
  const canTakeCommercialAction =
    artworkData.isAcquireable ||
    artworkData.isOfferable ||
    artworkData.isInquireable ||
    isBiddableInAuction
  const noEditions = !artworkData.editionSets || artworkData.editionSets.length === 0

  const hasActivePartnerOffer =
    AREnablePartnerOfferOnArtworkScreen && partnerOfferData?.isAvailable && !partnerOfferEnded

  if (!canTakeCommercialAction) {
    return null
  }

  if (isBiddableInAuction) {
    if (artworkData.isBuyNowable && noEditions) {
      return (
        <RowContainer>
          <BidButtonFragmentContainer
            artwork={artworkData}
            me={meData}
            auctionState={auctionState as AuctionTimerState}
            variant="outline"
          />
          <BuyNowButton
            partnerOffer={partnerOfferData}
            artwork={artworkData}
            editionSetID={selectedEditionId}
            renderSaleMessage
          />
        </RowContainer>
      )
    }

    return (
      <BidButtonFragmentContainer
        artwork={artworkData}
        me={meData}
        auctionState={auctionState as AuctionTimerState}
      />
    )
  }

  if (artworkData.isOfferable && artworkData.isAcquireable) {
    return (
      <RowContainer>
        <MakeOfferButtonFragmentContainer
          artwork={artworkData}
          editionSetID={selectedEditionId}
          variant="outline"
        />
        <BuyNowButton
          partnerOffer={partnerOfferData}
          artwork={artworkData}
          editionSetID={selectedEditionId}
        />
      </RowContainer>
    )
  }

  if (artworkData.isAcquireable) {
    return (
      <BuyNowButton
        partnerOffer={partnerOfferData}
        artwork={artworkData}
        editionSetID={selectedEditionId}
      />
    )
  }

  if (artworkData.isInquireable && artworkData.isOfferable) {
    if (hasActivePartnerOffer) {
      return (
        <RowContainer>
          <InquiryButtonsFragmentContainer artwork={artworkData} variant="outline" block />
          <BuyNowButton
            partnerOffer={partnerOfferData}
            artwork={artworkData}
            editionSetID={selectedEditionId}
          />
        </RowContainer>
      )
    }

    return (
      <RowContainer>
        <InquiryButtonsFragmentContainer artwork={artworkData} variant="outline" block />
        <MakeOfferButtonFragmentContainer artwork={artworkData} editionSetID={selectedEditionId} />
      </RowContainer>
    )
  }

  if (artworkData.isOfferable) {
    if (hasActivePartnerOffer) {
      return (
        <RowContainer>
          <MakeOfferButtonFragmentContainer
            artwork={artworkData}
            editionSetID={selectedEditionId}
            variant="outline"
          />
          <BuyNowButton
            partnerOffer={partnerOfferData}
            artwork={artworkData}
            editionSetID={selectedEditionId}
          />
        </RowContainer>
      )
    }

    return (
      <MakeOfferButtonFragmentContainer artwork={artworkData} editionSetID={selectedEditionId} />
    )
  }

  if (artworkData.isInquireable) {
    if (hasActivePartnerOffer) {
      return (
        <RowContainer>
          <InquiryButtonsFragmentContainer artwork={artworkData} variant="outline" block />
          <BuyNowButton
            partnerOffer={partnerOfferData}
            artwork={artworkData}
            editionSetID={selectedEditionId}
          />
        </RowContainer>
      )
    }

    return <InquiryButtonsFragmentContainer artwork={artworkData} block />
  }

  return null
}

const artworkFragment = graphql`
  fragment ArtworkCommercialButtons_artwork on Artwork {
    isInAuction
    isOfferable
    isAcquireable
    isInquireable
    isBuyNowable
    sale {
      internalID
    }
    editionSets {
      internalID
    }
    ...BuyNowButton_artwork
    ...MakeOfferButton_artwork
    ...InquiryButtons_artwork
    ...BidButton_artwork
  }
`

const meFragment = graphql`
  fragment ArtworkCommercialButtons_me on Me {
    ...BidButton_me
  }
`

const partnerOfferFragment = graphql`
  fragment ArtworkCommercialButtons_partnerOffer on PartnerOfferToCollector {
    internalID
    isAvailable
    endAt
  }
`
