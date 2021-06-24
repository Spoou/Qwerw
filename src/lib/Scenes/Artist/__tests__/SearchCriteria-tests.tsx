import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"
import { SearchCriteriaQueryRender } from "../SearchCriteria"

jest.unmock("react-relay")

describe("SearchCriteria", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("should not query the search criteria when `SavedSearchBanner` flag is set to false", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearch: false })
    const mockRenderComponent = jest.fn(() => <></>)

    renderWithWrappers(
      <SearchCriteriaQueryRender
        searchCriteriaId="search-criter-id"
        render={{ renderComponent: mockRenderComponent, renderPlaceholder: jest.fn() }}
      />
    )

    expect(mockRenderComponent).toBeCalledWith({
      fetchCriteriaError: null,
      savedSearchCriteria: null,
    })
  })

  it("should not query the search criteria when searchCriteriaId is not passed", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearch: true })
    const mockRenderComponent = jest.fn(() => <></>)

    renderWithWrappers(
      <SearchCriteriaQueryRender render={{ renderComponent: mockRenderComponent, renderPlaceholder: jest.fn() }} />
    )

    expect(mockRenderComponent).toBeCalledWith({
      fetchCriteriaError: null,
      savedSearchCriteria: null,
    })
  })

  it("should query the search criteria", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearch: true })
    const mockRenderComponent = jest.fn(() => <></>)

    renderWithWrappers(
      <SearchCriteriaQueryRender
        searchCriteriaId="search-criter-id"
        render={{ renderComponent: mockRenderComponent, renderPlaceholder: jest.fn() }}
        environment={mockEnvironment}
      />
    )

    mockEnvironmentPayload(mockEnvironment)

    expect(mockRenderComponent).toBeCalledWith({
      fetchCriteriaError: null,
      savedSearchCriteria: mockResponse,
    })
  })

  it("should call renderPlaceholder when query is loading", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearch: true })
    const mockRenderPlaceholder = jest.fn(() => <></>)

    renderWithWrappers(
      <SearchCriteriaQueryRender
        searchCriteriaId="search-criter-id"
        render={{ renderComponent: jest.fn(() => <></>), renderPlaceholder: mockRenderPlaceholder }}
        environment={mockEnvironment}
      />
    )

    expect(mockRenderPlaceholder).toBeCalled()
  })

  it("should return error if something went wrong during query", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearch: true })
    const mockRenderComponent = jest.fn(() => <></>)

    renderWithWrappers(
      <SearchCriteriaQueryRender
        searchCriteriaId="search-criter-id"
        render={{ renderComponent: mockRenderComponent, renderPlaceholder: jest.fn() }}
        environment={mockEnvironment}
      />
    )

    mockEnvironment.mock.rejectMostRecentOperation(new Error())

    expect(mockRenderComponent).toBeCalledWith({
      fetchCriteriaError: new Error(),
      savedSearchCriteria: null,
    })
  })
})

const mockResponse = {
  acquireable: "acquireable-1",
  additionalGeneIDs: "additionalGeneIDs-1",
  artistID: "artistID-1",
  atAuction: "atAuction-1",
  attributionClass: "attributionClass-1",
  colors: "colors-1",
  dimensionRange: "dimensionRange-1",
  height: "height-1",
  inquireableOnly: "inquireableOnly-1",
  locationCities: "locationCities-1",
  majorPeriods: "majorPeriods-1",
  materialsTerms: "materialsTerms-1",
  offerable: "offerable-1",
  partnerIDs: "partnerIDs-1",
  priceRange: "priceRange-1",
  width: "width-1",
}
