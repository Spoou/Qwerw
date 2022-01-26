import { captureMessage } from "@sentry/react-native"
import { Formik } from "formik"
import { GlobalStore } from "lib/store/GlobalStore"
import { CTAButton, Flex, Spacer, Text } from "palette"
import React, { useState } from "react"
import { ScrollView } from "react-native"
import { createOrUpdateConsignSubmission } from "../utils/createOrUpdateConsignSubmission"
// import { getArtworkDetailsInitialValues } from "../utils/getArtworkDetailsInitialValues"
import { ArtworkDetailsFormModel, artworkDetailsValidationSchema } from "../utils/validation"
import { ArtworkDetailsForm } from "./ArtworkDetailsForm"
import { ErrorView } from "./Components/ErrorView"

export const ArtworkDetails: React.FC<{ handlePress: () => void }> = ({ handlePress }) => {
  const { submissionId, artworkDetails } = GlobalStore.useAppState(
    (state) => state.artworkSubmission.submission
  )
  const [submissionError, setSubmissionError] = useState(false)

  const handleArtworkDetailsSubmit = async (values: ArtworkDetailsFormModel) => {
    try {
      const id = await createOrUpdateConsignSubmission(values, submissionId || undefined)
      if (id) {
        GlobalStore.actions.artworkSubmission.submission.setSubmissionId(id)
        GlobalStore.actions.artworkSubmission.submission.setArtworkDetailsForm(values)
        handlePress()
      }
    } catch (error) {
      captureMessage(JSON.stringify(error))
      setSubmissionError(true)
    }
  }

  if (submissionError) {
    return <ErrorView />
  }

  return (
    <Formik<ArtworkDetailsFormModel>
      initialValues={artworkDetails}
      onSubmit={handleArtworkDetailsSubmit}
      validationSchema={artworkDetailsValidationSchema}
      validateOnMount
    >
      {({ values, isValid }) => (
        <ScrollView>
          <Flex flexDirection="column" p={1} mt={1}>
            <Text variant="sm" color="black60">
              • All fields are required to submit an artwork.
            </Text>
            <Text variant="sm" color="black60">
              • Unfortunately, we do not allow&nbsp;
              <Text style={{ textDecorationLine: "underline" }}>
                artists to sell their own work
              </Text>{" "}
              on Artsy.
            </Text>
            <Spacer mt={4} />
            <ArtworkDetailsForm />
            <Spacer mt={3} />
            <CTAButton
              disabled={!isValid}
              onPress={() => handleArtworkDetailsSubmit(values)}
              testID="Submission_ArtworkDetails_Button"
            >
              Save & Continue
            </CTAButton>
          </Flex>
        </ScrollView>
      )}
    </Formik>
  )
}
