import { useToast } from "lib/Components/Toast/toastHook"
import { echoLaunchJson } from "lib/utils/jsonFiles"
import { Platform } from "react-native"
import { GlobalStore } from "../GlobalStore"

export interface FeatureDescriptor {
  /**
   * Set readyForRelease to `true` when the feature is ready to be exposed outside of dev mode.
   * If an echo flag key is specified, the echo flag's value will be used after this is set to `true`.
   * If this is set to `false`, the feature will never be shown except if overridden in the admin menu.
   */
  readonly readyForRelease: boolean
  /**
   * Provide an echo feature flag key to allow this feature to be toggled globally via echo.
   * Make sure to add the flag to echo before setting this value. Then run ./scripts/update-echo
   */
  readonly echoFlagKey?: string
  /**
   * Provide a short description for the admin menu
   */
  readonly description?: string
  /**
   * Whether or not to show the feature flag in the admin menu. Consider also providing a description.
   */
  readonly showInAdminMenu?: boolean
}

// Helper function to get good typings and intellisense
function defineFeatures<T extends string>(featureMap: { readonly [featureName in T]: FeatureDescriptor }) {
  return featureMap
}

export type FeatureName = keyof typeof features

export const features = defineFeatures({
  AROptionsBidManagement: {
    readyForRelease: true,
    echoFlagKey: "AROptionsBidManagement",
  },
  AROptionsArtistSeries: {
    readyForRelease: true,
    echoFlagKey: "AROptionsArtistSeries",
  },
  AROptionsNewFirstInquiry: {
    readyForRelease: true,
    echoFlagKey: "AROptionsNewFirstInquiry",
  },
  AROptionsInquiryCheckout: {
    readyForRelease: true,
    echoFlagKey: "AROptionsInquiryCheckout",
    description: "Enable inquiry checkout",
    showInAdminMenu: true,
  },
  AROptionsPriceTransparency: {
    readyForRelease: true,
    echoFlagKey: "AROptionsPriceTransparency",
    description: "Price Transparency",
    showInAdminMenu: true,
  },
  ARDisableReactNativeBidFlow: {
    readyForRelease: true,
    echoFlagKey: "ARDisableReactNativeBidFlow",
  },
  AREnableNewPartnerView: {
    readyForRelease: true,
    echoFlagKey: "AREnableNewPartnerView",
  },
  AROptionsUseReactNativeWebView: {
    readyForRelease: true,
    echoFlagKey: Platform.OS === "ios" ? "AREnableReactNativeWebView" : undefined,
    description: "Use react-native web views",
    showInAdminMenu: Platform.OS !== "android",
  },
  AROptionsLotConditionReport: {
    readyForRelease: true,
    echoFlagKey: "AROptionsLotConditionReport",
  },
  AROptionsNewSalePage: {
    readyForRelease: true,
    echoFlagKey: "AROptionsNewSalePage",
  },
  AREnableViewingRooms: {
    readyForRelease: true,
    echoFlagKey: "AREnableViewingRooms",
  },
  ARHomeAuctionResultsByFollowedArtists: {
    readyForRelease: true,
    echoFlagKey: "ARHomeAuctionResultsByFollowedArtists",
    description: "Enable home auction results",
    showInAdminMenu: true,
  },
  AREnableCustomSharesheet: {
    readyForRelease: true,
    echoFlagKey: "AREnableCustomSharesheet",
    description: "Enable custom share sheet",
    showInAdminMenu: true,
  },
  AREnableOrderHistoryOption: {
    readyForRelease: true,
    echoFlagKey: "AREnableOrderHistoryOption",
    description: "Enable Order History in settings",
    showInAdminMenu: true,
  },
  AREnableNewWorksForYou: {
    readyForRelease: true,
    description: "Enable new 'New Works for You' rail",
    showInAdminMenu: true,
    echoFlagKey: "AREnableNewWorksForYou",
  },
  AREnableNewOnboardingFlow: {
    readyForRelease: true,
    description: "Enable new onboarding flow",
    showInAdminMenu: true,
    echoFlagKey: "AREnableNewOnboardingFlow",
  },
  AREnableSavedAddresses: {
    readyForRelease: false,
    description: "Enable Saved Addresses",
    showInAdminMenu: true,
  },
  AREnableAuctionResultsKeywordFilter: {
    readyForRelease: true,
    description: "Enable auction results keyword filter",
    showInAdminMenu: true,
    echoFlagKey: "AREnableAuctionResultsKeywordFilter",
  },
  AREnableImprovedSearch: {
    readyForRelease: true,
    description: "Enable improved search experience",
    showInAdminMenu: true,
    echoFlagKey: "AREnableImprovedSearch",
  },
  AREnableImprovedSearchPills: {
    readyForRelease: false,
    description: "Enable improved search pills",
    showInAdminMenu: true,
    echoFlagKey: "AREnableImprovedSearchPills",
  },
  AREnableTrove: {
    readyForRelease: true,
    description: "Enable Trove in homepage",
    showInAdminMenu: true,
    echoFlagKey: "AREnableTrove",
  },
  AREnableShowsRail: {
    readyForRelease: true,
    description: "Enable Shows in homepage",
    showInAdminMenu: true,
    echoFlagKey: "AREnableShowsRail",
  },
  AREnableMyCollectionAndroid: {
    readyForRelease: false,
    description: "Enable My Collection (Android)",
    showInAdminMenu: true,
  },
  AREnableMyCollectionIOS: {
    readyForRelease: true,
    description: "Enable My Collection (iOS)",
    showInAdminMenu: true,
    echoFlagKey: "AREnableMyCollectionIOS",
  },
  ARShowNetworkUnavailableModal: {
    readyForRelease: true,
    description: "Enable network unavailable modal",
    showInAdminMenu: true,
    echoFlagKey: "ARShowNetworkUnavailableModal",
  },
  ARGoogleAuth: {
    readyForRelease: false,
    description: "Enable Google authentication",
    showInAdminMenu: true,
    echoFlagKey: "ARGoogleAuth",
  },
  AREnableSavedSearchToggles: {
    readyForRelease: false,
    description: "Enable Saved Search toggles",
    showInAdminMenu: true,
  },
  AREnableWebPImages: {
    readyForRelease: true,
    description: "Enable WebP Images",
    showInAdminMenu: true,
    echoFlagKey: "AREnableWebPImages",
  },
  AREnableSplitIOABTesting: {
    readyForRelease: false,
    description: "Enable Split.io A/B testing",
    showInAdminMenu: true,
  },
  AREnableMyCollectionOrderImport: {
    readyForRelease: false,
    description: "Enable My Collection Order Import",
    showInAdminMenu: true,
    echoFlagKey: "AREnableMyCollectionOrderImport",
  },
  AREnableSortFilterForArtworksPill: {
    readyForRelease: true,
    description: "Enable sort filter for artworks pill",
    showInAdminMenu: true,
    echoFlagKey: "AREnableSortFilterForArtworksPill",
  },
  AREnableVisualProfileIconAndBio: {
    readyForRelease: true,
    description: "Enable Visual Profile Icon and Bio",
    showInAdminMenu: true,
    echoFlagKey: "AREnableVisualProfileIconAndBio",
  },
})

