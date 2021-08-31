import { SavedSearchButtonTestsQuery } from "__generated__/SavedSearchButtonTestsQuery.graphql"
import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { PopoverMessage } from "lib/Components/PopoverMessage/PopoverMessage"
import { navigate } from "lib/navigation/navigate"
import { CreateSavedSearchAlert } from "lib/Scenes/SavedSearchAlert/CreateSavedSearchAlert"
import { SavedSearchAlertMutationResult } from "lib/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { SavedSearchButtonRefetchContainer as SavedSearchButton, tracks } from "../SavedSearchButton"

jest.unmock("react-relay")

const mockedAttributes: SearchCriteriaAttributes = {
  atAuction: true,
}

const mockedMutationResult: SavedSearchAlertMutationResult = {
  id: "savedSearchAlertId",
}

const mockedFilters = [
  {
    displayText: "Bid",
    paramName: FilterParamName.waysToBuyBid,
    paramValue: true,
  },
]

describe("SavedSearchButton", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const trackEvent = jest.fn()

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  afterEach(() => {
    trackEvent.mockClear()
  })

  const TestRenderer = ({ attributes = mockedAttributes }) => {
    return (
      <QueryRenderer<SavedSearchButtonTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query SavedSearchButtonTestsQuery($criteria: SearchCriteriaAttributes!) @relay_test_operation {
            me {
              ...SavedSearchButton_me @arguments(criteria: $criteria)
            }
          }
        `}
        render={({ props, error }) => (
          <SavedSearchButton
            {...props}
            loading={props === null && error === null}
            filters={mockedFilters}
            criteria={attributes}
            aggregations={[]}
            artistId="artistID"
            artistName="artistName"
            artistSlug="artistSlug"
          />
        )}
        variables={{
          criteria: attributes,
        }}
      />
    )
  }

  it("renders loading state if request didn't return data and an error", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    expect(tree.root.findByType(Button).props.loading).toBe(true)
  })

  it("renders enabled button if criteria are not saved", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        savedSearch: null,
      }),
    })

    expect(tree.root.findByType(Button).props.disabled).toBe(false)
  })

  it("renders disabled button if criteria are saved", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        savedSearch: {
          internalID: "internalID",
        },
      }),
    })

    expect(tree.root.findByType(Button).props.disabled).toBe(true)
  })

  it("should show the create saved search form when the button is pressed", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        savedSearch: null,
      }),
    })

    act(() => tree.root.findByType(Button).props.onPress())

    expect(tree.root.findByType(CreateSavedSearchAlert).props.visible).toBeTruthy()
  })

  it("tracks clicks when the create alert button is pressed", () => {
    const tree = renderWithWrappers(<TestRenderer />)

    mockEnvironmentPayload(mockEnvironment, {
      Me: () => ({
        savedSearch: null,
      }),
    })

    act(() => tree.root.findByType(Button).props.onPress())

    expect(trackEvent).toHaveBeenCalledWith(tracks.tappedCreateAlert("artistID", "artistSlug"))
  })

  it("should navigate to the saved search alerts list when popover is pressed", async () => {
    const tree = renderWithWrappers(<TestRenderer />)

    act(() => tree.root.findByType(CreateSavedSearchAlert).props.onComplete(mockedMutationResult))
    act(() => tree.root.findByType(PopoverMessage).props.onPress())

    expect(navigate).toHaveBeenCalled()
  })

  it("tracks clicks when the create alert button is pressed", async () => {
    const tree = renderWithWrappers(<TestRenderer />)

    act(() => tree.root.findByType(CreateSavedSearchAlert).props.onComplete(mockedMutationResult))

    expect(trackEvent).toHaveBeenCalledWith(
      tracks.toggleSavedSearch(true, "artistID", "artistSlug", "savedSearchAlertId")
    )
  })
})
