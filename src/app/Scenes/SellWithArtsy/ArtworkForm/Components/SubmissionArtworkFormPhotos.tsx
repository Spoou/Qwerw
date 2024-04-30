import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtistSearchResult } from "app/Scenes/MyCollection/Screens/ArtworkForm/Components/ArtistSearchResult"
import { ArtworkFormScreen } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { useFormikContext } from "formik"

export const SubmissionArtworkFormPhotos: React.FC<
  StackScreenProps<ArtworkFormScreen, "ArtworkFormTitle">
> = ({}) => {
  const formik = useFormikContext<ArtworkDetailsFormModel>()

  return (
    <Flex>
      {!!formik.values.artistSearchResult && (
        <ArtistSearchResult result={formik.values.artistSearchResult} />
      )}

      <Text>{formik.values.title}</Text>

      <Spacer y={2} />

      <Text variant="lg" mb={2}>
        Upload photos of your artwork
      </Text>
    </Flex>
  )
}
