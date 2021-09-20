import { ActionType, OwnerType, ToggledSavedSearch } from "@artsy/cohesion"
import { captureMessage } from "@sentry/react-native"
import { SavedSearchBanner_me } from "__generated__/SavedSearchBanner_me.graphql"
import { SavedSearchBannerCreateSavedSearchMutation } from "__generated__/SavedSearchBannerCreateSavedSearchMutation.graphql"
import { SavedSearchBannerDisableSavedSearchMutation } from "__generated__/SavedSearchBannerDisableSavedSearchMutation.graphql"
import { SavedSearchBannerQuery } from "__generated__/SavedSearchBannerQuery.graphql"
import { FilterParams } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { prepareFilterParamsForSaveSearchInput } from "lib/Components/ArtworkFilter/SavedSearch/searchCriteriaHelpers"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { usePopoverMessage } from "lib/Components/PopoverMessage/popoverMessageHooks"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PushAuthorizationStatus } from "lib/utils/PushNotification"
import { BellIcon, Button } from "palette"
import React, { useState } from "react"
import { Alert, AlertButton, Linking, Platform } from "react-native"
import PushNotification from "react-native-push-notification"
import { commitMutation, createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { useTracking } from "react-tracking"

interface SavedSearchBannerProps {
  me?: SavedSearchBanner_me | null
  artistId: string
  artistSlug: string
  attributes: SearchCriteriaAttributes
  loading?: boolean
  relay: RelayRefetchProp
  disabled?: boolean
}

export const SavedSearchBanner: React.FC<SavedSearchBannerProps> = ({
  me,
  artistId,
  artistSlug,
  attributes,
  loading,
  disabled,
  relay,
}) => {
  const [saving, setSaving] = useState(false)
  const popoverMessage = usePopoverMessage()
  const enabled = !!me?.savedSearch?.internalID
  const inProcess = loading || saving
  const tracking = useTracking()

  // doing refetch as opposed to updating `enabled` in state with savedSearch internalID
  // because change in applied filters will update the `me` prop in the QueryRenderer
  const doRefetch = () => {
    relay.refetch(
      { criteria: attributes },
      null,
      () => {
        setSaving(false)
      },
      { force: true }
    )
  }

  const showErrorPopover = () => {
    popoverMessage.show({
      title: "Sorry, an error occured.",
      message: "Please try again.",
      type: "error",
    })
  }

  const createSavedSearch = () => {
    setSaving(true)
    commitMutation<SavedSearchBannerCreateSavedSearchMutation>(relay.environment, {
      mutation: graphql`
        mutation SavedSearchBannerCreateSavedSearchMutation($input: CreateSavedSearchInput!) {
          createSavedSearch(input: $input) {
            savedSearchOrErrors {
              ... on SearchCriteria {
                internalID
              }
            }
          }
        }
      `,
      variables: {
        input: {
          attributes,
        },
      },
      onCompleted: (response) => {
        doRefetch()
        popoverMessage.show({
          title: "Your alert has been set.",
          message: "We will send you a push notification once new works are added.",
        })
        trackToggledSavedSearchEvent(true, response.createSavedSearch?.savedSearchOrErrors.internalID)
      },
      onError: () => {
        setSaving(false)
        showErrorPopover()
      },
    })
  }

  const disableSavedSearch = () => {
    setSaving(true)
    commitMutation<SavedSearchBannerDisableSavedSearchMutation>(relay.environment, {
      mutation: graphql`
        mutation SavedSearchBannerDisableSavedSearchMutation($input: DisableSavedSearchInput!) {
          disableSavedSearch(input: $input) {
            savedSearchOrErrors {
              ... on SearchCriteria {
                internalID
              }
            }
          }
        }
      `,
      variables: {
        input: {
          searchCriteriaID: me!.savedSearch!.internalID,
        },
      },
      onCompleted: (response) => {
        doRefetch()
        popoverMessage.show({
          title: "Your alert has been removed.",
          message: "Don't worry, you can always create a new one.",
        })
        trackToggledSavedSearchEvent(false, response.disableSavedSearch?.savedSearchOrErrors.internalID)
      },
      onError: () => {
        setSaving(false)
        showErrorPopover()
      },
    })
  }

  const showAlert = (permissionsDenied: boolean) => {
    if (permissionsDenied) {
      const buttons: AlertButton[] = [
        {
          text: "Settings",
          onPress: () =>
            Platform.OS === "android" ? Linking.openSettings() : Linking.openURL("App-prefs:NOTIFICATIONS_ID"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
      Alert.alert(
        "Artsy would like to send you notifications",
        `To receive notifications for your alerts, you will need to enable them in your ${Platform.select({
          ios: "iOS",
          android: "android",
          default: "device",
        })} Settings. ${Platform.select({
          ios: `Tap 'Artsy' and enable "Allow Notifications" for Artsy.`,
          default: "",
        })} `,
        Platform.OS === "ios" ? buttons : buttons.reverse()
      )
    } else {
      // permissions not determined: Android should never need this
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

  const checkNotificationPermissionsAndCreate = () => {
    if (Platform.OS === "android") {
      PushNotification.checkPermissions((permissions) => {
        if (!permissions.alert) {
          return showAlert(true)
        }
        createSavedSearch()
        return
      })
    }
    LegacyNativeModules.ARTemporaryAPIModule.fetchNotificationPermissions((_, result: PushAuthorizationStatus) => {
      switch (result) {
        case PushAuthorizationStatus.Authorized:
          return createSavedSearch()
        case PushAuthorizationStatus.Denied:
          return showAlert(true)
        case PushAuthorizationStatus.NotDetermined:
          return showAlert(false)
        default:
          return
      }
    })
  }

  const handleSaveSearchFiltersPress = () => {
    if (inProcess) {
      return
    }

    if (enabled) {
      disableSavedSearch()
    } else {
      checkNotificationPermissionsAndCreate()
    }
  }

  const trackToggledSavedSearchEvent = (modified: boolean, searchCriteriaId: string | undefined) => {
    if (searchCriteriaId) {
      tracking.trackEvent(tracks.toggleSavedSearch(modified, artistId, artistSlug, searchCriteriaId))
    }
  }

  return (
    <Button
      variant={enabled ? "secondaryOutline" : "primaryBlack"}
      disabled={disabled}
      onPress={handleSaveSearchFiltersPress}
      icon={<BellIcon fill={enabled ? "black100" : "white100"} mr={0.5} width="16px" height="16px" />}
      size="small"
      loading={inProcess}
      longestText="Remove Alert"
      haptic
      testID="create-saved-search-banner"
    >
      {enabled ? "Remove Alert" : "Create Alert"}
    </Button>
  )
}

export const SavedSearchBannerRefetchContainer = createRefetchContainer(
  SavedSearchBanner,
  {
    me: graphql`
      fragment SavedSearchBanner_me on Me @argumentDefinitions(criteria: { type: "SearchCriteriaAttributes" }) {
        savedSearch(criteria: $criteria) {
          internalID
        }
      }
    `,
  },
  graphql`
    query SavedSearchBannerRefetchQuery($criteria: SearchCriteriaAttributes) {
      me {
        ...SavedSearchBanner_me @arguments(criteria: $criteria)
      }
    }
  `
)

export const SavedSearchBannerQueryRender: React.FC<{
  filters: FilterParams
  artistId: string
  artistSlug: string
}> = ({ filters, artistId, artistSlug }) => {
  const input = prepareFilterParamsForSaveSearchInput(filters)
  const attributes: SearchCriteriaAttributes = {
    artistID: artistId,
    ...input,
  }

  return (
    <QueryRenderer<SavedSearchBannerQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SavedSearchBannerQuery($criteria: SearchCriteriaAttributes!) {
          me {
            ...SavedSearchBanner_me @arguments(criteria: $criteria)
          }
        }
      `}
      render={({ props, error }) => {
        if (error) {
          if (__DEV__) {
            console.error(error)
          } else {
            captureMessage(error.stack!)
          }
        }

        return (
          <SavedSearchBannerRefetchContainer
            me={props?.me ?? null}
            loading={props === null && error === null}
            attributes={attributes}
            artistId={artistId}
            artistSlug={artistSlug}
          />
        )
      }}
      variables={{
        criteria: attributes,
      }}
    />
  )
}

export const tracks = {
  toggleSavedSearch: (
    enabled: boolean,
    artistId: string,
    artistSlug: string,
    searchCriteriaId: string
  ): ToggledSavedSearch => ({
    action: ActionType.toggledSavedSearch,
    context_screen_owner_type: OwnerType.artist,
    context_screen_owner_id: artistId,
    context_screen_owner_slug: artistSlug,
    modified: enabled,
    original: !enabled,
    search_criteria_id: searchCriteriaId,
  }),
}
