import { SaleLotsListTestsQuery } from "__generated__/SaleLotsListTestsQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { FilterParamName, ViewAsValues } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "lib/utils/ArtworkFilter2/ArtworkFiltersStore"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { FilterParams } from "../../../utils/ArtworkFilter/FilterArtworksHelpers"
import { __filterArtworksStoreTestUtils__ } from "../../../utils/ArtworkFilter2/ArtworkFiltersStore"
import { SaleArtworkListContainer } from "../Components/SaleArtworkList"
import { FilterDescription, FilterTitle, SaleLotsListContainer, SaleLotsListSortMode } from "../Components/SaleLotsList"

jest.unmock("react-relay")

describe("SaleLotsListContainer", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  // const TestRenderer = ({ viewAs = ViewAsValues.Grid }: { viewAs?: ViewAsValues }) => (
  const TestRenderer = () => (
    <QueryRenderer<SaleLotsListTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query SaleLotsListTestsQuery($saleSlug: ID!) @relay_test_operation {
          ...SaleLotsList_saleArtworksConnection @arguments(saleID: $saleSlug)
        }
      `}
      variables={{ saleSlug: "sale-slug" }}
      render={({ props }) => {
        if (props) {
          return (
            <ArtworkFiltersStoreProvider>
              <SaleLotsListContainer
                saleArtworksConnection={props}
                unfilteredSaleArtworksConnection={null as any}
                saleID="sale-id"
                saleSlug="sale-slug"
                scrollToTop={jest.fn()}
              />
            </ArtworkFiltersStoreProvider>
          )
        }
        return null
      }}
    />
  )

  const getState = (viewAs: ViewAsValues = ViewAsValues.List): ArtworkFiltersState => ({
    selectedFilters: [],
    appliedFilters: [
      {
        paramName: FilterParamName.viewAs,
        paramValue: viewAs,
        displayText: "View as",
      },
    ],
    previouslyAppliedFilters: [],
    applyFilters: false,
    aggregations: [],
    filterType: "saleArtwork",
    counts: {
      total: null,
      followedArtists: null,
    },
  })

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    __filterArtworksStoreTestUtils__?.injectState(getState())
  })

  // Investigate why this test is failing
  // Most likely this has something to do with the unfilteredSaleArtworksConnection
  // Follow-up ticket https://artsyproduct.atlassian.net/browse/CX-1108
  it.skip("Renders nothing if not sale artworks are available", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    const mockProps = {
      SaleArtworksConnection: () => ({
        aggregations: [],
        counts: {
          total: 0,
        },
        edges: saleArtworksConnectionEdges,
      }),
    }

    mockEnvironmentPayload(mockEnvironment, mockProps)

    expect(tree.toJSON()).toBeNull()
  })

  it("Renders list of sale artworks as a grid", () => {
    __filterArtworksStoreTestUtils__?.injectState(getState(ViewAsValues.Grid))
    const tree = renderWithWrappers(<TestRenderer />)

    const mockProps = {
      SaleArtworksConnection: () => ({
        aggregations: [],
        counts: {
          total: 0,
        },
        edges: saleArtworksConnectionEdges,
      }),
    }

    mockEnvironmentPayload(mockEnvironment, mockProps)

    expect(tree.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(1)
  })

  it("Renders list of sale artworks as a list", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    const mockProps = {
      SaleArtworksConnection: () => ({
        aggregations: [],
        counts: {
          total: 0,
        },
        edges: saleArtworksConnectionEdges,
      }),
    }

    mockEnvironmentPayload(mockEnvironment, mockProps)

    expect(tree.root.findAllByType(SaleArtworkListContainer)).toHaveLength(1)
  })
})

describe("SaleLotsListSortMode", () => {
  it("renders the right sort mode and count", () => {
    const tree = renderWithWrappers(
      <SaleLotsListSortMode
        filterParams={{ sort: "bidder_positions_count" } as FilterParams}
        filteredTotal={20}
        totalCount={100}
      />
    )

    expect(extractText(tree.root.findByType(FilterTitle))).toBe("Sorted by least bids")
    expect(extractText(tree.root.findByType(FilterDescription))).toBe("Showing 20 of 100")
  })
})

const saleArtworkNode = {
  artwork: {
    image: {
      url: "artworkImageUrl",
    },
    href: "/artwork/artwroks-href",
    saleMessage: "Contact For Price",
    artistNames: "Banksy",
    slug: "artwork-slug",
    internalID: "Internal-ID",
    sale: {
      isAuction: true,
      isClosed: false,
      displayTimelyAt: "register by\n5pm",
      endAt: null,
    },
    saleArtwork: {
      counts: "{bidderPositions: 0}",
      currentBid: '{display: "$650"}',
    },
    partner: {
      name: "Heritage Auctions",
    },
  },
  lotLabel: "1",
}

const saleArtworksConnectionEdges = new Array(10).fill({
  node: {
    saleArtwork: saleArtworkNode,
    id: saleArtworkNode.artwork.internalID,
    href: saleArtworkNode.artwork.href,
  },
})
