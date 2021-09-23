import { OwnerType } from "@artsy/cohesion"
import { ArtistArtworks_artist } from "__generated__/ArtistArtworks_artist.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import { Aggregations, filterArtworksParams } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider, ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { ORDERED_ARTWORK_SORTS } from "lib/Components/ArtworkFilter/Filters/SortOptions"
import { convertSavedSearchCriteriaToFilterParams } from "lib/Components/ArtworkFilter/SavedSearch/convertersToFilterParams"
import { getAllowedFiltersForSavedSearchInput } from "lib/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { useArtworkFilters, useSelectedFiltersCount } from "lib/Components/ArtworkFilter/useArtworkFilters"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { ArtworksFilterHeader } from "lib/Components/ArtworkGrids/FilterHeader"
import { ArtworksFilterHeader as FilterHeader } from "lib/Components/ArtworkGrids/FilterHeader2"
import {
  InfiniteScrollArtworksGridContainer as InfiniteScrollArtworksGrid,
  Props as InfiniteScrollGridProps,
} from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { StickyTabPageFlatListContext } from "lib/Components/StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "lib/Components/StickyTabPage/StickyTabPageScrollView"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { Schema } from "lib/utils/track"
import { Box, Separator, Spacer } from "palette"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { Platform } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { SavedSearchBannerQueryRender } from "./SavedSearchBanner"
import { SavedSearchButtonQueryRenderer } from "./SavedSearchButton"

interface ArtworksGridProps extends InfiniteScrollGridProps {
  artist: ArtistArtworks_artist
  searchCriteria: SearchCriteriaAttributes | null
  relay: RelayPaginationProp
}

const ArtworksGrid: React.FC<ArtworksGridProps> = ({ artist, relay, ...props }) => {
  const tracking = useTracking()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const handleCloseFilterArtworksModal = () => setFilterArtworkModalVisible(false)
  const handleOpenFilterArtworksModal = () => setFilterArtworkModalVisible(true)

  const openFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "filter",
      context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
      context_screen: Schema.PageNames.ArtistPage,
      context_screen_owner_id: artist.id,
      context_screen_owner_slug: artist.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    handleOpenFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "closeFilterWindow",
      context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
      context_screen: Schema.PageNames.ArtistPage,
      context_screen_owner_id: artist.id,
      context_screen_owner_slug: artist.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    handleCloseFilterArtworksModal()
  }

  return (
    <ArtworkFiltersStoreProvider>
      <StickyTabPageScrollView>
        <ArtistArtworksContainer {...props} artist={artist} relay={relay} openFilterModal={openFilterArtworksModal} />
        <ArtworkFilterNavigator
          {...props}
          id={artist.internalID}
          slug={artist.slug}
          isFilterArtworksModalVisible={isFilterArtworksModalVisible}
          exitModal={handleCloseFilterArtworksModal}
          closeModal={closeFilterArtworksModal}
          mode={FilterModalMode.ArtistArtworks}
        />
      </StickyTabPageScrollView>
    </ArtworkFiltersStoreProvider>
  )
}
interface ArtistArtworksContainerProps {
  openFilterModal: () => void
}

