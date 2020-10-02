import { MyCollectionArtworkArtistMarket_marketPriceInsights } from "__generated__/MyCollectionArtworkArtistMarket_marketPriceInsights.graphql"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { formatCentsToDollars } from "lib/Scenes/MyCollection/utils/formatCentsToDollars"
import { AppStore } from "lib/store/AppStore"
import { Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { Field } from "../Field"
import { InfoButton } from "./InfoButton"

interface MyCollectionArtworkArtistMarketProps {
  marketPriceInsights: MyCollectionArtworkArtistMarket_marketPriceInsights
}

const MyCollectionArtworkArtistMarket: React.FC<MyCollectionArtworkArtistMarketProps> = ({ marketPriceInsights }) => {
  if (!marketPriceInsights) {
    return null
  }

  const {
    annualLotsSold,
    annualValueSoldCents,
    sellThroughRate,
    medianSaleToEstimateRatio,
    liquidityRank: _liquidityRate,
    demandTrend: _demandTrend,
  } = marketPriceInsights

  const navActions = AppStore.actions.myCollection.navigation

  const getFormattedDemandTrend = () => {
    const demandTrend = _demandTrend!

    switch (true) {
      case demandTrend < -9:
        return "Trending down"
      case -9 < demandTrend && demandTrend < -6:
        return "Flat"
      case demandTrend > 7:
        return "Trending up"
    }
  }

  const getFormattedLiquidityRank = () => {
    const liquidityRank = _liquidityRate!

    switch (true) {
      case liquidityRank < 0.25:
        return "Low"
      case liquidityRank >= 0.25 && liquidityRank < 0.7:
        return "Medium"
      case liquidityRank >= 0.7 && liquidityRank < 0.85:
        return "High"
      case liquidityRank >= 0.85:
        return "Very High"
    }
  }

  const formattedAnnualValueSold = formatCentsToDollars(Number(annualValueSoldCents))
  const formattedDemandTrend = getFormattedDemandTrend() as string
  const formatLiquidityRank = getFormattedLiquidityRank() as string

  return (
    <ScreenMargin>
      <InfoButton
        title="Artist market"
        subTitle={`Based on ${"TODO"} months of auction data`}
        onPress={() => navActions.showInfoModal("artistMarket")}
      />

      <Spacer my={0.5} />

      <Field label="Avg. Annual Value Sold" value={formattedAnnualValueSold} />
      <Field label="Avg. Annual Lots Sold" value={`${annualLotsSold}`} />
      <Field label="Sell-through Rate" value={`${sellThroughRate}%`} />
      <Field label="Median Sale Price to Estimate" value={`${medianSaleToEstimateRatio}x`} />
      <Field label="Liquidity" value={formatLiquidityRank} />
      <Field label="1-Year Trend" value={formattedDemandTrend} />
    </ScreenMargin>
  )
}

export const MyCollectionArtworkArtistMarketFragmentContainer = createFragmentContainer(
  MyCollectionArtworkArtistMarket,
  {
    marketPriceInsights: graphql`
      fragment MyCollectionArtworkArtistMarket_marketPriceInsights on MarketPriceInsights {
        annualLotsSold
        annualValueSoldCents
        sellThroughRate
        medianSaleToEstimateRatio
        liquidityRank
        demandTrend
      }
    `,
  }
)
