import { useSaveArtworkToArtworkLists_artwork$key } from "__generated__/useSaveArtworkToArtworkLists_artwork.graphql"
import { useArtworkListContext } from "app/Components/ArtworkLists/ArtworkListContext"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { ArtworkEntity, ResultAction } from "app/Components/ArtworkLists/types"
import { useCheckIfArtworkListsEnabled } from "app/Components/ArtworkLists/useCheckIfArtworkListsEnabled"
import { useLegacySaveArtwork } from "app/utils/mutations/useLegacySaveArtwork"
import { SaveArtworkOptions, useSaveArtwork } from "app/utils/mutations/useSaveArtwork"
import { graphql, useFragment } from "react-relay"

interface Options extends Pick<SaveArtworkOptions, "onCompleted" | "onError"> {
  artworkFragmentRef: useSaveArtworkToArtworkLists_artwork$key
}

export const useSaveArtworkToArtworkLists = (options: Options) => {
  const { artworkFragmentRef, onCompleted, ...restOptions } = options
  const isArtworkListsEnabled = useCheckIfArtworkListsEnabled()
  const { onSave, dispatch } = useArtworkListsContext()
  const { artworkListID, removedArtworkIDs } = useArtworkListContext()
  const artwork = useFragment(ArtworkFragment, artworkFragmentRef)

  const customArtworkListsCount = artwork.customArtworkLists?.totalCount ?? 0
  const isSavedToCustomArtworkLists = customArtworkListsCount > 0
  const artworkEntity: ArtworkEntity = {
    id: artwork.id,
    internalID: artwork.internalID,
    title: artwork.title!,
    year: artwork.date,
    artistNames: artwork.artistNames,
    imageURL: artwork.preview?.url ?? null,
  }
  let isSaved = artwork.isSaved

  if (isArtworkListsEnabled) {
    if (artworkListID !== null) {
      const isArtworkRemovedFromArtworkList = removedArtworkIDs.find(
        (artworkID) => artworkID === artwork.internalID
      )

      isSaved = !isArtworkRemovedFromArtworkList
    } else {
      isSaved = artwork.isSaved || isSavedToCustomArtworkLists
    }
  }

  const legacySaveArtworkToDefaultArtworkList = useLegacySaveArtwork({
    ...restOptions,
    id: artwork.id,
    internalID: artwork.internalID,
    isSaved: artwork.isSaved,
    onCompleted,
  })

  const newSaveArtworkToDefaultArtworkList = useSaveArtwork({
    ...restOptions,
    id: artwork.id,
    internalID: artwork.internalID,
    isSaved: artwork.isSaved,
    onCompleted,
    optimisticUpdater: (isArtworkSaved, _store, isCalledBefore) => {
      if (isCalledBefore) {
        return
      }

      if (isArtworkSaved) {
        onSave({
          action: ResultAction.SavedToDefaultArtworkList,
          artwork: artworkEntity,
        })

        return
      }

      onSave({
        action: ResultAction.RemovedFromDefaultArtworkList,
      })
    },
  })

  const openSelectArtworkListsForArtworkView = () => {
    dispatch({
      type: "OPEN_SELECT_ARTWORK_LISTS_VIEW",
      payload: {
        artwork: artworkEntity,
        artworkListID,
      },
    })
  }

  const saveArtworkToLists = () => {
    if (!isArtworkListsEnabled) {
      legacySaveArtworkToDefaultArtworkList()
      return
    }

    if (artworkListID || isSavedToCustomArtworkLists) {
      openSelectArtworkListsForArtworkView()
      return
    }

    newSaveArtworkToDefaultArtworkList()
  }

  return {
    isSaved,
    saveArtworkToLists,
  }
}

const ArtworkFragment = graphql`
  fragment useSaveArtworkToArtworkLists_artwork on Artwork {
    id
    internalID
    isSaved
    slug
    title
    date
    artistNames
    preview: image {
      url(version: "square")
    }
    customArtworkLists: collectionsConnection(first: 0, default: false, saves: true) {
      totalCount
    }
  }
`
