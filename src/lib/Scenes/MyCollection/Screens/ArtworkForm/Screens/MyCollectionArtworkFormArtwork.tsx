import { StackScreenProps } from "@react-navigation/stack"
import {
  MyCollectionArtworkFormArtworkQuery,
  MyCollectionArtworkFormArtworkQueryResponse,
} from "__generated__/MyCollectionArtworkFormArtworkQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import LoadingModal from "lib/Components/Modals/LoadingModal"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { GlobalStore } from "lib/store/GlobalStore"
import { omit, pickBy } from "lodash"
import { Spacer } from "palette"
import React, { useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { fetchQuery, graphql } from "relay-runtime"
import { ScreenMargin } from "../../../Components/ScreenMargin"
import { ArtistSearchResult } from "../Components/ArtistSearchResult"
import { ArtworkAutosuggest } from "../Components/ArtworkAutosuggest"
import { useArtworkForm } from "../Form/useArtworkForm"
import { ArtworkFormScreen } from "../MyCollectionArtworkForm"

export const MyCollectionArtworkFormArtwork: React.FC<StackScreenProps<ArtworkFormScreen, "ArtworkFormArtwork">> = ({
  route,
  navigation,
}) => {
  const [loading, setLoading] = useState(false)

  const { formik } = useArtworkForm()

  useEffect(() => {
    // Navigate back to the artist search screen if no artist is selected.
    if (!formik.values.artistSearchResult) {
      navigation.navigate("ArtworkFormArtist", { ...route.params })
    }
  }, [formik.values.artistSearchResult])

  const updateFormValues = async (artworkId: string) => {
    setLoading(true)

    try {
      const artworkData = await fetchArtwork(artworkId)

      if (!artworkData) {
        return
      }

      const filteredFormValues = omit(
        pickBy(artworkData, (value) => value !== null),
        ["images"]
      )

      // By setting the path for each image we make sure the image will be uploaded to S3
      // and processed by Gemini.
      const photos = artworkData.images?.map((image) => ({
        height: image?.height || undefined,
        isDefault: image?.isDefault || undefined,
        imageURL: image?.imageURL || undefined,
        path: image?.imageURL?.replace(":version", "large") || undefined,
        width: image?.width || undefined,
      }))

      GlobalStore.actions.myCollection.artwork.updateFormValues({ ...filteredFormValues, photos })
    } catch (error) {
      console.error("Couldn't load artwork data", error)
    } finally {
      requestAnimationFrame(() => {
        setLoading(false)
        navigateToNext()
      })
    }
  }

  const navigateToNext = () => navigation.navigate("ArtworkFormMain", { ...route.params })

  const skip = () => {
    setLoading(true)
    GlobalStore.actions.myCollection.artwork.ResetFormButKeepArtist()
    // setTimeout because we must wait for all actions to resolve before loading the next set of forms
    setTimeout(() => {
      setLoading(false)
      navigateToNext()
    }, 1500)
  }

  return (
    <>
      <FancyModalHeader
        onLeftButtonPress={route.params.onHeaderBackButtonPress}
        rightButtonText="Skip"
        onRightButtonPress={skip}
        hideBottomDivider
      >
        Select an Artwork
      </FancyModalHeader>
      <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <ScreenMargin>
          {!!formik.values.artistSearchResult && <ArtistSearchResult result={formik.values.artistSearchResult} />}
          <Spacer mb={2} />
          <ArtworkAutosuggest onResultPress={updateFormValues} onSkipPress={skip} />
        </ScreenMargin>
      </ScrollView>
      <LoadingModal isVisible={loading} />
    </>
  )
}

const fetchArtwork = async (artworkID: string): Promise<MyCollectionArtworkFormArtworkQueryResponse["artwork"]> => {
  const result = await fetchQuery<MyCollectionArtworkFormArtworkQuery>(
    defaultEnvironment,
    graphql`
      query MyCollectionArtworkFormArtworkQuery($artworkID: String!) {
        artwork(id: $artworkID) {
          medium: category
          date
          depth
          editionSize
          editionNumber
          height
          images {
            height
            isDefault
            imageURL
            width
          }
          isEdition
          category: medium
          metric
          title
          width
        }
      }
    `,
    { artworkID }
  )

  return result.artwork
}
