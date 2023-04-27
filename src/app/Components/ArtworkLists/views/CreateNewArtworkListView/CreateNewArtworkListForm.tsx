import { Button, Spacer } from "@artsy/palette-mobile"
import { useArtworkListsContext } from "app/Components/ArtworkLists/ArtworkListsContext"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { Formik, FormikHelpers } from "formik"
import * as Yup from "yup"

export interface CreateNewArtworkListFormValues {
  name: string
}

const MAX_NAME_LENGTH = 40
const INITIAL_FORM_VALUES: CreateNewArtworkListFormValues = {
  name: "",
}

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").max(MAX_NAME_LENGTH),
})

export const CreateNewArtworkListForm = () => {
  const { dispatch } = useArtworkListsContext()

  const setRecentlyAddedArtworkList = () => {
    dispatch({
      type: "SET_RECENTLY_ADDED_ARTWORK_LIST",
      payload: {
        // TODO: Use real data from mutation
        internalID: "recently-created-artwork-list-id",
        name: "name",
      },
    })
  }

  const closeCurrentView = () => {
    dispatch({
      type: "SET_CREATE_NEW_ARTWORK_LIST_VIEW_VISIBLE",
      payload: false,
    })
  }

  const handleSave = () => {
    // TODO: Run save mutation
    // TODO: Preselect recently create artwork list
    setRecentlyAddedArtworkList()
    closeCurrentView()
  }

  const handleSubmit = (
    values: CreateNewArtworkListFormValues,
    helpers: FormikHelpers<CreateNewArtworkListFormValues>
  ) => {
    console.log("[debug] submitted", values)
  }

  return (
    <Formik
      initialValues={INITIAL_FORM_VALUES}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        console.log("[debug] formik", JSON.stringify(formik, null, 2))

        return (
          <>
            <BottomSheetInput
              placeholder="Name your list"
              value={formik.values.name}
              onChangeText={formik.handleChange("name")}
              error={formik.errors.name}
            />

            <Button
              width="100%"
              block
              disabled={!formik.isValid}
              loading={formik.isSubmitting}
              onPress={formik.handleSubmit}
            >
              Save
            </Button>

            <Spacer y={2} />

            <Button width="100%" block variant="outline" onPress={closeCurrentView}>
              Back
            </Button>
          </>
        )
      }}
    </Formik>
  )
}
