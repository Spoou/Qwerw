import { Action, action, thunk, Thunk } from "easy-peasy"
import { AutosuggestResult } from "lib/Scenes/Search/AutosuggestResults"
import { GlobalStoreModel } from "lib/store/GlobalStoreModel"
import { showPhotoActionSheet } from "lib/utils/requestPhotos"
import { uniqBy } from "lodash"

import { Metric } from "../Screens/ArtworkFormModal/Components/Dimensions"

export interface Image {
  height?: number
  isDefault?: boolean
  imageURL?: string
  internalID?: string
  path?: string
  width?: number
  imageVersions?: string[]
}

export interface ArtworkFormValues {
  artist: string
  artistIds: string[]
  artistSearchResult: AutosuggestResult | null
  category: string // this refers to "materials" in UI
  costMinor: string
  costCurrencyCode: string
  date: string
  depth: string
  editionSize: string
  editionNumber: string
  height: string
  isEdition: boolean
  medium: string
  metric: Metric
  photos: Image[]
  provenance: string
  title: string
  width: string
}

export const initialFormValues: ArtworkFormValues = {
  artist: "",
  artistIds: [],
  artistSearchResult: null,
  category: "",
  costMinor: "", // in cents
  costCurrencyCode: "",
  date: "",
  depth: "",
  editionSize: "",
  editionNumber: "",
  height: "",
  isEdition: false,
  medium: "",
  metric: "",
  photos: [],
  provenance: "",
  title: "",
  width: "",
}

export interface MyCollectionArtworkModel {
  sessionState: {
    artworkId: string
    dirtyFormCheckValues: ArtworkFormValues
    formValues: ArtworkFormValues
    lastUploadedPhoto?: Image
    artworkErrorOccurred: boolean
  }
  setFormValues: Action<MyCollectionArtworkModel, ArtworkFormValues>
  setDirtyFormCheckValues: Action<MyCollectionArtworkModel, ArtworkFormValues>
  resetForm: Action<MyCollectionArtworkModel>
  setArtistSearchResult: Action<MyCollectionArtworkModel, AutosuggestResult | null>
  setArtworkId: Action<MyCollectionArtworkModel, { artworkId: string }>
  setArtworkErrorOccurred: Action<MyCollectionArtworkModel, boolean>
  setLastUploadedPhoto: Action<MyCollectionArtworkModel, Image>

  addPhotos: Action<MyCollectionArtworkModel, ArtworkFormValues["photos"]>
  removePhoto: Action<MyCollectionArtworkModel, ArtworkFormValues["photos"][0]>

  startEditingArtwork: Thunk<
    MyCollectionArtworkModel,
    Partial<ArtworkFormValues> & {
      internalID: string
      id: string
      artist: { internalID: string }
      artistNames: string
      images: Image[]
    },
    {},
    GlobalStoreModel
  >

  takeOrPickPhotos: Thunk<MyCollectionArtworkModel, void, any, GlobalStoreModel>
}

export const MyCollectionArtworkModel: MyCollectionArtworkModel = {
  sessionState: {
    // The internalID of the artwork
    artworkId: "",
    dirtyFormCheckValues: initialFormValues,
    formValues: initialFormValues,
    artworkErrorOccurred: false,
  },

  setFormValues: action((state, input) => {
    state.sessionState.formValues = input
  }),

  setDirtyFormCheckValues: action((state, values) => {
    state.sessionState.dirtyFormCheckValues = values
  }),

  resetForm: action((state) => {
    state.sessionState.formValues = initialFormValues
    state.sessionState.dirtyFormCheckValues = initialFormValues
  }),

  setArtworkId: action((state, { artworkId }) => {
    state.sessionState.artworkId = artworkId
  }),

  setArtistSearchResult: action((state, artistSearchResult) => {
    state.sessionState.formValues.artistSearchResult = artistSearchResult

    if (artistSearchResult == null) {
      state.sessionState.formValues.artist = "" // reset search input field
    }
  }),

  setArtworkErrorOccurred: action((state, errorOccurred) => {
    state.sessionState.artworkErrorOccurred = errorOccurred
  }),

  /**
   * Photos
   */

  addPhotos: action((state, photos) => {
    state.sessionState.formValues.photos = uniqBy(
      state.sessionState.formValues.photos.concat(photos),
      (photo) => photo.imageURL || photo.path
    )
  }),

  removePhoto: action((state, photoToRemove) => {
    state.sessionState.formValues.photos = state.sessionState.formValues.photos.filter(
      (photo) => photo.path !== photoToRemove.path || photo.imageURL !== photoToRemove.imageURL
    )
  }),

  setLastUploadedPhoto: action((state, photo) => {
    state.sessionState.lastUploadedPhoto = photo
  }),

  takeOrPickPhotos: thunk((actions, _payload) => {
    showPhotoActionSheet().then((photos) => {
      actions.addPhotos(photos)
    })
  }),

  /**
   * When user clicks the edit artwork button from detail view, we format
   * data the data from the detail into a form the edit form expects.
   */
  startEditingArtwork: thunk((actions, artwork) => {
    actions.setArtworkId({
      artworkId: artwork.internalID,
    })

    const editProps: any /* FIXME: any */ = {
      artistSearchResult: {
        internalID: artwork?.artist?.internalID,
        displayLabel: artwork?.artistNames,
        imageUrl: artwork?.images?.[0]?.imageURL?.replace(":version", "square"),
      },
      category: artwork.category,
      date: artwork.date,
      depth: artwork.depth,
      costMinor: artwork.costMinor,
      costCurrencyCode: artwork.costCurrencyCode,
      editionSize: artwork.editionSize,
      editionNumber: artwork.editionNumber,
      height: artwork.height,
      isEdition: artwork.isEdition,
      medium: artwork.medium,
      metric: artwork.metric,
      photos: artwork.images,
      title: artwork.title,
      width: artwork.width,
      provenance: artwork.provenance,
    }

    actions.setFormValues(editProps)

    // Baseline to check if we can cancel edit without showing
    // iOS action sheet confirmation
    actions.setDirtyFormCheckValues(editProps)
  }),
}
