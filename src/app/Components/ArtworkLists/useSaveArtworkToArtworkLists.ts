import { useSaveArtworkToArtworkLists_artwork$key } from "__generated__/useSaveArtworkToArtworkLists_artwork.graphql"
import {
  ResultAction,
  useArtworkListsContext,
} from "app/Components/ArtworkLists/ArtworkListsContext"
import { useSaveArtwork } from "app/utils/mutations/useSaveArtwork"
import { graphql, useFragment } from "react-relay"

export const useSaveArtworkToArtworkLists = (
  artworkFragmentRef: useSaveArtworkToArtworkLists_artwork$key
) => {
  const { artworkListId, isSavedToArtworkList, onSave, dispatch } = useArtworkListsContext()
  const artwork = useFragment(ArtworkFragment, artworkFragmentRef)

  const customArtworkListsCount = artwork.customArtworkLists?.totalCount ?? 0
  const isSavedToCustomArtworkLists = customArtworkListsCount > 0
  let isSaved = artwork.isSaved ?? isSavedToCustomArtworkLists

  // TODO: Add comment about this
  if (typeof artworkListId !== "undefined") {
    isSaved = isSavedToArtworkList
  }

  const saveArtworkToDefaultArtworkList = useSaveArtwork({
    id: artwork.id,
    internalID: artwork.internalID,
    isSaved: artwork.isSaved,
    onCompleted: () => {
      // TODO: Track event

      const action = artwork.isSaved
        ? ResultAction.RemovedFromDefaultArtworkList
        : ResultAction.SavedToDefaultArtworkList

      onSave({
        action,
      })
    },
  })

  const openSelectListsForArtworkScene = () => {
    dispatch({
      type: "SET_ARTWORK",
      payload: {
        id: artwork.id,
        internalID: artwork.internalID,
        title: artwork.title!,
        year: artwork.date,
        artistNames: artwork.artistNames,
        imageURL: artwork.preview?.url ?? null,
      },
    })
  }

  const saveArtworkToLists = () => {
    if (artworkListId || isSavedToCustomArtworkLists) {
      console.log("[debug] step 1")
      openSelectListsForArtworkScene()
      return
    }

    console.log("[debug] step 2")
    saveArtworkToDefaultArtworkList()
  }

  console.log("[debug] isSaved", isSaved)

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
