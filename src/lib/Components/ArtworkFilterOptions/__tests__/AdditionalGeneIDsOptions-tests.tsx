import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import React from "react"
import { Switch } from "react-native"
import { OptionListItem as FilterModalOptionListItem } from "../../../../lib/Components/FilterModal"
import { MockFilterScreen } from "../../../../lib/Components/FilterModal/__tests__/FilterTestHelper"
import { extractText } from "../../../../lib/tests/extractText"
import { renderWithWrappers } from "../../../../lib/tests/renderWithWrappers"
import { Aggregations, FilterParamName } from "../../../../lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { __filterArtworksStoreTestUtils__ } from "../../../utils/ArtworkFilter/ArtworkFiltersStore"
import { AdditionalGeneIDsOptionsScreen } from "../AdditionalGeneIDsOptions"
import { OptionListItem } from "../MultiSelectOption"
import { getEssentialProps } from "./helper"

const MOCK_AGGREGATIONS: Aggregations = [
  {
    slice: "MEDIUM",
    counts: [
      { name: "Prints", count: 2956, value: "prints" },
      { name: "Design", count: 513, value: "design" },
      { name: "Sculpture", count: 277, value: "sculpture" },
      { name: "Work on Paper", count: 149, value: "work-on-paper" },
      { name: "Painting", count: 145, value: "painting" },
      { name: "Drawing", count: 83, value: "drawing" },
      { name: "Jewelry", count: 9, value: "jewelry" },
      { name: "Photography", count: 4, value: "photography" },
    ],
  },
]

describe("AdditionalGeneIDsOptions Screen", () => {
  let state: ArtworkFiltersState

  beforeEach(() => {
    state = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: MOCK_AGGREGATIONS,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }
  })

  const MockAdditionalGeneIDsOptionsScreen = ({ initialState = state }: { initialState?: ArtworkFiltersState }) => {
    __filterArtworksStoreTestUtils__?.injectState(initialState)
    return (
      <ArtworkFiltersStoreProvider>
        <AdditionalGeneIDsOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  it("renders the options", () => {
    const tree = renderWithWrappers(<MockAdditionalGeneIDsOptionsScreen />)
    expect(tree.root.findAllByType(OptionListItem)).toHaveLength(4) // initialNumToRender={4}
    const items = tree.root.findAllByType(OptionListItem)
    expect(items.map(extractText)).toEqual(["All", "Prints", "Design", "Sculpture"])
  })

  it("displays the default text when no filter selected on the filter modal screen", () => {
    const tree = renderWithWrappers(<MockFilterScreen />)
    const items = tree.root.findAllByType(FilterModalOptionListItem)
    expect(extractText(items[items.length - 1])).toContain("All")
  })

  it("displays all the selected filters on the filter modal screen", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Unique",
          paramName: FilterParamName.additionalGeneIDs,
          paramValue: ["prints", "sculpture"],
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: MOCK_AGGREGATIONS,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    __filterArtworksStoreTestUtils__?.injectState(injectedState)
    const tree = renderWithWrappers(<MockFilterScreen />)
    const items = tree.root.findAllByType(FilterModalOptionListItem)

    expect(extractText(items[1])).toContain("Prints, Sculpture")
  })

  it("toggles selected filters 'ON' and unselected filters 'OFF", () => {
    const injectedState: ArtworkFiltersState = {
      selectedFilters: [
        {
          displayText: "Unique",
          paramName: FilterParamName.additionalGeneIDs,
          paramValue: ["prints", "sculpture"],
        },
      ],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: MOCK_AGGREGATIONS,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    const tree = renderWithWrappers(<MockAdditionalGeneIDsOptionsScreen initialState={injectedState} />)
    const switches = tree.root.findAllByType(Switch)

    expect(switches[0].props.value).toBe(false)
    expect(switches[1].props.value).toBe(true)
    expect(switches[2].props.value).toBe(false)
    expect(switches[3].props.value).toBe(true)
  })
})
