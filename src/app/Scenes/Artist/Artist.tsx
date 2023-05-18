import { Screen, ShareIcon } from "@artsy/palette-mobile"
import {
  ArtistAboveTheFoldQuery,
  FilterArtworksInput,
} from "__generated__/ArtistAboveTheFoldQuery.graphql"
import { ArtistBelowTheFoldQuery } from "__generated__/ArtistBelowTheFoldQuery.graphql"
import { ArtistAboutContainer } from "app/Components/Artist/ArtistAbout/ArtistAbout"
import ArtistArtworks from "app/Components/Artist/ArtistArtworks/ArtistArtworks"
import { ArtistArtworksFilterHeader } from "app/Components/Artist/ArtistArtworks/ArtistArtworksFilterHeader"
import { ArtistHeaderFragmentContainer } from "app/Components/Artist/ArtistHeader"
import { ArtistInsightsFragmentContainer } from "app/Components/Artist/ArtistInsights/ArtistInsights"
import {
  FilterArray,
  filterArtworksParams,
  getFilterArrayFromQueryParams,
  prepareFilterArtworksParamsForInput,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { DEFAULT_ARTWORK_SORT } from "app/Components/ArtworkFilter/Filters/SortOptions"
import { getOnlyFilledSearchCriteriaValues } from "app/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { HeaderTabsGridPlaceholder } from "app/Components/HeaderTabGridPlaceholder"
import { usePopoverMessage } from "app/Components/PopoverMessage/popoverMessageHooks"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import { TabsContainer } from "app/Components/Tabs/TabsContainer"
import { SearchCriteriaQueryRenderer } from "app/Scenes/Artist/SearchCriteria"
import { goBack } from "app/system/navigation/navigate"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { AboveTheFoldQueryRenderer } from "app/utils/AboveTheFoldQueryRenderer"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { MotiView } from "moti"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, TouchableOpacity, View } from "react-native"
import { Tabs } from "react-native-collapsible-tab-view"
import { graphql } from "react-relay"
import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment"

const INITIAL_TAB = "Artworks"

interface ArtistProps {
  artistAboveTheFold: NonNullable<ArtistAboveTheFoldQuery["response"]["artist"]>
  artistBelowTheFold?: ArtistBelowTheFoldQuery["response"]["artist"]
  initialTab?: string
  searchCriteria: SearchCriteriaAttributes | null
  fetchCriteriaError: Error | null
  predefinedFilters?: FilterArray
  auctionResultsInitialFilters?: FilterArray
}

export const Artist: React.FC<ArtistProps> = (props) => {
  const {
    artistAboveTheFold,
    artistBelowTheFold,
    initialTab = INITIAL_TAB,
    searchCriteria,
    fetchCriteriaError,
    predefinedFilters,
    auctionResultsInitialFilters,
  } = props

  const popoverMessage = usePopoverMessage()
  const { showShareSheet } = useShareSheet()
  const [currentTab, setCurrentTab] = useState(initialTab)

  const displayAboutSection =
    artistAboveTheFold.has_metadata ||
    !!artistAboveTheFold.statuses?.articles ||
    (artistAboveTheFold.counts?.related_artists ?? 0) > 0

  useEffect(() => {
    if (!!fetchCriteriaError) {
      popoverMessage.show({
        title: "Sorry, an error occured",
        message: "Failed to get saved search criteria",
        placement: "top",
        type: "error",
      })
    }
  }, [fetchCriteriaError])

  const handleSharePress = () => {
    showShareSheet({
      type: "artist",
      internalID: artistAboveTheFold.internalID,
      slug: artistAboveTheFold.slug,
      artists: [{ name: artistAboveTheFold.name }],
      title: artistAboveTheFold.name!,
      href: artistAboveTheFold.href!,
      currentImageUrl: artistAboveTheFold.image?.url ?? undefined,
    })
  }

  const handleTabChange = (tabName: string) => {
    setCurrentTab(tabName)
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.ArtistPage,
        context_screen_owner_type: Schema.OwnerEntityTypes.Artist,
        context_screen_owner_slug: artistAboveTheFold.slug,
        context_screen_owner_id: artistAboveTheFold.internalID,
      }}
    >
      <ArtworkFiltersStoreProvider>
        <Screen>
          <Screen.Body fullwidth>
            <Screen.Header
              onBack={goBack}
              rightElements={
                <>
                  <TouchableOpacity onPress={handleSharePress}>
                    <ShareIcon width={23} height={23} />
                  </TouchableOpacity>
                </>
              }
            />
            <TabsContainer
              initialTabName={initialTab}
              onTabPress={handleTabChange}
              renderHeader={() => {
                return <ArtistHeaderFragmentContainer artist={artistAboveTheFold!} />
              }}
              renderBelowTabBar={() => {
                if (currentTab === "Artworks") {
                  return (
                    <MotiView
                      from={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 100 }}
                    >
                      <ArtistArtworksFilterHeader artist={artistAboveTheFold!} />
                    </MotiView>
                  )
                }

                return null
              }}
            >
              {displayAboutSection ? (
                <Tabs.Tab name="Overview" label="Overview">
                  <Tabs.Lazy>
                    <>
                      {artistBelowTheFold ? (
                        <ArtistAboutContainer artist={artistBelowTheFold} />
                      ) : (
                        <LoadingPage />
                      )}
                    </>
                  </Tabs.Lazy>
                </Tabs.Tab>
              ) : null}

              <Tabs.Tab name="Artworks" label="Artworks">
                <Tabs.Lazy>
                  <ArtistArtworks
                    artist={artistAboveTheFold}
                    searchCriteria={searchCriteria}
                    predefinedFilters={predefinedFilters}
                  />
                </Tabs.Lazy>
              </Tabs.Tab>

              {artistAboveTheFold?.statuses?.auctionLots ? (
                <Tabs.Tab name="Insights" label="Insights">
                  <Tabs.Lazy>
                    <>
                      {artistBelowTheFold ? (
                        <ArtistInsightsFragmentContainer
                          artist={artistBelowTheFold}
                          initialFilters={auctionResultsInitialFilters}
                        />
                      ) : (
                        <LoadingPage />
                      )}
                    </>
                  </Tabs.Lazy>
                </Tabs.Tab>
              ) : null}
            </TabsContainer>
          </Screen.Body>
        </Screen>
      </ArtworkFiltersStoreProvider>
    </ProvideScreenTracking>
  )
}

