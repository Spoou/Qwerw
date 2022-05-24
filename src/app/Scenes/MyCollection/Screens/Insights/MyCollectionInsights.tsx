import { MyCollectionInsightsQuery } from "__generated__/MyCollectionInsightsQuery.graphql"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { useFeatureFlag } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Spinner, useSpace } from "palette"
import React, { Suspense, useState } from "react"
import { RefreshControl } from "react-native"
import { useLazyLoadQuery } from "react-relay"
import { fetchQuery, graphql } from "relay-runtime"
import { ActivateMoreMarketInsightsBanner } from "./ActivateMoreMarketInsightsBanner"
import { AuctionResultsForArtistsYouCollectRail } from "./AuctionResultsForArtistsYouCollectRail"
import { MarketSignalsSectionHeader } from "./MarketSignalsSectionHeader"
import { MyCollectionInsightsEmptyState } from "./MyCollectionInsightsEmptyState"
import { MyCollectionInsightsOverview } from "./MyCollectionInsightsOverview"

export const MyCollectionInsights: React.FC<{}> = ({}) => {
  const space = useSpace()
  const enablePhase1 = useFeatureFlag("ARShowMyCollectionInsightsPhase1Part1")

  const [isRefreshing, setIsRefreshing] = useState(false)

  const data = useLazyLoadQuery<MyCollectionInsightsQuery>(MyCollectionInsightsScreenQuery, {}, {})

  const myCollectionArtworksCount = extractNodes(data.me?.myCollectionConnection).length

  const hasMarketSignals = !!data.me?.auctionResults?.totalCount

  const refresh = () => {
    if (isRefreshing) {
      return
    }

    setIsRefreshing(true)

    fetchQuery(defaultEnvironment, MyCollectionInsightsScreenQuery, {}).subscribe({
      complete: () => {
        setIsRefreshing(false)
      },
      error: () => {
        setIsRefreshing(false)
      },
    })
  }

  const renderContent = () => {
    return (
      <>
        <MyCollectionInsightsOverview />
        {hasMarketSignals && !!enablePhase1 && (
          <>
            <MarketSignalsSectionHeader />
            <AuctionResultsForArtistsYouCollectRail auctionResults={data.me!} />
            {/* TODO: The banner should be visible always as long as the user has at least an artwork with insights */}
            <ActivateMoreMarketInsightsBanner />
          </>
        )}
      </>
    )
  }

  return (
    <StickyTabPageScrollView
      style={{
        flex: 1,
      }}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
      contentContainerStyle={{ paddingTop: space("2"), flexGrow: 1, justifyContent: "center" }}
      paddingHorizontal={0}
    >
      {myCollectionArtworksCount > 0 ? renderContent() : <MyCollectionInsightsEmptyState />}
    </StickyTabPageScrollView>
  )
}

export const MyCollectionInsightsQR: React.FC<{}> = () => (
  <Suspense fallback={<MyCollectionInsightsPlaceHolder />}>
    <MyCollectionInsights />
  </Suspense>
)

export const MyCollectionInsightsPlaceHolder = () => (
  <StickyTabPageScrollView
    style={{ flex: 1 }}
    contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    scrollEnabled={false}
  >
    <Flex alignItems="center">
      <Spinner />
    </Flex>
  </StickyTabPageScrollView>
)

export const MyCollectionInsightsScreenQuery = graphql`
  query MyCollectionInsightsQuery {
    me {
      ...AuctionResultsForArtistsYouCollectRail_me
      auctionResults: myCollectionAuctionResults(first: 1) {
        totalCount
      }
      myCollectionConnection(first: 1) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`
