import { Aggregations, FilterArray } from "lib/utils/ArtworkFiltersStore"
import { forOwn } from "lodash"

// General filter types and objects
export enum FilterParamName {
  sort = "sort",
  medium = "medium",
  priceRange = "priceRange",
  size = "dimensionRange",
  color = "color",
  gallery = "partnerID",
  institution = "partnerID",
  timePeriod = "majorPeriods",
  waysToBuyBuy = "acquireable",
  waysToBuyBid = "atAuction",
  waysToBuyInquire = "inquireableOnly",
  waysToBuyMakeOffer = "offerable",
}

// Types for the parameters passed to Relay
export type FilterParams = {
  [Name in FilterParamName]: string | boolean | undefined
}

export enum FilterDisplayName {
  sort = "Sort",
  medium = "Medium",
  priceRange = "Price range",
  size = "Size",
  color = "Color",
  gallery = "Gallery",
  institution = "Institution",
  timePeriod = "Time period",
  waysToBuy = "Ways to buy",
}

export interface InitialState {
  initialState: {
    selectedFilters: FilterArray
    appliedFilters: FilterArray
    previouslyAppliedFilters: FilterArray
    applyFilters: boolean
    aggregations: Aggregations
  }
}

export interface AggregateOption {
  displayText: string
  paramValue: string
}

const defaultFilterParams = {
  sort: "-decayed_merch",
  medium: "*",
  priceRange: "*-*",
  dimensionRange: "*-*",
  atAuction: false,
  acquireable: false,
  inquireableOnly: false,
  offerable: false,
} as FilterParams

const paramsFromAppliedFilters = (appliedFilters: FilterArray, filterParams: FilterParams) => {
  appliedFilters.forEach((appliedFilterOption) => {
    filterParams[appliedFilterOption.paramName] = appliedFilterOption.paramValue
  })

  return filterParams
}

export const filterArtworksParams = (appliedFilters: FilterArray) => {
  return paramsFromAppliedFilters(appliedFilters, { ...defaultFilterParams })
}

const getChangedParams = (appliedFilters: FilterArray) => {
  const filterParams = paramsFromAppliedFilters(appliedFilters, { ...defaultFilterParams })
  // when filters cleared return default params
  return Object.keys(filterParams).length === 0 ? defaultFilterParams : filterParams
}

export const changedFiltersParams = (currentFilterParams: FilterParams, selectedFilterOptions: FilterArray) => {
  const selectedFilterParams = getChangedParams(selectedFilterOptions)
  const changedFilters: { [key: string]: any } = {}

  /***
   *  If a filter option has been updated e.g. was { medium: "photography" } but
   *  is now { medium: "sculpture" } add the updated filter to changedFilters. Otherwise,
   *  add filter option to changedFilters.
   ***/
  forOwn(getChangedParams(selectedFilterOptions), (_value, paramName) => {
    const filterParamName = paramName as FilterParamName
    if (currentFilterParams[filterParamName] !== selectedFilterParams[filterParamName]) {
      changedFilters[filterParamName] = selectedFilterParams[filterParamName]
    }
  })

  return changedFilters
}
