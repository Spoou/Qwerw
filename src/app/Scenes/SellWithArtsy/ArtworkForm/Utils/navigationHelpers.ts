import { ArtworkFormStore } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/ArtworkFormStore"
import {
  ArtworkFormScreen,
  __unsafe__SubmissionArtworkFormNavigationRef,
  getCurrentRoute,
} from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { createOrUpdateSubmission } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/utils/createOrUpdateSubmission"
import { ArtworkDetailsFormModel } from "app/Scenes/SellWithArtsy/SubmitArtwork/ArtworkDetails/validation"
import { goBack } from "app/system/navigation/navigate"
import { useFormikContext } from "formik"
import { Alert } from "react-native"

export const STEPS: (keyof ArtworkFormScreen)[] = [
  "SubmitArtworkStartFlow",
  "SelectArtworkFromMyCollection",
  "ArtworkFormArtist",
  "ArtworkFormTitle",
  "ArtworkFormPhotos",
  "ArtworkFormArtworkDetails",
  "ArtworkFormCompleteYourSubmission",
]

export const useSubmissionContext = () => {
  const setCurrentStep = ArtworkFormStore.useStoreActions((actions) => actions.setCurrentStep)
  const setIsLoading = ArtworkFormStore.useStoreActions((actions) => actions.setIsLoading)

  const { values } = useFormikContext<ArtworkDetailsFormModel>()

  const navigateToNextStep = async (step?: keyof ArtworkFormScreen) => {
    try {
      setIsLoading(true)
      const currentStepId = getCurrentRoute()
      const nextStepId = step || STEPS[STEPS.indexOf(currentStepId as any) + 1]

      if (!nextStepId) {
        console.error("No next step found")
        return
      }

      if (values.submissionId) {
        await createOrUpdateSubmission(values, values.submissionId)
      }

      setCurrentStep(nextStepId)
      __unsafe__SubmissionArtworkFormNavigationRef.current?.navigate?.(nextStepId)
    } catch (error) {
      console.error("Error navigating to next step", error)
      Alert.alert("Could not navigate to next step")
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToPreviousStep = () => {
    if (getCurrentRoute() === STEPS[0]) {
      return goBack()
    }
    // Order is important here to make sure getCurrentRoute returns the correct value
    __unsafe__SubmissionArtworkFormNavigationRef.current?.goBack?.()
    const previousStepId = getCurrentRoute()

    if (previousStepId) {
      setCurrentStep(previousStepId)
    }
  }

  return {
    navigateToNextStep,
    navigateToPreviousStep,
  }
}

// export function navigateToNextStep() {
//   const currentStepId = getCurrentRoute()
//   const nextStepId = STEPS[STEPS.indexOf(currentStepId as any) + 1]

//   if (!nextStepId) {
//     console.error("No next step found")
//     return
//   }

//   __unsafe__SubmissionArtworkFormNavigationRef.current?.navigate?.(nextStepId)
// }

// export function navigateToPreviousStep() {
//   if (getCurrentRoute() === STEPS[0]) {
//     return goBack()
//   }

//   __unsafe__SubmissionArtworkFormNavigationRef.current?.goBack?.()
// }
