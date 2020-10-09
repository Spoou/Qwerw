import { SaleLotsList_saleArtworksConnection } from "__generated__/SaleLotsList_saleArtworksConnection.graphql"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "lib/data/constants"
import { ArtworkFilterContext } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { filterArtworksParams, ViewAsValues } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Flex, Sans } from "palette"
import React, { useContext, useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { SaleArtworkListContainer } from "./SaleArtworkList"

interface Props {
  saleArtworksConnection: SaleLotsList_saleArtworksConnection
  relay: RelayPaginationProp
  saleID: string
}

export const SaleLotsList: React.FC<Props> = ({ saleArtworksConnection, relay }) => {
  const { state, dispatch } = useContext(ArtworkFilterContext)
  const filterParams = filterArtworksParams(state.appliedFilters)
  const showList = state.appliedFilters.find((filter) => filter.paramValue === ViewAsValues.List)

  useEffect(() => {
    if (state.applyFilters) {
      relay.refetchConnection(
        PAGE_SIZE,
        (error) => {
          if (error) {
            throw new Error("Sale/SaleLotsList filter error: " + error.message)
          }
        },
        filterParams
      )
    }
  }, [state.appliedFilters])

  // useEffect(() => {
  //   dispatch({
  //     type: "setAggregations",
  //     payload: saleArtworksConnection.saleArtworksConnection?.aggregations,
  //   })
  // }, [])

  useEffect(() => {
    dispatch({
      type: "setFilterType",
      payload: "saleArtwork",
    })
  }, [])

  const FiltersResume = () => (
    <Flex px={2} mb={1}>
      <Sans size="4" ellipsizeMode="tail" numberOfLines={1} data-test-id="title">
        Sorted by lot number (ascending)
      </Sans>

      <Sans size="3t" color="black60" data-test-id="subtitle">
        Showing 84 of 84 lots
      </Sans>
    </Flex>
  )

  return (
    <Flex flex={1} my={4}>
      {/* TODO: NO LOTS */}
      <FiltersResume />

      {showList ? (
        <SaleArtworkListContainer
          connection={saleArtworksConnection.saleArtworksConnection!}
          hasMore={relay.hasMore}
          loadMore={relay.loadMore}
          isLoading={relay.isLoading}
        />
      ) : (
        <Flex px={2}>
          <InfiniteScrollArtworksGridContainer
            connection={saleArtworksConnection.saleArtworksConnection!}
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

export const SaleLotsListContainer = createPaginationContainer(
  SaleLotsList,
  {
    saleArtworksConnection: graphql`
      fragment SaleLotsList_saleArtworksConnection on Query
      @argumentDefinitions(
        count: { type: "Int!", defaultValue: 10 }
        cursor: { type: "String" }
        saleID: { type: "ID" }
        sort: { type: "String", defaultValue: "position" }
      ) {
        saleArtworksConnection(first: $count, after: $cursor, sort: $sort, saleID: $saleID)
        # aggregations: [MEDIUM]
        @connection(key: "SaleLotsList_saleArtworksConnection") {
          aggregations {
            slice
            counts {
              count
              name
              value
            }
          }
          edges {
            node {
              id
            }
          }
          totalCount
          ...SaleArtworkList_connection
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.saleArtworksConnection.saleArtworksConnection
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
        saleID: _props.saleID,
      }
    },
    query: graphql`
      query SaleLotsListQuery($count: Int!, $cursor: String, $sort: String, $saleID: ID) @raw_response_type {
        ...SaleLotsList_saleArtworksConnection @arguments(count: $count, cursor: $cursor, saleID: $saleID, sort: $sort)
      }
    `,
  }
)
