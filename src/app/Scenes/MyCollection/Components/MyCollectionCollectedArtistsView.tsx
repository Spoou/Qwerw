import { Flex, Spacer, Spinner, useSpace } from "@artsy/palette-mobile"
import { MyCollectionCollectedArtistsView_me$key } from "__generated__/MyCollectionCollectedArtistsView_me.graphql"
import { StickTabPageRefreshControl } from "app/Components/StickyTabPage/StickTabPageRefreshControl"
import { MyCollectionCollectedArtistItem } from "app/Scenes/MyCollection/Components/MyCollectionCollectedArtistItem"
import { ViewAsIcons } from "app/Scenes/MyCollection/Components/MyCollectionSearchBar"
import { ViewOption } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { useState } from "react"
import { FlatList, LayoutAnimation } from "react-native"
import { graphql, usePaginationFragment } from "react-relay"

interface MyCollectionCollectedArtistsViewProps {
  me: MyCollectionCollectedArtistsView_me$key
}

export const MyCollectionCollectedArtistsView: React.FC<MyCollectionCollectedArtistsViewProps> = ({
  me,
}) => {
  const [refreshing, setRefreshing] = useState(false)
  const space = useSpace()
  const viewOption = GlobalStore.useAppState((state) => state.userPrefs.artworkViewOption)

  const { data, hasNext, loadNext, isLoadingNext, refetch } = usePaginationFragment(
    collectedArtistsPaginationFragment,
    me
  )

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(10)
  }

  const onViewOptionChange = (selectedViewOption: ViewOption) => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 100,
    })

    GlobalStore.actions.userPrefs.setArtistViewOption(selectedViewOption)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    refetch(
      {},
      {
        fetchPolicy: "store-and-network",
        onComplete: () => {
          setRefreshing(false)
        },
      }
    )
  }

  const collectedArtists = extractNodes(data.myCollectionInfo?.collectedArtistsConnection)

  if (!collectedArtists.length) {
    return null
  }

  const artistsAndArtworksCount = data.myCollectionInfo?.collectedArtistsConnection?.edges
    ?.filter((edge) => edge !== null && edge.node !== null)
    .map((edge) => {
      return {
        artist: edge?.node,
        artworksCount: edge?.artworksCount || null,
      }
    })

  return (
    <FlatList
      data={artistsAndArtworksCount}
      renderItem={({ item }) => {
        return (
          <MyCollectionCollectedArtistItem
            artworksCount={item.artworksCount}
            // casting this type because typescript was not able to infer it correctly
            artist={item.artist!}
            // casting this type because typescript was not able to infer it correctly
            key={item.artist!.internalID}
            compact
          />
        )
      }}
      onEndReached={handleLoadMore}
      ListFooterComponent={!!hasNext ? <LoadingIndicator /> : <Spacer y={2} />}
      ListHeaderComponent={() => (
        <Flex alignItems="flex-end" px={2}>
          <ViewAsIcons onViewOptionChange={onViewOptionChange} viewOption={viewOption} />
        </Flex>
      )}
      style={{ paddingVertical: space(2) }}
      ItemSeparatorComponent={() => <Spacer y={2} />}
      refreshControl={
        !__TEST__ ? (
          <StickTabPageRefreshControl onRefresh={handleRefresh} refreshing={refreshing} />
        ) : undefined
      }
    />
  )
}

const LoadingIndicator = () => {
  return (
    <Flex alignItems="center" justifyContent="center" py={4}>
      <Spinner />
    </Flex>
  )
}

const collectedArtistsPaginationFragment = graphql`
  fragment MyCollectionCollectedArtistsView_me on Me
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" })
  @refetchable(queryName: "MyCollectionCollectedArtistsView_myCollectionInfoRefetch") {
    myCollectionInfo {
      collectedArtistsConnection(
        first: $count
        after: $after
        sort: TRENDING_DESC
        includePersonalArtists: true
      ) @connection(key: "MyCollectionCollectedArtistsView_collectedArtistsConnection") {
        edges {
          artworksCount
          node {
            internalID
            ...MyCollectionCollectedArtistItem_artist
          }
        }
      }
    }
  }
`
