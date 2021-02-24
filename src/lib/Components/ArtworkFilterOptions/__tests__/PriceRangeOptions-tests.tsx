import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Aggregations, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Box, Theme } from "palette"
import React from "react"
import { ReactTestRenderer } from "react-test-renderer"
import {
  __filterArtworksStoreTestUtils__,
  ArtworkFiltersState,
  ArtworkFiltersStoreProvider,
} from "../../../utils/ArtworkFilter/ArtworkFiltersStore"
import { PriceRangeOptionsScreen } from "../PriceRangeOptions"
import { InnerOptionListItem, OptionListItem } from "../SingleSelectOption"
import { getEssentialProps } from "./helper"

const aggregations: Aggregations = [
  {
    slice: "PRICE_RANGE",
    counts: [
      {
        name: "for Sale",
        count: 2028,
        value: "*-*",
      },
      {
        name: "between $10,000 & $50,000",
        count: 598,
        value: "10000-50000",
      },
      {
        name: "between $1,000 & $5,000",
        count: 544,
        value: "1000-5000",
      },
      {
        name: "Under $1,000",
        count: 393,
        value: "*-1000",
      },
      {
        name: "between $5,000 & $10,000",
        count: 251,
        value: "5000-10000",
      },
      {
        name: "over $50,000",
        count: 233,
        value: "50000-*",
      },
    ],
  },
]

describe("Price Range Options Screen", () => {
  let initialState: ArtworkFiltersState

  beforeEach(() => {
    initialState = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }
    __filterArtworksStoreTestUtils__?.injectState(initialState)
  })

  const MockPriceRangeScreen = () => {
    return (
      <Theme>
        <ArtworkFiltersStoreProvider>
          <PriceRangeOptionsScreen {...getEssentialProps()} />
        </ArtworkFiltersStoreProvider>
      </Theme>
    )
  }

  const selectedPriceRangeOption = (componentTree: ReactTestRenderer) => {
    const innerOptions = componentTree.root.findAllByType(InnerOptionListItem)
    const selectedOption = innerOptions.filter((item) => item.findAllByType(Box).length > 0)[0]
    return selectedOption
  }

  it("renders the correct number of price range options", () => {
    const tree = renderWithWrappers(<MockPriceRangeScreen />)
    expect(tree.root.findAllByType(OptionListItem)).toHaveLength(6)
  })

  it("has an all option", () => {
    const tree = renderWithWrappers(<MockPriceRangeScreen />)
    const firstOption = tree.root.findAllByType(OptionListItem)[0]
    expect(extractText(firstOption)).toContain("All")
  })

  it("renders price range options from most to least expensive", () => {
    const tree = renderWithWrappers(<MockPriceRangeScreen />)
    const options = tree.root.findAllByType(OptionListItem)
    const renderedOptions = options.map(extractText)

    expect(renderedOptions).toEqual(["All", "$50,000+", "$10,000-50,000", "$5,000-10,000", "$1000-5,000", "$0-1,000"])
  })

  describe("selectedPriceRangeOption", () => {
    it("returns the default option if there are no selected or applied filters", () => {
      const tree = renderWithWrappers(<MockPriceRangeScreen />)
      const selectedOption = selectedPriceRangeOption(tree)
      expect(extractText(selectedOption)).toContain("All")
    })

    it("prefers an applied filter over the default filter", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [],
        appliedFilters: [
          {
            displayText: "$5,000-10,000",

            paramName: FilterParamName.priceRange,
            paramValue: "$5,000-10,000",
          },
        ],
        previouslyAppliedFilters: [
          {
            displayText: "$5,000-10,000",

            paramName: FilterParamName.priceRange,
            paramValue: "$5,000-10,000",
          },
        ],
        applyFilters: false,
        aggregations,
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
      }

      __filterArtworksStoreTestUtils__?.injectState(injectedState)
      const tree = renderWithWrappers(<MockPriceRangeScreen />)
      const selectedOption = selectedPriceRangeOption(tree)
      expect(extractText(selectedOption)).toContain("$5,000-10,000")
    })

    it("prefers the selected filter over the default filter", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [
          {
            displayText: "$5,000-10,000",

            paramName: FilterParamName.priceRange,
            paramValue: "$5,000-10,000",
          },
        ],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations,
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
      }

      __filterArtworksStoreTestUtils__?.injectState(injectedState)
      const component = renderWithWrappers(<MockPriceRangeScreen />)
      const selectedOption = selectedPriceRangeOption(component)
      expect(extractText(selectedOption)).toContain("$5,000-10,000")
    })

    it("prefers the selected filter over an applied filter", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [
          {
            displayText: "$5,000-10,000",

            paramName: FilterParamName.priceRange,
            paramValue: "$5,000-10,000",
          },
        ],
        appliedFilters: [
          {
            displayText: "$10,000-20,000",

            paramName: FilterParamName.priceRange,
            paramValue: "$10,000-20,000",
          },
        ],
        previouslyAppliedFilters: [
          {
            displayText: "$10,000-20,000",

            paramName: FilterParamName.priceRange,
            paramValue: "$10,000-20,000",
          },
        ],
        applyFilters: false,
        aggregations,
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
      }

      __filterArtworksStoreTestUtils__?.injectState(injectedState)
      const tree = renderWithWrappers(<MockPriceRangeScreen />)
      const selectedOption = selectedPriceRangeOption(tree)
      expect(extractText(selectedOption)).toContain("$5,000-10,000")
    })
  })
})
