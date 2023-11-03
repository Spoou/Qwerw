import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { rejectMostRecentRelayOperation } from "app/utils/tests/rejectMostRecentRelayOperation"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { isEqual } from "lodash"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MockResolvers } from "relay-test-utils/lib/RelayMockPayloadGenerator"
import { ArtistQueryRenderer } from "./Artist"

jest.unmock("react-tracking")

type ArtistQueries = "ArtistAboveTheFoldQuery" | "ArtistBelowTheFoldQuery" | "SearchCriteriaQuery"

describe("Saved search banner on artist screen", () => {
  const originalError = console.error
  const originalWarn = console.warn
  let environment = createMockEnvironment()

  beforeEach(() => {
    environment = createMockEnvironment()
    console.error = jest.fn()
    console.warn = jest.fn()
  })

  afterEach(() => {
    environment = createMockEnvironment()
    console.error = originalError
    console.warn = originalWarn
  })

  function mockMostRecentOperation(name: ArtistQueries, mockResolvers: MockResolvers = {}) {
    expect(environment.mock.getMostRecentOperation().request.node.operation.name).toBe(name)
    environment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        ID({ path }) {
          // need to make sure artist id is stable between above-and-below-the-fold queries to avoid cache weirdness
          if (isEqual(path, ["artist", "id"])) {
            return "artist-id"
          }
        },
        ...mockResolvers,
      })
      return result
    })
  }

  const getTree = (searchCriteriaID?: string) =>
    renderWithHookWrappersTL(
      <ArtistQueryRenderer
        artistID="ignore"
        environment={environment}
        searchCriteriaID={searchCriteriaID}
        initialTab="Artworks"
      />
    )

  it("should convert the criteria attributes to the filter params format", async () => {
    getTree("search-criteria-id")

    mockMostRecentOperation("SearchCriteriaQuery", MockSearchCriteriaQuery)

    mockMostRecentOperation("ArtistAboveTheFoldQuery", MockArtistAboveTheFoldQuery)

    await flushPromiseQueue()

    waitFor(() => {
      fireEvent.press(screen.getByText("Sort & Filter"))
      expect(screen.queryByText("Sort By • 1")).toBeOnTheScreen()
      expect(screen.queryByText("Rarity • 2")).toBeOnTheScreen()
      expect(screen.queryByText("Ways to Buy • 2")).toBeOnTheScreen()
    })
  })

  it("should an error message when something went wrong during the search criteria query", async () => {
    getTree("something")

    rejectMostRecentRelayOperation(environment, new Error())
    mockMostRecentOperation("ArtistAboveTheFoldQuery", MockArtistAboveTheFoldQuery)

    await flushPromiseQueue()

    expect(screen.getByText("Sorry, an error occured")).toBeOnTheScreen()
    expect(screen.getByText("Failed to get saved search criteria")).toBeOnTheScreen()
  })

  it("should render saved search component", async () => {
    getTree("search-criteria-id")

    mockMostRecentOperation("SearchCriteriaQuery", MockSearchCriteriaQuery)
    mockMostRecentOperation("ArtistAboveTheFoldQuery", MockArtistAboveTheFoldQuery)

    await flushPromiseQueue()

    waitFor(() => {
      expect(screen.getAllByText("Create Alert")).not.toHaveLength(0)
    })
  })
})

const MockSearchCriteriaQuery: MockResolvers = {
  Me() {
    return {
      savedSearch: {
        attributionClass: ["limited edition", "open edition"],
        acquireable: true,
        inquireableOnly: true,
        offerable: null,
        atAuction: null,
        width: null,
        height: null,
      },
    }
  },
}

const MockArtistAboveTheFoldQuery: MockResolvers = {
  Artist() {
    return {
      has_metadata: true,
      counts: { articles: 0, related_artists: 0, artworks: 1, partner_shows: 0 },
      auctionResultsConnection: {
        totalCount: 0,
      },
    }
  },
  ArtistInsight() {
    return { entities: ["test"] }
  },
  Me() {
    return {
      savedSearchesConnection: {
        totalCount: 2,
      },
    }
  },
}
