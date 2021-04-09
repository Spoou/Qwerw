import { useEffect } from "react"
import { RelayPaginationProp } from "react-relay"
import { ArtworksFiltersStore, selectedOptionsUnion } from "./ArtworkFiltersStore"
import { aggregationForFilter, filterArtworksParams, FilterParamName } from "./FilterArtworksHelpers"

export const useArtworkFilters = ({
  relay,
  aggregations,
}: { relay?: RelayPaginationProp; aggregations?: unknown } = {}) => {
  const setAggregationsAction = ArtworksFiltersStore.useStoreActions((state) => state.setAggregationsAction)
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const applyFilters = ArtworksFiltersStore.useStoreState((state) => state.applyFilters)
  const filterType = ArtworksFiltersStore.useStoreState((state) => state.filterType)

  const filterParams = filterArtworksParams(appliedFilters, filterType)

  useEffect(() => {
    if (!aggregations) {
      return
    }

    setAggregationsAction(aggregations)
  }, [aggregations])

  useEffect(() => {
    if (relay !== undefined && applyFilters) {
      relay.refetchConnection(
        30,
        (error) => {
          if (error) {
            throw error
          }
        },
        filterParams
      )
    }
  }, [relay, appliedFilters, filterParams])

  return {
    // state, // TODO: Remove this if possible (it shoud be possilbe)
    filterParams,
  }
}

export const useArtworkFiltersAggregation = ({ paramName }: { paramName: FilterParamName }) => {
  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const selectedFilters = ArtworksFiltersStore.useStoreState((state) => state.selectedFilters)
  const filterType = ArtworksFiltersStore.useStoreState((state) => state.filterType)
  const previouslyAppliedFilters = ArtworksFiltersStore.useStoreState((state) => state.previouslyAppliedFilters)

  const aggregation = aggregationForFilter(paramName, aggregations)

  const selectedOptions = selectedOptionsUnion({
    selectedFilters,
    previouslyAppliedFilters,
    filterType,
  })

  const selectedOption = selectedOptions.find((option) => option.paramName === paramName)!

  return {
    // state, // TODO: Remove this if possible (it shoud be possilbe)
    aggregation,
    selectedOption,
  }
}
