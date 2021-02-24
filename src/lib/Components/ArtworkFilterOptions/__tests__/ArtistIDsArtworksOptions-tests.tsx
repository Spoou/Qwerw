import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { ArtworkFiltersState, ArtworkFiltersStoreProvider } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { Aggregations, FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { act, ReactTestRenderer } from "react-test-renderer"
import { __filterArtworksStoreTestUtils__ } from "../../../utils/ArtworkFilter/ArtworkFiltersStore"
import { FakeNavigator as MockNavigator } from "../../Bidding/__tests__/Helpers/FakeNavigator"
import { ArtistIDsArtworksOptionsScreen } from "../ArtistIDsArtworksOptions"
import { FilterToggleButton } from "../FilterToggleButton"
import { OptionListItem } from "../MultiSelectOption"
import { getEssentialProps } from "./helper"

describe("Artist options screen", () => {
  let mockNavigator: MockNavigator
  let initialState: ArtworkFiltersState

  const mockAggregations: Aggregations = [
    {
      slice: "ARTIST",
      counts: [
        {
          name: "Artist 1",
          count: 2956,
          value: "artist-1",
        },
        {
          name: "Artist 2",
          count: 513,
          value: "artist-2",
        },
        {
          name: "Artist 3",
          count: 277,
          value: "artist-3",
        },
        {
          name: "Artist 4",
          count: 149,
          value: "artist-4",
        },
        {
          name: "Artist 5",
          count: 145,
          value: "artist-5",
        },
      ],
    },
    {
      slice: "FOLLOWED_ARTISTS",
      counts: [
        {
          name: "followed_artists",
          count: 2,
          value: "followed_artists",
        },
      ],
    },
  ]

  const selectedArtistOptions = (componentTree: ReactTestRenderer) => {
    const artistOptions = componentTree.root.findAllByType(OptionListItem)
    const selectedOptions = artistOptions.filter((item) => {
      return item.findByType(FilterToggleButton).props.value === true
    })
    return selectedOptions
  }

  const MockArtistScreen = () => {
    return (
      <ArtworkFiltersStoreProvider>
        <ArtistIDsArtworksOptionsScreen {...getEssentialProps()} />
      </ArtworkFiltersStoreProvider>
    )
  }

  beforeEach(() => {
    mockNavigator = new MockNavigator()
    initialState = {
      selectedFilters: [],
      appliedFilters: [],
      previouslyAppliedFilters: [],
      applyFilters: false,
      aggregations: mockAggregations,
      filterType: "artwork",
      counts: {
        total: null,
        followedArtists: null,
      },
    }

    __filterArtworksStoreTestUtils__?.injectState(initialState)
  })

  it("shows the correct number of artist options", () => {
    const tree = renderWithWrappers(<MockArtistScreen />)
    // Includes a button for each artist + one for followed artists,
    // but our FlatList is configured to only show 4 in the initial render pass
    expect(tree.root.findAllByType(FilterToggleButton)).toHaveLength(4)
  })

  describe("selecting an artist option", () => {
    it("selects only the option that is tapped", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [
          {
            paramName: FilterParamName.artistIDs,
            paramValue: "artist-2",
            displayText: "Artist 2",
          },
        ],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: mockAggregations,
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
      }

      __filterArtworksStoreTestUtils__?.injectState(injectedState)

      const component = renderWithWrappers(<MockArtistScreen />)
      const selectedOption = selectedArtistOptions(component)[0]
      expect(extractText(selectedOption)).toEqual("Artist 2")
    })

    it("allows multiple artist options to be selected", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: mockAggregations,
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
      }

      __filterArtworksStoreTestUtils__?.injectState(injectedState)
      const tree = renderWithWrappers(<MockArtistScreen />)

      const firstOptionInstance = tree.root.findAllByType(FilterToggleButton)[0] // Artists I follow
      const secondOptionInstance = tree.root.findAllByType(FilterToggleButton)[1] // Artist 1
      const thirdOptionInstance = tree.root.findAllByType(FilterToggleButton)[2] // Artist 2

      act(() => firstOptionInstance.props.onChange())
      act(() => secondOptionInstance.props.onChange())
      act(() => thirdOptionInstance.props.onChange())

      const selectedOptions = selectedArtistOptions(tree)
      expect(selectedOptions).toHaveLength(3)
      expect(extractText(selectedOptions[0])).toMatch("All artists I follow")
      expect(extractText(selectedOptions[1])).toMatch("Artist 1")
      expect(extractText(selectedOptions[2])).toMatch("Artist 2")
    })

    it("deselects artist option if it is already selected and then tapped again", () => {
      const injectedState: ArtworkFiltersState = {
        selectedFilters: [
          {
            paramName: FilterParamName.artistIDs,
            paramValue: "artist-2",
            displayText: "Artist 2",
          },
        ],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: mockAggregations,
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
      }

      __filterArtworksStoreTestUtils__?.injectState(injectedState)
      const tree = renderWithWrappers(<MockArtistScreen />)

      const secondOptionInstance = tree.root.findAllByType(FilterToggleButton)[2] // Artists I follow, Artist 1, Artist 2
      const selectedOptionsBeforeTapping = selectedArtistOptions(tree)
      expect(selectedOptionsBeforeTapping).toHaveLength(1)
      expect(extractText(selectedOptionsBeforeTapping[0])).toEqual("Artist 2")

      act(() => secondOptionInstance.props.onChange())

      const selectedOptions = selectedArtistOptions(tree)
      expect(selectedOptions).toHaveLength(0)
    })

    it("disables the artists I follow button if there are no followed artists in the fair", () => {
      const noFollowedArtistsAggregations: Aggregations = [
        {
          slice: "ARTIST",
          counts: [
            {
              name: "Artist 1",
              count: 2956,
              value: "artist-1",
            },
            {
              name: "Artist 2",
              count: 513,
              value: "artist-2",
            },
            {
              name: "Artist 3",
              count: 277,
              value: "artist-3",
            },
          ],
        },
      ]

      const injectedState: ArtworkFiltersState = {
        selectedFilters: [],
        appliedFilters: [],
        previouslyAppliedFilters: [],
        applyFilters: false,
        aggregations: noFollowedArtistsAggregations,
        filterType: "artwork",
        counts: {
          total: null,
          followedArtists: null,
        },
      }

      __filterArtworksStoreTestUtils__?.injectState(injectedState)
      const tree = renderWithWrappers(<MockArtistScreen />)
      expect(tree.root.findAllByType(FilterToggleButton)).toHaveLength(4)

      // Artists I followed option should be disabled
      const firstOptionInstance = tree.root.findAllByType(FilterToggleButton)[0]
      expect(firstOptionInstance.props.disabled).toEqual(true)
    })
  })
})