export interface DevToggleDescriptor {
  /**
   * Provide a short description for the admin menu.
   */
  readonly description: string
  /**
   * Provide some action/thunk to run when the toggle value is changed.
   */
  readonly onChange?: (value: boolean, { toast }: { toast: ReturnType<typeof useToast> }) => void
}

// Helper function to get good typings and intellisense
const defineDevToggles = <T extends string>(devToggleMap: { readonly [devToggleName in T]: DevToggleDescriptor }) =>
  devToggleMap

export type DevToggleName = keyof typeof devToggles

export const devToggles = defineDevToggles({
  DTShowQuickAccessInfo: {
    description: "Show quick access info",
  },
  DTDisableEchoRemoteFetch: {
    description: "Disable fetching remote echo",
    onChange: (value, { toast }) => {
      if (value) {
        GlobalStore.actions.config.echo.setEchoState(echoLaunchJson())
        toast.show("Loaded bundled echo config", "middle")
      } else {
        GlobalStore.actions.config.echo.fetchRemoteEcho()
        toast.show("Fetched remote echo config", "middle")
      }
    },
  },
  DTShowAnalyticsVisualiser: {
    description: "Show analytics visualiser",
  },
})

export const isDevToggle = (name: FeatureName | DevToggleName): name is DevToggleName => {
  return Object.keys(devToggles).includes(name)
}

type Assert<T, U extends T> = U
// If you mouse-over the name of the type below, you should be able to see the key that needs renaming!
export type _ThereIsAKeyThatIsCommonInFeaturesAndDevToggles_PleaseRename_MouseOverToSeeTheNaughtyKey = Assert<
  never,
  keyof (typeof features | typeof devToggles)
>
