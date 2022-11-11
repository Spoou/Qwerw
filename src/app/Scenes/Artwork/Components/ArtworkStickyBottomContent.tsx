import { ArtworkStickyBottomContent_artwork$key } from "__generated__/ArtworkStickyBottomContent_artwork.graphql"
import { ArtworkStickyBottomContent_me$key } from "__generated__/ArtworkStickyBottomContent_me.graphql"
import { AuctionTimerState } from "app/Components/Bidding/Components/Timer"
import { ArtworkStore } from "app/Scenes/Artwork/ArtworkStore"
import { Box, Separator, Spacer } from "palette"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { ArtworkCommercialButtons } from "./ArtworkCommercialButtons"
import { ArtworkPrice } from "./ArtworkPrice"

interface ArtworkStickyBottomContentProps {
  artwork: ArtworkStickyBottomContent_artwork$key
  me: ArtworkStickyBottomContent_me$key
}

export const ArtworkStickyBottomContent: React.FC<ArtworkStickyBottomContentProps> = ({
  artwork,
  me,
}) => {
  const artworkData = useFragment(artworkFragment, artwork)
  const meData = useFragment(meFragment, me)
  const auctionState = ArtworkStore.useStoreState((state) => state.auctionState)
  const isLiveOngoing = auctionState === AuctionTimerState.LIVE_INTEGRATION_ONGOING

  if (!artworkData.isForSale || auctionState === AuctionTimerState.CLOSED) {
    return null
  }

  return (
    <Box bg="white100">
      <Separator />
      <Box px={2} py={1}>
        {!isLiveOngoing && (
          <>
            <ArtworkPrice artwork={artworkData} />
            <Spacer mt={1} />
          </>
        )}
        <ArtworkCommercialButtons artwork={artworkData} me={meData} />
      </Box>
    </Box>
  )
}

const artworkFragment = graphql`
  fragment ArtworkStickyBottomContent_artwork on Artwork {
    isForSale
    ...ArtworkPrice_artwork
    ...ArtworkCommercialButtons_artwork
  }
`

const meFragment = graphql`
  fragment ArtworkStickyBottomContent_me on Me {
    ...ArtworkCommercialButtons_me
  }
`
