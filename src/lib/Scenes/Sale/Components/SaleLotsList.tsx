import { OwnerType } from "@artsy/cohesion"
import { themeGet } from "@styled-system/theme-get"
import { SaleLotsList_saleArtworksConnection } from "__generated__/SaleLotsList_saleArtworksConnection.graphql"
import { SaleLotsList_unfilteredSaleArtworksConnection } from "__generated__/SaleLotsList_unfilteredSaleArtworksConnection.graphql"
import {
  filterArtworksParams,
  FilterParamName,
  FilterParams,
  ViewAsValues,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { ORDERED_SALE_ARTWORK_SORTS } from "lib/Components/ArtworkFilter/Filters/SortOptions"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { Schema } from "lib/utils/track"
import { Box, Flex, Sans } from "palette"
import React, { useCallback, useEffect, useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { SaleArtworkListContainer } from "./SaleArtworkList"

interface Props {
  saleArtworksConnection: SaleLotsList_saleArtworksConnection
  unfilteredSaleArtworksConnection: SaleLotsList_unfilteredSaleArtworksConnection | null
  relay: RelayPaginationProp
  saleID: string
  saleSlug: string
  scrollToTop: () => void
}

export const SaleLotsListSortMode = ({
  filterParams,
  filteredTotal,
  totalCount,
}: {
  filterParams: FilterParams
  filteredTotal: number | null | undefined
  totalCount: number | null | undefined
}) => {
  const getSortDescription = useCallback(() => {
    const sortMode = ORDERED_SALE_ARTWORK_SORTS.find((sort) => sort.paramValue === filterParams?.sort)
    if (sortMode) {
      return sortMode.displayText
    }
  }, [filterParams])

  return (
    <Flex px={2} mb={2}>
      <FilterTitle size="4" ellipsizeMode="tail">
        Sorted by {getSortDescription()?.toLowerCase()}
      </FilterTitle>

      {!!filteredTotal && !!totalCount && (
        <FilterDescription size="3t">{`Showing ${filteredTotal} of ${totalCount}`}</FilterDescription>
      )}
    </Flex>
  )
}

export const SaleLotsList: React.FC<Props> = ({
  saleArtworksConnection,
  unfilteredSaleArtworksConnection,
  relay,
  saleID,
  saleSlug,
  scrollToTop,
}) => {
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const tracking = useTracking()

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const applyFiltersState = ArtworksFiltersStore.useStoreState((state) => state.applyFilters)
  const filterTypeState = ArtworksFiltersStore.useStoreState((state) => state.filterType)
  const setAggregationsAction = ArtworksFiltersStore.useStoreActions((action) => action.setAggregationsAction)
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions((action) => action.setFiltersCountAction)
  const setFilterTypeAction = ArtworksFiltersStore.useStoreActions((action) => action.setFilterTypeAction)

  const filterParams = filterArtworksParams(appliedFiltersState, filterTypeState)
  const viewAsFilter = appliedFiltersState.find((filter) => filter.paramName === FilterParamName.viewAs)
  const counts = saleArtworksConnection.saleArtworksConnection?.counts

  useEffect(() => {
    setFilterTypeAction("saleArtwork")
  }, [])

  useEffect(() => {
    setTotalCount(saleArtworksConnection.saleArtworksConnection?.counts?.total || 0)
  }, [])

  useEffect(() => {
    if (applyFiltersState) {
      // Add the new medium to geneIDs array
      relay.refetchConnection(
        10,
        (error) => {
          if (error) {
            throw new Error("Sale/SaleLotsList filter error: " + error.message)
          }
        },
        {
          ...filterParams,
          saleID: saleSlug,
          geneIDs: filterParams.additionalGeneIDs || [],
          includeArtworksByFollowedArtists: !!filterParams.includeArtworksByFollowedArtists,
        }
      )
      scrollToTop()
    }
  }, [appliedFiltersState])

  useEffect(() => {
    setAggregationsAction(saleArtworksConnection.saleArtworksConnection?.aggregations)
  }, [])

  useEffect(() => {
    if (saleArtworksConnection.saleArtworksConnection?.counts) {
      setFiltersCountAction(saleArtworksConnection.saleArtworksConnection?.counts)
    }
  }, [])

  const trackClear = (id: string, slug: string) => {
    tracking.trackEvent({
      action_name: "clearFilters",
      context_screen: Schema.ContextModules.Auction,
      context_screen_owner_type: Schema.OwnerEntityTypes.Auction,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    })
  }

  if (unfilteredSaleArtworksConnection?.counts?.total === 0) {
    return null
  }

  if (!saleArtworksConnection.saleArtworksConnection?.edges?.length) {
    return (
      <Box my="80px">
        <FilteredArtworkGridZeroState id={saleID} slug={saleSlug} trackClear={trackClear} />
      </Box>
    )
  }

  return (
    <Flex flex={0} my={4}>
      <SaleLotsListSortMode filterParams={filterParams} filteredTotal={counts?.total} totalCount={totalCount} />

      {viewAsFilter?.paramValue === ViewAsValues.List ? (
        <SaleArtworkListContainer
          connection={saleArtworksConnection.saleArtworksConnection!}
          hasMore={relay.hasMore}
          loadMore={relay.loadMore}
          isLoading={relay.isLoading}
          contextScreenOwnerType={OwnerType.sale}
          contextScreenOwnerId={saleID}
          contextScreenOwnerSlug={saleSlug}
        />
      ) : (
        <Flex px={2}>
          <InfiniteScrollArtworksGridContainer
            connection={saleArtworksConnection.saleArtworksConnection!}
            contextScreenOwnerType={OwnerType.sale}
            contextScreenOwnerId={saleID}
            contextScreenOwnerSlug={saleSlug}
            hasMore={relay.hasMore}
            loadMore={relay.loadMore}
            showLotLabel
            hidePartner
            hideUrgencyTags
          />
        </Flex>
      )}
    </Flex>
  )
}

export const FilterTitle = styled(Sans)``
export const FilterDescription = styled(Sans)`
  color: ${themeGet("colors.black60")};
`

export const SaleLotsListContainer = createPaginationContainer(
  SaleLotsList,
  {
    unfilteredSaleArtworksConnection: graphql`
      fragment SaleLotsList_unfilteredSaleArtworksConnection on SaleArtworksConnection {
        counts {
          total
        }
      }
    `,
    saleArtworksConnection: graphql`
      fragment SaleLotsList_saleArtworksConnection on Query
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        artistIDs: { type: "[String]", defaultValue: [] }
        geneIDs: { type: "[String]", defaultValue: [] }
        estimateRange: { type: "String", defaultValue: "" }
        sort: { type: "String", defaultValue: "position" }
        includeArtworksByFollowedArtists: { type: "Boolean", defaultValue: false }
        saleID: { type: "ID" }
      ) {
        saleArtworksConnection(
          after: $cursor
          saleID: $saleID
          artistIDs: $artistIDs
          geneIDs: $geneIDs
          aggregations: [FOLLOWED_ARTISTS, ARTIST, MEDIUM, TOTAL]
          estimateRange: $estimateRange
          first: $count
          includeArtworksByFollowedArtists: $includeArtworksByFollowedArtists
          sort: $sort
        ) @connection(key: "SaleLotsList_saleArtworksConnection") {
          aggregations {
            slice
            counts {
              count
              name
              value
            }
          }
          counts {
            followedArtists
            total
          }
          edges {
            node {
              id
            }
          }
          ...SaleArtworkList_connection
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.saleArtworksConnection?.saleArtworksConnection
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query SaleLotsListQuery(
        $geneIDs: [String]
        $artistIDs: [String]
        $count: Int!
        $cursor: String
        $estimateRange: String
        $saleID: ID
        $sort: String
        $includeArtworksByFollowedArtists: Boolean
      )
      # $saleID: ID
      @raw_response_type {
        ...SaleLotsList_saleArtworksConnection
          @arguments(
            geneIDs: $geneIDs
            artistIDs: $artistIDs
            count: $count
            cursor: $cursor
            sort: $sort
            estimateRange: $estimateRange
            saleID: $saleID
            includeArtworksByFollowedArtists: $includeArtworksByFollowedArtists
          )
      }
    `,
  }
)
