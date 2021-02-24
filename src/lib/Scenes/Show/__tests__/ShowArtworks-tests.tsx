import { ShowArtworksTestsQuery } from "__generated__/ShowArtworksTestsQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { ShowArtworksPaginationContainer as ShowArtworks } from "lib/Scenes/Show/Components/ShowArtworks"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { ArtworkFilterContext, ArtworkFilterContextState } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

jest.unmock("react-relay")

describe("ShowArtworks", () => {
  let state: ArtworkFilterContextState

  beforeEach(() => {
    state = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: [],
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }
  })

  const getWrapper = (mockResolvers = {}) => {
    const env = createMockEnvironment()

    const tree = renderWithWrappers(
      <QueryRenderer<ShowArtworksTestsQuery>
        environment={env}
        query={graphql`
          query ShowArtworksTestsQuery($showID: String!) @relay_test_operation {
            show(id: $showID) {
              ...ShowArtworks_show
            }
          }
        `}
        variables={{ showID: "catty-art-show" }}
        render={({ props, error }) => {
          if (error) {
            console.log(error)
            return null
          }

          if (!props || !props.show) {
            return null
          }
          return (
            <ArtworkFiltersStoreProvider>
<ArtworkFilterContext.provider value={{ state, dispatch: jest.fn() }}>
              <ShowArtworks show={props.show} />
            </ArtworkFilterContext.Provider>
          )
        }}
      />
    )

    env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))

    return tree
  }

  it("renders a grid of artworks", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(1)
  })

  it("renders null if there are no artworks", () => {
    const wrapper = getWrapper({
      Show: () => ({
        showArtworks: {
          edges: [],
          counts: {
            total: 0,
          },
        },
      }),
    })

    expect(wrapper.root.findAllByType(InfiniteScrollArtworksGridContainer)).toHaveLength(0)
  })
})
