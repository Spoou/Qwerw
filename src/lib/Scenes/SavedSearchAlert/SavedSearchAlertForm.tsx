import { ActionType, DeletedSavedSearch, EditedSavedSearch, OwnerType } from "@artsy/cohesion"
import { FormikProvider, useFormik } from "formik"
import { getSearchCriteriaFromFilters } from "lib/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { getNotificationPermissionsStatus, PushAuthorizationStatus } from "lib/utils/PushNotification"
import React from "react"
import { Alert, AlertButton, Linking, Platform } from "react-native"
import { useTracking } from "react-tracking"
import { Form } from "./Components/Form"
import { extractPills, getNamePlaceholder } from "./helpers"
import { createSavedSearchAlert } from "./mutations/createSavedSearchAlert"
import { deleteSavedSearchMutation } from "./mutations/deleteSavedSearchAlert"
import { updateSavedSearchAlert } from "./mutations/updateSavedSearchAlert"
import { SavedSearchAlertFormPropsBase, SavedSearchAlertFormValues } from "./SavedSearchAlertModel"

export interface SavedSearchAlertFormProps extends SavedSearchAlertFormPropsBase {
  initialValues: {
    name: string
  }
  savedSearchAlertId?: string
  onComplete?: () => void
  onDeleteComplete?: () => void
}

export const SavedSearchAlertForm: React.FC<SavedSearchAlertFormProps> = (props) => {
  const {
    filters,
    aggregations,
    initialValues,
    savedSearchAlertId,
    artistId,
    artistName,
    onComplete,
    onDeleteComplete,
    ...other
  } = props
  const isUpdateForm = !!savedSearchAlertId
  const pills = extractPills(filters, aggregations)
  const tracking = useTracking()
  const formik = useFormik<SavedSearchAlertFormValues>({
    initialValues,
    initialErrors: {},
    onSubmit: async (values) => {
      let alertName = values.name

      if (alertName.length === 0) {
        alertName = getNamePlaceholder(artistName, pills)
      }

      try {
        if (isUpdateForm) {
          await updateSavedSearchAlert(alertName, savedSearchAlertId!)
          tracking.trackEvent(tracks.editedSavedSearch(savedSearchAlertId!, initialValues, values))
        } else {
          const criteria = getSearchCriteriaFromFilters(artistId, filters)
          await createSavedSearchAlert(alertName, criteria)
        }

        onComplete?.()
      } catch (error) {
        console.error(error)
      }
    },
  })

  const requestNotificationPermissions = () => {
    // permissions not determined: Android should never need this
    if (Platform.OS === "ios") {
      Alert.alert(
        "Artsy would like to send you notifications",
        "We need your permission to send notifications on alerts you have created.",
        [
          {
            text: "Proceed",
            onPress: () => LegacyNativeModules.ARTemporaryAPIModule.requestNotificationPermissions(),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      )
    }
  }

  const showHowToEnableNotificationInstructionAlert = () => {
    const deviceText = Platform.select({
      ios: "iOS",
      android: "android",
      default: "device",
    })
    const instruction = Platform.select({
      ios: `Tap 'Artsy' and enable "Allow Notifications" for Artsy.`,
      default: "",
    })

    const buttons: AlertButton[] = [
      {
        text: "Settings",
        onPress: () => {
          if (Platform.OS === "android") {
            Linking.openSettings()
          } else {
            Linking.openURL("App-prefs:NOTIFICATIONS_ID")
          }
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]

    Alert.alert(
      "Artsy would like to send you notifications",
      `To receive notifications for your alerts, you will need to enable them in your ${deviceText} Settings. ${instruction}`,
      Platform.OS === "ios" ? buttons : buttons.reverse()
    )
  }

  const handleSubmit = async () => {
    const notificationStatus = await getNotificationPermissionsStatus()

    if (notificationStatus === PushAuthorizationStatus.Authorized) {
      formik.handleSubmit()
    } else if (notificationStatus === PushAuthorizationStatus.Denied) {
      showHowToEnableNotificationInstructionAlert()
    } else {
      requestNotificationPermissions()
    }
  }

  const onDelete = async () => {
    try {
      await deleteSavedSearchMutation(savedSearchAlertId!)
      tracking.trackEvent(tracks.deletedSavedSearch(savedSearchAlertId!))
      onDeleteComplete?.()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Alert",
      "Once you delete this alert, you will have to recreate it to continue receiving alerts on your favorite artworks.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ]
    )
  }

  return (
    <FormikProvider value={formik}>
      <Form
        pills={pills}
        savedSearchAlertId={savedSearchAlertId}
        artistId={artistId}
        artistName={artistName}
        onDeletePress={handleDeletePress}
        onSubmitPress={handleSubmit}
        {...other}
      />
    </FormikProvider>
  )
}

export const tracks = {
  deletedSavedSearch: (savedSearchAlertId: string): DeletedSavedSearch => ({
    action: ActionType.deletedSavedSearch,
    context_screen_owner_type: OwnerType.savedSearch,
    context_screen_owner_id: savedSearchAlertId,
  }),
  editedSavedSearch: (
    savedSearchAlertId: string,
    currentValues: SavedSearchAlertFormValues,
    modifiesValues: SavedSearchAlertFormValues
  ): EditedSavedSearch => ({
    action: ActionType.editedSavedSearch,
    context_screen_owner_type: OwnerType.savedSearch,
    context_screen_owner_id: savedSearchAlertId,
    current: JSON.stringify(currentValues),
    changed: JSON.stringify(modifiesValues),
  }),
}
