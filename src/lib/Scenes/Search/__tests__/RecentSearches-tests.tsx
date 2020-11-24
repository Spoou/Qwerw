import { __globalStoreTestUtils__, GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Theme } from "palette"
import React from "react"
import { RecentSearches } from "../RecentSearches"
import { SearchContext } from "../SearchContext"
import { RecentSearch } from "../SearchModel"
import { SearchResult } from "../SearchResult"

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

const keithHaring: RecentSearch = {
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: "Keith Haring",
    displayType: "Artist",
    href: "https://artsy.com/artist/keith-haring",
    imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
  },
}

const yayoiKusama: RecentSearch = {
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: "Yayoi Kusama",
    displayType: "Artist",
    href: "https://artsy.com/artist/yayoi-kusama",
    imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
  },
}

const joanMitchell: RecentSearch = {
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: "Joan Mitchell",
    displayType: "Artist",
    href: "https://artsy.com/artist/joan-mitchell",
    imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
  },
}

const anniAlbers: RecentSearch = {
  type: "AUTOSUGGEST_RESULT_TAPPED",
  props: {
    displayLabel: "Anni Albers",
    displayType: "Artist",
    href: "https://artsy.com/artist/anni-albers",
    imageUrl: "https://org-name.my-cloud-provider.com/bucket-hash/content-hash.jpg",
  },
}

const TestPage = () => {
  return (
    <Theme>
      <GlobalStoreProvider>
        <SearchContext.Provider value={{ inputRef: { current: null }, queryRef: { current: null } }}>
          <RecentSearches />
        </SearchContext.Provider>
      </GlobalStoreProvider>
    </Theme>
  )
}

describe("Recent Searches", () => {
  it("has an empty state", () => {
    const tree = renderWithWrappers(<TestPage />)

    expect(extractText(tree.root)).toMatchInlineSnapshot(`"Recent searchesWe’ll save your recent searches here"`)
    expect(tree.root.findAllByType(SearchResult)).toHaveLength(0)
  })

  it("shows recent searches if there were any", () => {
    const tree = renderWithWrappers(<TestPage />)

    GlobalStore.actions.search.addRecentSearch(banksy)

    expect(tree.root.findAllByType(SearchResult)).toHaveLength(1)
    expect(extractText(tree.root)).toContain("Banksy")

    GlobalStore.actions.search.addRecentSearch(andyWarhol)

    expect(tree.root.findAllByType(SearchResult)).toHaveLength(2)
    expect(extractText(tree.root)).toContain("Andy Warhol")
  })

  it("shows a maxiumum of 5 searches", () => {
    const tree = renderWithWrappers(<TestPage />)

    GlobalStore.actions.search.addRecentSearch(banksy)
    GlobalStore.actions.search.addRecentSearch(andyWarhol)
    GlobalStore.actions.search.addRecentSearch(keithHaring)
    GlobalStore.actions.search.addRecentSearch(yayoiKusama)
    GlobalStore.actions.search.addRecentSearch(joanMitchell)
    GlobalStore.actions.search.addRecentSearch(anniAlbers)

    expect(tree.root.findAllByType(SearchResult)).toHaveLength(5)
    expect(extractText(tree.root)).not.toContain("Banksy")
    expect(extractText(tree.root)).toContain("Andy Warhol")
    expect(extractText(tree.root)).toContain("Keith Haring")
    expect(extractText(tree.root)).toContain("Yayoi Kusama")
    expect(extractText(tree.root)).toContain("Joan Mitchell")
    expect(extractText(tree.root)).toContain("Anni Albers")
  })
})
