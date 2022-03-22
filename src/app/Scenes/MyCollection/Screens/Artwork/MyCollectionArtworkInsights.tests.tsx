import { MyCollectionArtworkInsightsTestsQuery } from "__generated__/MyCollectionArtworkInsightsTestsQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { mockEnvironmentPayload } from "app/tests/mockEnvironmentPayload"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { MyCollectionArtworkInsights } from "./MyCollectionArtworkInsights"

jest.unmock("react-relay")

describe("MyCollectionArtworkInsights", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkInsightsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkInsightsTestsQuery @relay_test_operation {
          artwork(id: "some-artwork-id") {
            ...MyCollectionArtworkInsights_artwork
          }

          marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
            ...MyCollectionArtworkInsights_marketPriceInsights
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (!props?.artwork || !props?.marketPriceInsights) {
          return null
        }
        return (
          <StickyTabPage
            tabs={[
              {
                title: "test",
                content: (
                  <MyCollectionArtworkInsights
                    marketPriceInsights={props.marketPriceInsights}
                    artwork={props?.artwork}
                  />
                ),
              },
            ]}
          />
        )
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("renders without throwing an error", async () => {
    const { getByText } = renderWithWrappersTL(<TestRenderer />)
    mockEnvironmentPayload(mockEnvironment, {
      Query: () => ({
        artwork: mockArtwork,
        marketPriceInsights: mockMarketPriceInsights,
      }),
    })

    // Artwork Artist Market

    expect(await getByText("Artist Market")).toBeTruthy()
    expect(await getByText("Based on the last 36 months of auction data")).toBeTruthy()
    expect(await getByText("Annual Value Sold")).toBeTruthy()
    expect(await getByText("$1,000")).toBeTruthy()
    expect(await getByText("Annual Lots Sold")).toBeTruthy()
    expect(await getByText("100")).toBeTruthy()
    expect(await getByText("Sell-through Rate")).toBeTruthy()
    expect(await getByText("20%")).toBeTruthy()
    expect(await getByText("Sale Price to Estimate")).toBeTruthy()
    expect(await getByText("1x")).toBeTruthy()
    expect(await getByText("Liquidity")).toBeTruthy()
    expect(await getByText("High")).toBeTruthy()
    expect(await getByText("One-Year Trend")).toBeTruthy()
    expect(await getByText("Trending up")).toBeTruthy()

    // Artwork Comparable Works

    expect(await getByText("Comparable Works")).toBeTruthy()

    // Why Sell or Submit To Sell

    // TODO: fix this test
    // jest won, i don't get how to mock the showSubmitToSell function ><'
    expect(await getByText("Sell Art From Your Collection")).toBeTruthy()
  })
})

const mockArtwork = {
  internalID: "some-artwork-id",
  slug: "some-artwork-slug",
  comparableAuctionResults: {
    edges: [
      {
        cursor: "YXJyYXljb25uZWN0aW9uOjA=",
        node: {
          id: "QXVjdGlvblJlc3VsdDozMzM5NTI=",
          artistID: "4d8b92bb4eb68a1b2c000452",
          artist: {
            name: "Takashi Murakami",
            targetSupply: {
              isP1: false,
            },
          },
          internalID: "333952",
          title: "A Comparable Auction Result",
          currency: "HKD",
          dateText: "2015",
          mediumText: "acrylic on canvas mounted on aluminum frame",
          saleDate: "2021-06-01T03:00:00+03:00",
          organization: "Phillips",
          boughtIn: false,
          priceRealized: {
            cents: 315000000,
            display: "HK$3,150,000",
            displayUSD: "$30,000",
          },
          performance: {
            mid: "70%",
          },
          images: {
            thumbnail: {
              url: "https://d2v80f5yrouhh2.cloudfront.net/OTJxNHuhGDnPi8wQcvXvxA/thumbnail.jpg",
            },
          },
        },
      },
    ],
  },
}

const mockMarketPriceInsights = {
  demandRank: 0.7,
  demandTrend: 9,
  sellThroughRate: 20,
  annualLotsSold: 100,
  annualValueSoldCents: 100000,
  medianSaleToEstimateRatio: 1,
  liquidityRank: 0.7,
}
