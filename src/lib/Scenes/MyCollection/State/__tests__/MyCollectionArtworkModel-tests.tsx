import { __appStoreTestUtils__, AppStore } from "lib/store/AppStore"
import { Image } from "react-native-image-crop-picker"

describe("MyCollectionArtworkModel", () => {
  const fakePhoto = (path: string) => {
    const photo: Image = {
      path,
      size: 10,
      data: "photodata",
      height: 10,
      width: 10,
      mime: "jpeg",
      exif: null,
      cropRect: null,
      filename: "somefile",
      creationDate: "somedate",
      modificationDate: "somedate",
      duration: 10,
    }
    return photo
  }

  it("resets form values to initial values", () => {
    __appStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            formValues: {
              artist: "some-artist",
              artistIds: ["some-artist-id-0", "some-artist-id-1"],
              artistSearchResult: null,
              category: "some-category",
              costMinor: "some-cost-minor",
              costCurrencyCode: "some-currency-code",
              date: "some-date",
              depth: "some-depth",
              editionSize: "some-edition-size",
              editionNumber: "some-edition-number",
              height: "some-height",
              medium: "some-medium",
              metric: "in",
              photos: [fakePhoto("somepath")],
              title: "some-title",
              width: "some-width",
            },
          },
        },
      },
    })

    const artworkActions = AppStore.actions.myCollection.artwork
    artworkActions.resetForm()
    const artworkState = __appStoreTestUtils__?.getCurrentState().myCollection.artwork
    const expectedInitialFormValues = {
      artist: "",
      artistIds: [],
      artistSearchResult: null,
      category: "",
      costMinor: "",
      costCurrencyCode: "",
      date: "",
      depth: "",
      editionSize: "",
      editionNumber: "",
      height: "",
      medium: "",
      metric: "",
      photos: [],
      title: "",
      width: "",
    }
    expect(artworkState?.sessionState.formValues).toEqual(expectedInitialFormValues)
  })

  it("adds photos", () => {
    const somePhoto = fakePhoto("somepath")
    const someOtherPhoto = fakePhoto("someOtherPath")

    __appStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            formValues: {
              photos: [somePhoto],
            },
          },
        },
      },
    })

    const artworkActions = AppStore.actions.myCollection.artwork
    artworkActions.addPhotos([someOtherPhoto])
    const artworkState = __appStoreTestUtils__?.getCurrentState().myCollection.artwork
    expect(artworkState?.sessionState.formValues.photos).toEqual([somePhoto, someOtherPhoto])
  })

  it("doesn't add duplicate photos", () => {
    const somePhoto = fakePhoto("somePath")
    __appStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            formValues: {
              photos: [somePhoto],
            },
          },
        },
      },
    })

    const artworkActions = AppStore.actions.myCollection.artwork
    artworkActions.addPhotos([somePhoto])
    const artworkState = __appStoreTestUtils__?.getCurrentState().myCollection.artwork
    expect(artworkState?.sessionState.formValues.photos).toEqual([somePhoto])
  })

  it("removes photos", () => {
    const somePhoto = fakePhoto("somePath")
    const someOtherPhoto = fakePhoto("someOtherPath")
    __appStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            formValues: {
              photos: [somePhoto, someOtherPhoto],
            },
          },
        },
      },
    })
    const artworkActions = AppStore.actions.myCollection.artwork
    artworkActions.removePhoto(someOtherPhoto)
    const artworkState = __appStoreTestUtils__?.getCurrentState().myCollection.artwork
    expect(artworkState?.sessionState.formValues.photos).toEqual([somePhoto])
  })
})