interface ArtistQueryRendererProps {
  environment?: RelayModernEnvironment
  initialTab?: string
  searchCriteriaID?: string
  search_criteria_id?: string
  artistID: string
  predefinedFilters?: FilterArray
  categories?: string[]
  sizes?: string[]
}

export const ArtistScreenQuery = graphql`
  query ArtistAboveTheFoldQuery($artistID: String!, $input: FilterArtworksInput) {
    artist(id: $artistID) {
      ...ArtistArtworksFilterHeader_artist
      ...ArtistHeader_artist
      ...ArtistArtworks_artist @arguments(input: $input)
      internalID
      slug
      has_metadata: hasMetadata
      counts {
        partner_shows: partnerShows
        related_artists: relatedArtists
      }
      href
      name
      image {
        url(version: "large")
      }
      statuses {
        auctionLots
        articles
      }
    }
  }
`

export const defaultArtistVariables = () => ({
  input: {
    sort: DEFAULT_ARTWORK_SORT.paramValue,
  },
})

export const ArtistQueryRenderer: React.FC<ArtistQueryRendererProps> = (props) => {
  const {
    artistID,
    environment,
    initialTab,
    searchCriteriaID,
    search_criteria_id,
    predefinedFilters,
    categories,
    sizes,
  } = props

  return (
    <SearchCriteriaQueryRenderer
      searchCriteriaId={searchCriteriaID ?? search_criteria_id}
      environment={environment}
      render={{
        renderPlaceholder: () => <HeaderTabsGridPlaceholder />,
        renderComponent: (searchCriteriaProps) => {
          const { savedSearchCriteria, fetchCriteriaError } = searchCriteriaProps
          const predefinedFilterParams = filterArtworksParams(predefinedFilters ?? [], "artwork")
          let initialArtworksInput = {
            ...defaultArtistVariables().input,
            ...predefinedFilterParams,
          }

          if (savedSearchCriteria) {
            const preparedCriteria = getOnlyFilledSearchCriteriaValues(savedSearchCriteria)

            initialArtworksInput = {
              ...initialArtworksInput,
              ...preparedCriteria,
              sort: "-published_at",
            }
          }
          const input = prepareFilterArtworksParamsForInput(initialArtworksInput)

          return (
            <AboveTheFoldQueryRenderer<ArtistAboveTheFoldQuery, ArtistBelowTheFoldQuery>
              environment={environment || getRelayEnvironment()}
              above={{
                query: ArtistScreenQuery,
                variables: {
                  artistID,
                  input: input as FilterArtworksInput,
                },
              }}
              below={{
                query: graphql`
                  query ArtistBelowTheFoldQuery($artistID: String!) {
                    artist(id: $artistID) {
                      ...ArtistAbout_artist
                      ...ArtistInsights_artist
                    }
                  }
                `,
                variables: { artistID },
              }}
              render={{
                renderPlaceholder: () => <HeaderTabsGridPlaceholder />,
                renderComponent: ({ above, below }) => {
                  if (!above.artist) {
                    throw new Error("no artist data")
                  }
                  return (
                    <Artist
                      artistAboveTheFold={above.artist}
                      artistBelowTheFold={below?.artist}
                      initialTab={initialTab}
                      searchCriteria={savedSearchCriteria}
                      fetchCriteriaError={fetchCriteriaError}
                      predefinedFilters={predefinedFilters}
                      auctionResultsInitialFilters={getFilterArrayFromQueryParams({
                        categories: categories ?? [],
                        sizes: sizes ?? [],
                      })}
                    />
                  )
                },
              }}
            />
          )
        },
      }}
    />
  )
}

/**
 * Be lazy and just have a simple loading spinner for the below-the-fold tabs
 * (as opposed to nice fancy placeholder screens) since people are really
 * unlikely to tap into them quick enough to see the loading state
 * @param param0
 */
const LoadingPage: React.FC<{}> = ({}) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <ActivityIndicator />
    </View>
  )
}
