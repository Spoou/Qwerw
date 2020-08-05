import { __appStoreTestUtils__, AppStore, AppStoreProvider } from "lib/store/AppStore"
import { times } from "lodash"
import React from "react"
import { create } from "react-test-renderer"
import { MAX_SAVED_RECENT_SEARCHES, RecentSearch, SearchModel, useRecentSearches } from "../SearchModel"

const banksy: RecentSearch = {
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: "Banksy",
    displayType: "Artist",
    href: "https://artsy.com/artist/banksy",
    imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
  },
}

const andyWarhol: RecentSearch = {
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: "Andy Warhol",
    displayType: "Artist",
    href: "https://artsy.com/artist/andy-warhol",
    imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
  },
}

describe("Recent Searches", () => {
  const getRecentSearches = () => __appStoreTestUtils__?.getCurrentState().search.recentSearches!
  beforeEach(async () => {
    __appStoreTestUtils__?.reset()
  })

  it("Starts out with an empty array", () => {
    expect(getRecentSearches()).toEqual([])
  })

  it("Saves added Recent Search", () => {
    AppStore.actions.search.addRecentSearch(banksy)
    expect(getRecentSearches()).toEqual([banksy])
  })

  it("puts the most recent items at the top", async () => {
    AppStore.actions.search.addRecentSearch(banksy)
    AppStore.actions.search.addRecentSearch(andyWarhol)

    expect(getRecentSearches()).toEqual([andyWarhol, banksy])
  })

  it("reorders items if they get reused", async () => {
    AppStore.actions.search.addRecentSearch(banksy)
    AppStore.actions.search.addRecentSearch(andyWarhol)

    // reorder
    AppStore.actions.search.addRecentSearch(banksy)
    expect(getRecentSearches()).toEqual([banksy, andyWarhol])

    // reorder again
    AppStore.actions.search.addRecentSearch(andyWarhol)
    expect(getRecentSearches()).toEqual([andyWarhol, banksy])
  })

  it(`stores a max of ${MAX_SAVED_RECENT_SEARCHES} recent searches`, async () => {
    // act
    for (let i = 0; i < MAX_SAVED_RECENT_SEARCHES * 5; i++) {
      AppStore.actions.search.addRecentSearch({
        type: "AUTOSUGGEST_RESULT_TAPPED",
        props: {
          href: `https://example.com/${i}`,
          imageUrl: "",
          displayLabel: "",
          displayType: "",
        },
      })
    }

    expect(getRecentSearches().length).toBe(MAX_SAVED_RECENT_SEARCHES)
  })

  it(`allows deleting things`, async () => {
    // act
    AppStore.actions.search.addRecentSearch(banksy)
    AppStore.actions.search.addRecentSearch(andyWarhol)
    AppStore.actions.search.deleteRecentSearch(andyWarhol.props)
    expect(getRecentSearches()).toEqual([banksy])
  })
})

describe(useRecentSearches, () => {
  it("truncates the list of recent searches", () => {
    let localRecentSearches: SearchModel["recentSearches"] = []
    let globalRecentSearches: SearchModel["recentSearches"] = []
    const TestComponent: React.FC<{ numSearches: number }> = ({ numSearches }) => {
      localRecentSearches = useRecentSearches(numSearches)
      globalRecentSearches = __appStoreTestUtils__?.getCurrentState().search.recentSearches!

      return null
    }

    const tree = create(
      <AppStoreProvider>
        <TestComponent numSearches={5} />
      </AppStoreProvider>
    )

    expect(localRecentSearches.length).toBe(0)
    expect(globalRecentSearches.length).toBe(0)

    times(10).forEach(i => {
      AppStore.actions.search.addRecentSearch({
        type: "AUTOSUGGEST_RESULT_TAPPED",
        props: {
          href: `https://example.com/${i}`,
          imageUrl: "",
          displayLabel: "",
          displayType: "",
        },
      })
    })

    expect(localRecentSearches.length).toBe(5)
    expect(globalRecentSearches.length).toBe(10)

    tree.update(
      <AppStoreProvider>
        <TestComponent numSearches={8} />
      </AppStoreProvider>
    )

    expect(localRecentSearches.length).toBe(8)
    expect(globalRecentSearches.length).toBe(10)
  })
})
