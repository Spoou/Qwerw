import { OwnerType } from "@artsy/cohesion"
import { ArtistSeries_artistSeries } from "__generated__/ArtistSeries_artistSeries.graphql"
import { ArtistSeriesQuery } from "__generated__/ArtistSeriesQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtistSeriesArtworksFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesArtworks"
import { ArtistSeriesHeaderFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesHeader"
import { ArtistSeriesMetaFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesMeta"
import { ArtistSeriesMoreSeriesFragmentContainer } from "lib/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { Box, Flex, Separator, Spacer, Theme } from "palette"
import React, { useState } from "react"

import { ArtworkFilterNavigator, FilterModalMode } from "lib/Components/ArtworkFilter"
import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { useHideBackButtonOnScroll } from "lib/utils/hideBackButtonOnScroll"
import { PlaceholderBox, PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { OwnerEntityTypes, PageNames } from "lib/utils/track/schema"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
interface ArtistSeriesProps {
  artistSeries: ArtistSeries_artistSeries
}

export const ArtistSeries: React.FC<ArtistSeriesProps> = (props) => {
  const { artistSeries } = props
  const tracking = useTracking()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const artist = artistSeries.artist?.[0]

  const handleFilterArtworksModal = () => {
    setFilterArtworkModalVisible(!isFilterArtworksModalVisible)
  }

  const openFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "filter",
      context_screen_owner_type: Schema.OwnerEntityTypes.ArtistSeries,
      context_screen: Schema.PageNames.ArtistSeriesPage,
      context_screen_owner_id: artistSeries.internalID,
      context_screen_owner_slug: artistSeries.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    handleFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent({
      action_name: "closeFilterWindow",
      context_screen_owner_type: Schema.OwnerEntityTypes.ArtistSeries,
      context_screen: Schema.PageNames.ArtistSeriesPage,
      context_screen_owner_id: artistSeries.internalID,
      context_screen_owner_slug: artistSeries.slug,
      action_type: Schema.ActionTypes.Tap,
    })
    handleFilterArtworksModal()
  }

  const hideBackButtonOnScroll = useHideBackButtonOnScroll()

  return (
    <ProvideScreenTracking
      info={{
        context_screen: PageNames.ArtistSeriesPage,
        context_screen_owner_type: OwnerEntityTypes.ArtistSeries,
        context_screen_owner_slug: artistSeries.slug,
        context_screen_owner_id: artistSeries.internalID,
      }}
    >
      <ArtworkFiltersStoreProvider>
        <Theme>
          <ScrollView style={{ flex: 1 }} onScroll={hideBackButtonOnScroll}>
            <Flex px={2}>
              <ArtistSeriesHeaderFragmentContainer artistSeries={artistSeries} />
              <Spacer mt={2} mb={1} />
              <ArtistSeriesMetaFragmentContainer artistSeries={artistSeries} />
              <Separator mt={2} mb={1} />
              <ArtistSeriesArtworksFragmentContainer
                artistSeries={artistSeries}
                openFilterModal={openFilterArtworksModal}
              />
              <ArtworkFilterNavigator
                {...props}
                isFilterArtworksModalVisible={isFilterArtworksModalVisible}
                id={artistSeries.internalID}
                slug={artistSeries.slug}
                mode={FilterModalMode.ArtistSeries}
                exitModal={handleFilterArtworksModal}
                closeModal={closeFilterArtworksModal}
              />
              {!((artist?.artistSeriesConnection?.totalCount ?? 0) === 0) && (
                <>
                  <Separator mb={2} />
                  <Box pb={2}>
                    <ArtistSeriesMoreSeriesFragmentContainer
                      contextScreenOwnerId={artistSeries.internalID}
                      contextScreenOwnerSlug={artistSeries.slug}
                      contextScreenOwnerType={OwnerType.artistSeries}
                      artist={artist}
                      artistSeriesHeader="More series by this artist"
                      currentArtistSeriesExcluded
                    />
                  </Box>
                </>
              )}
            </Flex>
          </ScrollView>
        </Theme>
      </ArtworkFiltersStoreProvider>
    </ProvideScreenTracking>
  )
}

export const ArtistSeriesFragmentContainer = createFragmentContainer(ArtistSeries, {
  artistSeries: graphql`
    fragment ArtistSeries_artistSeries on ArtistSeries {
      internalID
      slug

      artistIDs

      ...ArtistSeriesHeader_artistSeries
      ...ArtistSeriesMeta_artistSeries
      ...ArtistSeriesArtworks_artistSeries @arguments(input: {
        sort: "-decayed_merch",
        dimensionRange: "*-*"
      })

      artist: artists(size: 1) {
        ...ArtistSeriesMoreSeries_artist
        artistSeriesConnection(first: 4) {
          totalCount
        }
      }
    }
  `,
})

const ArtistSeriesPlaceholder: React.FC<{}> = ({}) => {
  return (
    <Theme>
      <Box>
        <Box px="2" pt="1">
          {/* Series header image */}
          <PlaceholderBox height={180} width={180} alignSelf="center" />
          <Spacer mb={2} />
          {/* Artist Series name */}
          <PlaceholderText width={220} />
          {/* Artist series info */}
          <PlaceholderText width={190} />
          <PlaceholderText width={190} />
        </Box>
        <Spacer mb={2} />
        {/* masonry grid */}
        <PlaceholderGrid />
      </Box>
    </Theme>
  )
}

export const ArtistSeriesQueryRenderer: React.FC<{ artistSeriesID: string }> = ({ artistSeriesID }) => {
  return (
    <QueryRenderer<ArtistSeriesQuery>
      environment={defaultEnvironment}
      query={graphql`
        query ArtistSeriesQuery($artistSeriesID: ID!) {
          artistSeries(id: $artistSeriesID) {
            ...ArtistSeries_artistSeries
          }
        }
      `}
      cacheConfig={{ force: true }}
      variables={{
        artistSeriesID,
      }}
      render={renderWithPlaceholder({
        Container: ArtistSeriesFragmentContainer,
        renderPlaceholder: () => <ArtistSeriesPlaceholder />,
      })}
    />
  )
}
