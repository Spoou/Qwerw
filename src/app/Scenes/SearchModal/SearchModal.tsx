import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Box, Flex, RoundSearchInput, Screen, Spacer, useSpace } from "@artsy/palette-mobile"
import { SearchModalQuery } from "__generated__/SearchModalQuery.graphql"
import { RecentSearches } from "app/Scenes/Search/RecentSearches"
import {
  SEARCH_INPUT_PLACEHOLDER,
  searchQueryDefaultVariables,
  shouldStartSearching,
} from "app/Scenes/Search/Search"
import { SearchContext, useSearchProviderValues } from "app/Scenes/Search/SearchContext"
import { SearchPills } from "app/Scenes/Search/SearchPills"
import { SearchResults } from "app/Scenes/Search/SearchResults"
import { SEARCH_PILLS, SEARCH_THROTTLE_INTERVAL, TOP_PILL } from "app/Scenes/Search/constants"
import { getContextModuleByPillName } from "app/Scenes/Search/helpers"
import { PillType } from "app/Scenes/Search/types"
import { useRefetchWhenQueryChanged } from "app/Scenes/Search/useRefetchWhenQueryChanged"
import { useSearchQuery } from "app/Scenes/Search/useSearchQuery"
import { goBack } from "app/system/navigation/navigate"
import { NoFallback } from "app/utils/hooks/withSuspense"
import { Schema } from "app/utils/track"
import { throttle } from "lodash"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { ScrollView } from "react-native"
import { graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { useThrottle } from "react-use"

export const searchModalQuery = graphql`
  query SearchModalQuery($term: String!, $skipSearchQuery: Boolean!) {
    viewer @skip(if: $skipSearchQuery) {
      ...SearchPills_viewer @arguments(term: $term)
    }
    ...CuratedCollections_collections
    ...TrendingArtists_query
  }
`

const SearchModalContent: React.FC<{ query: string }> = ({ query }) => {
  const didMount = useRef(false)
  const throttledQuery = useThrottle(query, SEARCH_THROTTLE_INTERVAL)
  const {
    data: queryData,
    refetch,
    isLoading,
  } = useSearchQuery<SearchModalQuery>(searchModalQuery, {
    term: throttledQuery,
    skipSearchQuery: false,
  })

  const searchPillsRef = useRef<ScrollView>(null)
  const space = useSpace()
  // const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedPill, setSelectedPill] = useState<PillType>(TOP_PILL)
  const { trackEvent } = useTracking()
  const searchProviderValues = useSearchProviderValues(query)

  useRefetchWhenQueryChanged({ query: throttledQuery.trim(), refetch })

  const handlePillPress = (pill: PillType) => {
    const contextModule = getContextModuleByPillName(selectedPill.displayName)

    setSelectedPill(pill)
    trackEvent(tracks.tappedPill(contextModule, pill.displayName, query))
  }

  const isSelected = (pill: PillType) => {
    return selectedPill.key === pill.key
  }

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    if (query.length === 0) {
      trackEvent({
        action_type: Schema.ActionNames.ARAnalyticsSearchCleared,
      })
      handleResetSearchInput()

      return
    }

    trackEvent({
      action_type: Schema.ActionNames.ARAnalyticsSearchStartedQuery,
      query: query,
    })
  }, [query.trim()])

  const handleResetSearchInput = () => {
    searchPillsRef?.current?.scrollTo({ x: 0, y: 0, animated: true })
    setSelectedPill(TOP_PILL)
  }

  return (
    <SearchContext.Provider value={searchProviderValues}>
      {shouldStartSearching(query) && !!queryData.viewer ? (
        <>
          <Box pb={1}>
            <SearchPills
              viewer={queryData.viewer}
              ref={searchPillsRef}
              pills={SEARCH_PILLS}
              onPillPress={handlePillPress}
              isSelected={isSelected}
              isLoading={isLoading}
            />
          </Box>
          <SearchResults
            selectedPill={selectedPill}
            query={query}
            onRetry={() => {
              refetch({ term: query, skipSearchQuery: false })
            }}
          />
        </>
      ) : (
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: space(2),
          }}
        >
          <RecentSearches />
        </ScrollView>
      )}
    </SearchContext.Provider>
  )
}
export const SearchModalScreen = () => {
  const [query, setQuery] = useState("")

  return (
    <Screen>
      <Flex px={2} pt={2}>
        <RoundSearchInput
          placeholder={SEARCH_INPUT_PLACEHOLDER}
          accessibilityHint="Search artists, artworks, galleries etc."
          accessibilityLabel="Search artists, artworks, galleries etc."
          maxLength={55}
          onChangeText={setQuery}
          numberOfLines={1}
          autoFocus
          multiline={false}
          onLeftIconPress={() => {
            goBack()
          }}
        />
      </Flex>
      <Spacer y={2} />
      <Suspense fallback={NoFallback}>
        <SearchModalContent query={query} />
      </Suspense>
    </Screen>
  )
}

const tracks = {
  tappedPill: (contextModule: ContextModule, subject: string, query: string) => ({
    context_screen_owner_type: OwnerType.search,
    context_screen: Schema.PageNames.Search,
    context_module: contextModule,
    subject,
    query,
    action: ActionType.tappedNavigationTab,
  }),
}
