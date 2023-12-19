import { OwnerType } from "@artsy/cohesion"
import {
  Box,
  Text,
  SimpleMessage,
  Tabs,
  Flex,
  useSpace,
  useScreenDimensions,
  Spinner,
} from "@artsy/palette-mobile"
import { GeneArtworks_gene$data } from "__generated__/GeneArtworks_gene.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { GeneArtworksFilterHeader } from "app/Components/Gene/GeneArtworksFilterHeader"
import { useNavigateToPageableRoute } from "app/system/navigation/useNavigateToPageableRoute"
import { extractNodes } from "app/utils/extractNodes"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
} from "app/utils/masonryHelpers"
import { Schema } from "app/utils/track"
import React, { useCallback, useRef, useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface GeneArtworksContainerProps {
  gene: GeneArtworks_gene$data
  relay: RelayPaginationProp
}

export const GeneArtworksContainer: React.FC<GeneArtworksContainerProps> = (props) => {
  const { gene, relay } = props
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const space = useSpace()
  const tracking = useTracking()
  const { width } = useScreenDimensions()
  const artworks = extractNodes(gene.artworks)
  const shouldDisplaySpinner = !!artworks.length && !!relay.isLoading() && !!relay.hasMore()
  const { navigateToPageableRoute } = useNavigateToPageableRoute({ items: artworks })

  const artworksTotal = gene.artworks?.counts?.total ?? 0
  const initialArtworksTotal = useRef(artworksTotal)

  useArtworkFilters({
    relay,
    aggregations: gene.artworks?.aggregations,
    componentPath: "Gene/GeneArtworks",
  })

  const trackClear = () => {
    tracking.trackEvent(tracks.clearFilters(gene.id, gene.slug))
  }

  const handleCloseFilterArtworksModal = () => setFilterArtworkModalVisible(false)
  const handleOpenFilterArtworksModal = () => setFilterArtworkModalVisible(true)

  const openFilterArtworksModal = () => {
    tracking.trackEvent(tracks.openFilterWindow(gene.id, gene.slug))
    handleOpenFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent(tracks.closeFilterWindow(gene.id, gene.slug))
    handleCloseFilterArtworksModal()
  }

  const loadMore = useCallback(() => {
    if (relay.hasMore() && !relay.isLoading()) {
      relay.loadMore(10)
    }
  }, [relay.hasMore(), relay.isLoading()])

  return (
    <>
      <Tabs.Masonry
        data={artworks}
        numColumns={NUM_COLUMNS_MASONRY}
        estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          initialArtworksTotal ? (
            <Box mt={1}>
              <SimpleMessage>
                There aren’t any works available in the category at this time.
              </SimpleMessage>
            </Box>
          ) : (
            <Box pt={1}>
              <FilteredArtworkGridZeroState id={gene.id} slug={gene.slug} trackClear={trackClear} />
            </Box>
          )
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item, columnIndex }) => {
          const imgAspectRatio = item.image?.aspectRatio ?? 1
          const imgWidth = width / NUM_COLUMNS_MASONRY - space(2) - space(1)
          const imgHeight = imgWidth / imgAspectRatio

          return (
            <Flex
              pl={columnIndex === 0 ? 0 : 1}
              pr={NUM_COLUMNS_MASONRY - (columnIndex + 1) === 0 ? 0 : 1}
              mt={2}
            >
              <ArtworkGridItem
                contextScreenOwnerType={OwnerType.gene}
                contextScreenOwnerId={gene.internalID}
                contextScreenOwnerSlug={gene.slug}
                artwork={item}
                height={imgHeight}
                navigateToPageableRoute={navigateToPageableRoute}
              />
            </Flex>
          )
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
        ListFooterComponent={
          shouldDisplaySpinner ? (
            <Flex my={4} flexDirection="row" justifyContent="center">
              <Spinner />
            </Flex>
          ) : null
        }
        // need to pass zIndex: 1 here in order for the SubTabBar to
        // be visible above list content
        ListHeaderComponentStyle={{ zIndex: 1 }}
        ListHeaderComponent={
          <>
            <Tabs.SubTabBar>
              <GeneArtworksFilterHeader openFilterArtworksModal={openFilterArtworksModal} />
            </Tabs.SubTabBar>
            <Flex pt={1}>
              <Text variant="xs" color="black60">
                Showing {artworksTotal} works
              </Text>
            </Flex>
          </>
        }
      />
      <ArtworkFilterNavigator
        {...props}
        id={gene.internalID}
        slug={gene.slug}
        visible={isFilterArtworksModalVisible}
        exitModal={handleCloseFilterArtworksModal}
        closeModal={closeFilterArtworksModal}
        mode={FilterModalMode.Gene}
      />
    </>
  )
}

export const GeneArtworksPaginationContainer = createPaginationContainer(
  GeneArtworksContainer,
  {
    gene: graphql`
      fragment GeneArtworks_gene on Gene
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String", defaultValue: "" }
        input: { type: "FilterArtworksInput" }
      ) {
        id
        internalID
        slug
        artworks: filterArtworksConnection(
          first: $count
          after: $cursor
          aggregations: [
            LOCATION_CITY
            ARTIST_NATIONALITY
            PRICE_RANGE
            COLOR
            DIMENSION_RANGE
            PARTNER
            MAJOR_PERIOD
            MEDIUM
            PRICE_RANGE
            ARTIST
            LOCATION_CITY
            MATERIALS_TERMS
          ]
          forSale: true
          input: $input
        ) @connection(key: "GeneArtworksGrid_artworks") {
          counts {
            total
          }
          aggregations {
            slice
            counts {
              value
              name
              count
            }
          }
          edges {
            node {
              id
              slug
              image(includeAll: false) {
                aspectRatio
              }
              ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.gene.artworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        input: fragmentVariables.input,
        id: props.gene.id,
        count,
        cursor,
      }
    },
    query: graphql`
      query GeneArtworksPaginationQuery(
        $id: ID!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        node(id: $id) {
          ... on Gene {
            ...GeneArtworks_gene @arguments(count: $count, cursor: $cursor, input: $input)
          }
        }
      }
    `,
  }
)

export const tracks = {
  clearFilters: (id: string, slug: string) => ({
    action_name: "clearFilters",
    context_screen: Schema.PageNames.GenePage,
    context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
  openFilterWindow: (id: string, slug: string) => ({
    action_name: "filter",
    context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
    context_screen: Schema.PageNames.GenePage,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
  closeFilterWindow: (id: string, slug: string) => ({
    action_name: "closeFilterWindow",
    context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
    context_screen: Schema.PageNames.GenePage,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
}
