import { SaleActiveBidItem_lotStanding } from "__generated__/SaleActiveBidItem_lotStanding.graphql"
import { HighestBid, Outbid, ReserveNotMet } from "lib/Scenes/MyBids/Components/BiddingStatuses"
import { LotFragmentContainer } from "lib/Scenes/MyBids/Components/Lot"
import { TimelySale } from "lib/Scenes/MyBids/helpers/timely"
import { Flex, Text } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface SaleActiveBidItemProps {
  lotStanding: SaleActiveBidItem_lotStanding
}

export const SaleActiveBidItem: React.FC<SaleActiveBidItemProps> = ({ lotStanding }) => {
  const timelySale = TimelySale.create(lotStanding?.sale!)
  const isLAI = timelySale.isLiveBiddingNow()

  const sellingPrice = lotStanding?.mostRecentBid?.maxBid?.display
  const bidCount = lotStanding?.saleArtwork?.counts?.bidderPositions
  const { saleArtwork } = lotStanding

  return (
    saleArtwork && (
      <LotFragmentContainer saleArtwork={saleArtwork}>
        <Flex flexDirection="row">
          <Text variant="caption">{sellingPrice}</Text>
          <Text variant="caption" color="black60">
            {" "}
            ({bidCount} {bidCount === 1 ? "bid" : "bids"})
          </Text>
        </Flex>
        <Flex flexDirection="row" alignItems="center">
          {!isLAI &&
          lotStanding?.activeBid?.isWinning &&
          lotStanding?.saleArtwork?.reserveStatus === "ReserveNotMet" ? (
            <ReserveNotMet />
          ) : lotStanding?.activeBid?.isWinning ? (
            <HighestBid />
          ) : (
            <Outbid />
          )}
        </Flex>
      </LotFragmentContainer>
    )
  )
}

export const SaleActiveBidItemContainer = createFragmentContainer(SaleActiveBidItem, {
  lotStanding: graphql`
    fragment SaleActiveBidItem_lotStanding on LotStanding {
      activeBid {
        isWinning
      }
      mostRecentBid {
        maxBid {
          display
        }
      }
      saleArtwork {
        reserveStatus
        counts {
          bidderPositions
        }
        currentBid {
          display
        }
        ...Lot_saleArtwork
      }
      sale {
        liveStartAt
      }
    }
  `,
})
