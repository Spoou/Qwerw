import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Screen, Spinner, Text } from "@artsy/palette-mobile"
import { FlashList } from "@shopify/flash-list"
import { HomeViewQuery } from "__generated__/HomeViewQuery.graphql"
import { HomeViewSectionsConnection_viewer$key } from "__generated__/HomeViewSectionsConnection_viewer.graphql"
import { HomeView_me$key } from "__generated__/HomeView_me.graphql"
import { useDismissSavedArtwork } from "app/Components/ProgressiveOnboarding/useDismissSavedArtwork"
import { useEnableProgressiveOnboarding } from "app/Components/ProgressiveOnboarding/useEnableProgressiveOnboarding"
import { HomeHeader } from "app/Scenes/HomeView/Components/HomeHeader"
import { Section } from "app/Scenes/HomeView/Sections/Section"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { useBottomTabsScrollToTop } from "app/utils/bottomTabsHelper"
import { extractNodes } from "app/utils/extractNodes"
import { useMaybePromptForReview } from "app/utils/useMaybePromptForReview"
import { Suspense, useState } from "react"
import { RefreshControl } from "react-native"
import {
  fetchQuery,
  graphql,
  useFragment,
  useLazyLoadQuery,
  usePaginationFragment,
} from "react-relay"

export const NUMBER_OF_SECTIONS_TO_LOAD = 5
// Hard coding the value here because 30px is not a valid value for the spacing unit
// and we need it to be consistent with 60px spacing between sections
export const HOME_VIEW_SECTIONS_SEPARATOR_HEIGHT = "30px"

export const homeViewScreenQueryVariables = () => ({
  count: NUMBER_OF_SECTIONS_TO_LOAD,
})

export const HomeView: React.FC = () => {
  const flashlistRef = useBottomTabsScrollToTop("home")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const queryData = useLazyLoadQuery<HomeViewQuery>(
    homeViewScreenQuery,
    homeViewScreenQueryVariables()
  )

  const { data, loadNext, hasNext } = usePaginationFragment<
    HomeViewQuery,
    HomeViewSectionsConnection_viewer$key
  >(sectionsFragment, queryData.viewer)

  const meData = useFragment<HomeView_me$key>(meFragment, queryData.me)
  const savedArtworksCount = meData?.counts?.savedArtworks ?? 0
  useDismissSavedArtwork(savedArtworksCount > 0)
  useEnableProgressiveOnboarding()
  useMaybePromptForReview({ contextModule: ContextModule.tabBar, contextOwnerType: OwnerType.home })

  const sections = extractNodes(data?.homeView.sectionsConnection)

  const handleRefresh = () => {
    if (isRefreshing) return

    setIsRefreshing(true)

    fetchQuery(getRelayEnvironment(), homeViewScreenQuery, {
      count: NUMBER_OF_SECTIONS_TO_LOAD,
    }).subscribe({
      complete: () => {
        setIsRefreshing(false)
      },
      error: (error: Error) => {
        setIsRefreshing(false)
        console.error(error)
      },
    })
  }

  return (
    <Screen safeArea={false}>
      <Screen.Body fullwidth>
        <FlashList
          ref={flashlistRef}
          data={sections}
          keyExtractor={(item) => `${item.internalID || ""}`}
          renderItem={({ item }) => {
            return <Section section={item} />
          }}
          onEndReached={() => loadNext(NUMBER_OF_SECTIONS_TO_LOAD)}
          ListHeaderComponent={<HomeHeader />}
          estimatedItemSize={500}
          ListFooterComponent={
            hasNext ? (
              <Flex width="100%" justifyContent="center" alignItems="center" height={200}>
                <Spinner />
              </Flex>
            ) : null
          }
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          onEndReachedThreshold={0.5}
        />
      </Screen.Body>
    </Screen>
  )
}

export const HomeViewScreen: React.FC = () => {
  return (
    <Suspense
      fallback={
        <Flex flex={1} justifyContent="center" alignItems="center" testID="new-home-view-skeleton">
          <Text>Loading home view…</Text>
        </Flex>
      }
    >
      <HomeView />
    </Suspense>
  )
}

const meFragment = graphql`
  fragment HomeView_me on Me {
    counts {
      savedArtworks
    }
  }
`

const sectionsFragment = graphql`
  fragment HomeViewSectionsConnection_viewer on Viewer
  @argumentDefinitions(count: { type: "Int" }, cursor: { type: "String" })
  @refetchable(queryName: "HomeView_homeViewRefetch") {
    homeView {
      sectionsConnection(first: $count, after: $cursor)
        @connection(key: "HomeView_sectionsConnection") {
        edges {
          node {
            __typename
            ... on HomeViewSectionGeneric {
              internalID
              component {
                type
              }
              ...HomeViewSectionGeneric_section
            }
          }
        }
      }
    }
  }
`

export const homeViewScreenQuery = graphql`
  query HomeViewQuery($count: Int!, $cursor: String) {
    me {
      ...HomeView_me
    }

    viewer {
      ...HomeViewSectionsConnection_viewer @arguments(count: $count, cursor: $cursor)
    }
  }
`
