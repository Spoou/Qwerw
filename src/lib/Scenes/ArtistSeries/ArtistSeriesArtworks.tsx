import { OwnerType } from "@artsy/cohesion"
import { ArtistSeriesArtworks_artistSeries } from "__generated__/ArtistSeriesArtworks_artistSeries.graphql"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { ARTIST_SERIES_PAGE_SIZE } from "lib/data/constants"
import { Box, Separator } from "palette"
import React from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

interface ArtistSeriesArtworksProps {
  artistSeries: ArtistSeriesArtworks_artistSeries
  relay: RelayPaginationProp
}
export const ArtistSeriesArtworks: React.FC<ArtistSeriesArtworksProps> = ({ artistSeries, relay }) => {
  const artworks = artistSeries?.artistSeriesArtworks!

  if (artworks?.counts?.total === 0) {
    return null
  }

  return (
    <Box>
      <Separator my={2} />
      <InfiniteScrollArtworksGridContainer
        connection={artworks}
        loadMore={relay.loadMore}
        hasMore={relay.hasMore}
        isLoading={relay.isLoading}
        autoFetch={false}
        pageSize={ARTIST_SERIES_PAGE_SIZE}
        contextScreenOwnerType={OwnerType.artistSeries}
        contextScreenOwnerId={artistSeries.internalID}
        contextScreenOwnerSlug={artistSeries.slug}
      />
    </Box>
  )
}

export const ArtistSeriesArtworksFragmentContainer = createPaginationContainer(
  ArtistSeriesArtworks,
  {
    artistSeries: graphql`
      fragment ArtistSeriesArtworks_artistSeries on ArtistSeries
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 20 }
          cursor: { type: "String" }
          sort: { type: "String", defaultValue: "-decayed_merch" }
        ) {
        slug
        internalID
        artistSeriesArtworks: filterArtworksConnection(first: 20, sort: $sort, after: $cursor)
          @connection(key: "ArtistSeries_artistSeriesArtworks") {
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
      return props?.artistSeries.artistSeriesArtworks
    },
    getFragmentVariables(previousVariables, count) {
      // Relay is unable to infer this for this component, I'm not sure why.
      return {
        ...previousVariables,
        count,
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        props,
        count,
        cursor,
        id: props.artistSeries.slug,
      }
    },
    query: graphql`
      query ArtistSeriesArtworksInfiniteScrollGridQuery($id: ID!, $count: Int!, $cursor: String, $sort: String) {
        artistSeries(id: $id) {
          ...ArtistSeriesArtworks_artistSeries @arguments(count: $count, cursor: $cursor, sort: $sort)
        }
      }
    `,
  }
)
