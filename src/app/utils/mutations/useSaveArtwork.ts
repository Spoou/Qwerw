import { useSaveArtworkMutation } from "__generated__/useSaveArtworkMutation.graphql"
import { useRef } from "react"
import { useMutation } from "react-relay"
import { Disposable, RecordSourceSelectorProxy, graphql } from "relay-runtime"

export interface SaveArtworkOptions {
  id: string
  internalID: string
  isSaved: boolean | null
  onCompleted?: (isSaved: boolean) => void
  onError?: (error: Error) => void
  optimisticUpdater?: (
    isSaved: boolean,
    store: RecordSourceSelectorProxy,
    isCalledBefore: boolean
  ) => void
}

export const useSaveArtwork = ({
  id,
  internalID,
  isSaved,
  onCompleted,
  onError,
  optimisticUpdater,
}: SaveArtworkOptions) => {
  const [commit] = useMutation<useSaveArtworkMutation>(Mutation)
  const prevCommit = useRef<Disposable | null>(null)
  const nextSavedState = !isSaved

  const clearPrevCommit = () => {
    prevCommit.current = null
  }

  return () => {
    let optimisticUpdaterCalledBefore = false

    if (prevCommit.current !== null) {
      prevCommit.current.dispose()
    }

    prevCommit.current = commit({
      variables: {
        artworkID: internalID,
        remove: isSaved,
      },
      onCompleted: () => {
        clearPrevCommit()
        onCompleted?.(nextSavedState)
      },
      onError: (error) => {
        clearPrevCommit()
        onError?.(error)
      },
      optimisticUpdater: (store) => {
        const artwork = store.get(id)
        artwork?.setValue(nextSavedState, "isSaved")

        optimisticUpdater?.(nextSavedState, store, optimisticUpdaterCalledBefore)
        optimisticUpdaterCalledBefore = true
      },
    })
  }
}

const Mutation = graphql`
  mutation useSaveArtworkMutation($artworkID: String!, $remove: Boolean) {
    saveArtwork(input: { artworkID: $artworkID, remove: $remove }) {
      artwork {
        id
        isSaved
      }

      me {
        collection(id: "saved-artwork") {
          internalID
          isSavedArtwork(artworkID: $artworkID)
          ...ArtworkListItem_collection
        }
      }
    }
  }
`