const ArtistArtworksContainer: React.FC<ArtworksGridProps & ArtistArtworksContainerProps> = ({
  artist,
  relay,
  searchCriteria,
  openFilterModal,
  ...props
}) => {
  const tracking = useTracking()
  const enableSavedSearch =
    Platform.OS === "ios" ? useFeatureFlag("AREnableSavedSearch") : useFeatureFlag("AREnableSavedSearchAndroid")
  const enableSavedSearchV2 = useFeatureFlag("AREnableSavedSearchV2")
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)

  const setInitialFilterStateAction = ArtworksFiltersStore.useStoreActions((state) => state.setInitialFilterStateAction)

  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)

  const filterParams = useMemo(() => filterArtworksParams(appliedFilters), [appliedFilters])
  const appliedFiltersCount = useSelectedFiltersCount()
  const allowedFiltersForSavedSearch = useMemo(() => getAllowedFiltersForSavedSearchInput(appliedFilters), [
    appliedFilters,
  ])
  const artworks = artist.artworks
  const artworksCount = artworks?.edges?.length
  const artworksTotal = artworks?.counts?.total ?? 0

  useArtworkFilters({
    relay,
    aggregations: artist.aggregations?.aggregations,
    componentPath: "ArtistArtworks/ArtistArtworks",
  })

  useEffect(() => {
    if (searchCriteria && artist.aggregations?.aggregations) {
      const params = convertSavedSearchCriteriaToFilterParams(
        searchCriteria,
        artist.aggregations.aggregations as Aggregations
      )
      const sortFilterItem = ORDERED_ARTWORK_SORTS.find((sortEntity) => sortEntity.paramValue === "-published_at")

      setInitialFilterStateAction([...params, sortFilterItem!])
    }
  }, [])

  // TODO: Convert to use cohesion
  const trackClear = (id: string, slug: string) => {
    tracking.trackEvent({
      action_name: "clearFilters",
      context_screen: Schema.ContextModules.ArtworkGrid,
      context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    })
  }

  const setJSX = useContext(StickyTabPageFlatListContext).setJSX

  useEffect(() => {
    setJSX(
      <Box backgroundColor="white">
        {enableSavedSearchV2 || enableSavedSearch ? (
          <FilterHeader onFilterPress={openFilterModal} selectedFiltersCount={appliedFiltersCount}>
            {allowedFiltersForSavedSearch.length > 0 ? (
              !!enableSavedSearchV2 ? (
                <SavedSearchButtonQueryRenderer
                  filters={allowedFiltersForSavedSearch}
                  artistId={artist.internalID}
                  artistName={artist.name!}
                  artistSlug={artist.slug}
                  aggregations={aggregations}
                />
              ) : (
                <SavedSearchBannerQueryRender
                  artistId={artist.internalID}
                  filters={filterParams}
                  artistSlug={artist.slug}
                />
              )
            ) : null}
          </FilterHeader>
        ) : (
          <ArtworksFilterHeader count={artworksTotal} onFilterPress={openFilterModal} />
        )}
        <Separator />
      </Box>
    )
  }, [
    artworksTotal,
    filterParams,
    enableSavedSearch,
    enableSavedSearchV2,
    aggregations,
    allowedFiltersForSavedSearch,
    appliedFiltersCount,
  ])

  const filteredArtworks = () => {
    if (artworksCount === 0) {
      return (
        <Box mb="80px" pt={1}>
          <FilteredArtworkGridZeroState id={artist.id} slug={artist.slug} trackClear={trackClear} />
        </Box>
      )
    } else {
      return (
        <>
          <Spacer mb={1} />
          <InfiniteScrollArtworksGrid
            connection={artist.artworks!}
            loadMore={relay.loadMore}
            hasMore={relay.hasMore}
            {...props}
            contextScreenOwnerType={OwnerType.artist}
            contextScreenOwnerId={artist.internalID}
            contextScreenOwnerSlug={artist.slug}
          />
        </>
      )
    }
  }

  return artist.artworks ? filteredArtworks() : null
}

export default createPaginationContainer(
  ArtworksGrid,
  {
    artist: graphql`
      fragment ArtistArtworks_artist on Artist
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        id
        slug
        name
        internalID
        aggregations: filterArtworksConnection(
          first: 0
          aggregations: [
            COLOR
            DIMENSION_RANGE
            LOCATION_CITY
            MAJOR_PERIOD
            MATERIALS_TERMS
            MEDIUM
            PARTNER
            PRICE_RANGE
          ]
        ) {
          aggregations {
            slice
            counts {
              count
              name
              value
            }
          }
        }
        artworks: filterArtworksConnection(first: $count, after: $cursor, input: $input)
          @connection(key: "ArtistArtworksGrid_artworks") {
          edges {
            node {
              id
            }
          }
          counts {
            total
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.artist && props.artist.artworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        id: props.artist.id,
        input: fragmentVariables.input,
        count,
        cursor,
      }
    },
    query: graphql`
      query ArtistArtworksQuery($id: ID!, $count: Int!, $cursor: String, $input: FilterArtworksInput) {
        node(id: $id) {
          ... on Artist {
            ...ArtistArtworks_artist @arguments(count: $count, cursor: $cursor, input: $input)
          }
        }
      }
    `,
  }
)
