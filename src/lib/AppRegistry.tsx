import React, { useEffect } from "react"
import { Appearance, AppRegistry, LogBox, Platform, View } from "react-native"

import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import { BidFlow } from "./Containers/BidFlow"
import { InboxWrapper } from "./Containers/Inbox"
import { InquiryQueryRenderer } from "./Containers/Inquiry"
import { WorksForYouQueryRenderer } from "./Containers/WorksForYou"
import { About } from "./Scenes/About/About"
import { ArtistQueryRenderer } from "./Scenes/Artist/Artist"
import { ArtistSeriesQueryRenderer } from "./Scenes/ArtistSeries/ArtistSeries"
import { ArtistSeriesFullArtistSeriesListQueryRenderer } from "./Scenes/ArtistSeries/ArtistSeriesFullArtistSeriesList"
import { ArtistShows2QueryRenderer } from "./Scenes/ArtistShows/ArtistShows2"
import { ArtworkQueryRenderer } from "./Scenes/Artwork/Artwork"
import { ArtworkAttributionClassFAQQueryRenderer } from "./Scenes/ArtworkAttributionClassFAQ"
import { ArtworkMediumQueryRenderer } from "./Scenes/ArtworkMedium"
import { CityView } from "./Scenes/City"
import { CityBMWListQueryRenderer } from "./Scenes/City/CityBMWList"
import { CityFairListQueryRenderer } from "./Scenes/City/CityFairList"
import { CityPicker } from "./Scenes/City/CityPicker"
import { CitySavedListQueryRenderer } from "./Scenes/City/CitySavedList"
import { CitySectionListQueryRenderer } from "./Scenes/City/CitySectionList"
import { CollectionQueryRenderer } from "./Scenes/Collection/Collection"
import { CollectionFullFeaturedArtistListQueryRenderer } from "./Scenes/Collection/Components/FullFeaturedArtistList"
import { GeneQueryRenderer } from "./Scenes/Gene/Gene"
import { ConversationNavigator } from "./Scenes/Inbox/ConversationNavigator"
import { EditSavedSearchAlertQueryRenderer } from "./Scenes/SavedSearchAlert/EditSavedSearchAlert"

// Consignments / My Collection
import { Consignments } from "./Scenes/Consignments"
import { ConsignmentsSubmissionForm } from "./Scenes/Consignments/ConsignmentsHome/ConsignmentsSubmissionForm"

import { FadeIn } from "./Components/FadeIn"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { NativeViewController } from "./Components/NativeViewController"
import { BottomTabs } from "./Scenes/BottomTabs/BottomTabs"
import { FairQueryRenderer } from "./Scenes/Fair/Fair"
import { FairAllFollowedArtistsQueryRenderer } from "./Scenes/Fair/FairAllFollowedArtists"
import { FairArticlesQueryRenderer } from "./Scenes/Fair/FairArticles"
import { FairBMWArtActivationQueryRenderer } from "./Scenes/Fair/FairBMWArtActivation"
import { FairMoreInfoQueryRenderer } from "./Scenes/Fair/FairMoreInfo"
import { Favorites } from "./Scenes/Favorites/Favorites"
import { FeatureQueryRenderer } from "./Scenes/Feature/Feature"
import { HomeQueryRenderer } from "./Scenes/Home/Home"
import { MakeOfferModalQueryRenderer } from "./Scenes/Inbox/Components/Conversations/MakeOfferModal"
import { Checkout } from "./Scenes/Inbox/Screens/Checkout"
import { MapContainer } from "./Scenes/Map"
import { MyAccountQueryRenderer } from "./Scenes/MyAccount/MyAccount"
import { MyAccountEditEmailQueryRenderer } from "./Scenes/MyAccount/MyAccountEditEmail"
import { MyAccountEditNameQueryRenderer } from "./Scenes/MyAccount/MyAccountEditName"
import { MyAccountEditPassword } from "./Scenes/MyAccount/MyAccountEditPassword"
import { MyAccountEditPhoneQueryRenderer } from "./Scenes/MyAccount/MyAccountEditPhone"
import { MyBidsQueryRenderer } from "./Scenes/MyBids"
import { MyProfileQueryRenderer } from "./Scenes/MyProfile/MyProfile"
import { MyProfilePaymentQueryRenderer } from "./Scenes/MyProfile/MyProfilePayment"
import { MyProfilePaymentNewCreditCard } from "./Scenes/MyProfile/MyProfilePaymentNewCreditCard"
import { MyProfilePushNotificationsQueryRenderer } from "./Scenes/MyProfile/MyProfilePushNotifications"
import { OrderDetailsQueryRender } from "./Scenes/OrderHistory/OrderDetails/Components/OrderDetails"
import { OrderHistoryQueryRender } from "./Scenes/OrderHistory/OrderHistory"
import { PartnerQueryRenderer } from "./Scenes/Partner"
import { PartnerLocationsQueryRenderer } from "./Scenes/Partner/Screens/PartnerLocations"
import { PrivacyRequest } from "./Scenes/PrivacyRequest"
import { SaleQueryRenderer } from "./Scenes/Sale"
import { SaleFAQ } from "./Scenes/SaleFAQ/SaleFAQ"
import { SaleInfoQueryRenderer } from "./Scenes/SaleInfo"
import { SavedAddressesQueryRenderer } from "./Scenes/SavedAddresses/SavedAddresses"
import { SavedAddressesFormQueryRenderer } from "./Scenes/SavedAddresses/SavedAddressesForm"

import { SalesQueryRenderer } from "./Scenes/Sales"
import { Search } from "./Scenes/Search"
import { ShowMoreInfoQueryRenderer, ShowQueryRenderer } from "./Scenes/Show"
import { VanityURLEntityRenderer } from "./Scenes/VanityURL/VanityURLEntity"

import { GoogleSignin } from "@react-native-google-signin/google-signin"
import StorybookUI from "../storybook/storybook-ui"
import { AppProviders } from "./AppProviders"
import { ArtsyKeyboardAvoidingViewContext } from "./Components/ArtsyKeyboardAvoidingView"
import { ArtsyReactWebViewPage, useWebViewCookies } from "./Components/ArtsyReactWebView"
import { RegistrationFlow } from "./Containers/RegistrationFlow"
import { useSentryConfig } from "./ErrorReporting"
import { ArticlesQueryRenderer } from "./Scenes/Articles/Articles"
import { AuctionResultQueryRenderer } from "./Scenes/AuctionResult/AuctionResult"
import { AuctionResultsForYouQueryRenderer } from "./Scenes/AuctionResultsForYou/AuctionResultsForYou"
import { BottomTabsNavigator } from "./Scenes/BottomTabs/BottomTabsNavigator"
import { BottomTabOption, BottomTabType } from "./Scenes/BottomTabs/BottomTabType"
import { ForceUpdate } from "./Scenes/ForceUpdate/ForceUpdate"
import { LotsByArtistsYouFollowQueryRenderer } from "./Scenes/LotsByArtistsYouFollow/LotsByArtistsYouFollow"
import { MyCollectionQueryRenderer } from "./Scenes/MyCollection/MyCollection"
import { MyCollectionArtworkQueryRenderer } from "./Scenes/MyCollection/Screens/Artwork/MyCollectionArtwork"
import { MyCollectionArtworkFullDetailsQueryRenderer } from "./Scenes/MyCollection/Screens/ArtworkFullDetails/MyCollectionArtworkFullDetails"
import { MyCollectionArtworkImagesQueryRenderer } from "./Scenes/MyCollection/Screens/ArtworkImages/MyCollectionArtworkImages"
import { Onboarding } from "./Scenes/Onboarding/Onboarding"
import { SavedSearchAlertsListQueryRenderer } from "./Scenes/SavedSearchAlertsList/SavedSearchAlertsList"
import { TagQueryRenderer } from "./Scenes/Tag/Tag"
import { ViewingRoomQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoom"
import { ViewingRoomArtworkQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoomArtwork"
import { ViewingRoomArtworksQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoomArtworks"
import { ViewingRoomsListQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoomsList"
import { GlobalStore, useFeatureFlag, useSelectedTab } from "./store/GlobalStore"
import { AdminMenu } from "./utils/AdminMenu"
import { addTrackingProvider, Schema, screenTrack, track } from "./utils/track"
import { ConsoleTrackingProvider } from "./utils/track/ConsoleTrackingProvider"
import { AnalyticsConstants } from "./utils/track/constants"
import { SEGMENT_TRACKING_PROVIDER, SegmentTrackingProvider } from "./utils/track/SegmentTrackingProvider"
import { useScreenDimensions } from "./utils/useScreenDimensions"
import { useStripeConfig } from "./utils/useStripeConfig"

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "Calling `getNode()` on the ref of an Animated component is no longer necessary.",
  "RelayResponseNormalizer: Payload did not contain a value for field `id: id`. Check that you are parsing with the same query that was used to fetch the payload.",

  // RN 0.59.0 ships with this bug, see: https://github.com/facebook/react-native/issues/16376
  "RCTBridge required dispatch_sync to load RCTDevLoadingView. This may lead to deadlocks",

  "Require cycle:",

  // This is for the Artist page, which will likely get redone soon anyway.
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.",
  "Picker has been extracted",
])

addTrackingProvider(SEGMENT_TRACKING_PROVIDER, SegmentTrackingProvider)
addTrackingProvider("console", ConsoleTrackingProvider)

interface ArtworkProps {
  artworkID: string
  isVisible: boolean
}

const Artwork: React.FC<ArtworkProps> = (props) => <ArtworkQueryRenderer {...props} />

interface PartnerProps {
  partnerID: string
  safeAreaInsets: SafeAreaInsets
  isVisible: boolean
}

const Partner: React.FC<PartnerProps> = (props) => <PartnerQueryRenderer {...props} />

interface PartnerLocationsProps {
  partnerID: string
  safeAreaInsets: SafeAreaInsets
  isVisible: boolean
}
const PartnerLocations: React.FC<PartnerLocationsProps> = (props) => <PartnerLocationsQueryRenderer {...props} />

interface InquiryProps {
  artworkID: string
}
const Inquiry: React.FC<InquiryProps> = screenTrack<InquiryProps>((props) => {
  return {
    context_screen: Schema.PageNames.InquiryPage,
    context_screen_owner_slug: props.artworkID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
  }
})((props) => <InquiryQueryRenderer {...props} />)

interface ConversationProps {
  conversationID: string
}
const Conversation: React.FC<ConversationProps> = screenTrack<ConversationProps>((props) => {
  return {
    context_screen: Schema.PageNames.ConversationPage,
    context_screen_owner_id: props.conversationID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Conversation,
  }
})(ConversationNavigator)

interface SearchWithTrackingProps {
  safeAreaInsets: SafeAreaInsets
}
const SearchWithTracking: React.FC<SearchWithTrackingProps> = screenTrack<SearchWithTrackingProps>(() => {
  return {
    context_screen: Schema.PageNames.Search,
    context_screen_owner_type: Schema.OwnerEntityTypes.Search,
  }
})((props) => {
  return <Search {...props} />
})

interface PageWrapperProps {
  fullBleed?: boolean
  isMainView?: boolean
  ViewComponent: React.ComponentType<any>
  viewProps: any
}

const InnerPageWrapper: React.FC<PageWrapperProps> = ({ fullBleed, isMainView, ViewComponent, viewProps }) => {
  const safeAreaInsets = useScreenDimensions().safeAreaInsets
  const paddingTop = fullBleed ? 0 : safeAreaInsets.top
  const paddingBottom = isMainView ? 0 : safeAreaInsets.bottom
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  // if we're in a modal, just pass isVisible through
  const currentTab = useSelectedTab()
  let isVisible = viewProps.isVisible
  if (BottomTabOption[viewProps.navStackID as BottomTabType]) {
    // otherwise, make sure it respects the current tab
    isVisible = isVisible && currentTab === viewProps.navStackID
  }
  const isPresentedModally = viewProps.isPresentedModally
  return (
    <ArtsyKeyboardAvoidingViewContext.Provider value={{ isVisible, isPresentedModally, bottomOffset: paddingBottom }}>
      <View style={{ flex: 1, paddingTop, paddingBottom }}>
        {isHydrated ? (
          <FadeIn style={{ flex: 1 }} slide={false}>
            <ViewComponent {...{ ...viewProps, isVisible }} />
          </FadeIn>
        ) : null}
      </View>
    </ArtsyKeyboardAvoidingViewContext.Provider>
  )
}

// provide the tracking context so pages can use `useTracking` all the time
@track()
class PageWrapper extends React.Component<PageWrapperProps> {
  render() {
    return (
      <AppProviders>
        <InnerPageWrapper {...this.props} />
      </AppProviders>
    )
  }
}

function register(
  screenName: string,
  Component: React.ComponentType<any>,
  options?: Omit<PageWrapperProps, "ViewComponent" | "viewProps">
) {
  const WrappedComponent = (props: any) => (
    <PageWrapper {...options} ViewComponent={Component} viewProps={props}></PageWrapper>
  )
  AppRegistry.registerComponent(screenName, () => WrappedComponent)
}

export interface ViewOptions {
  modalPresentationStyle?: "fullScreen" | "pageSheet" | "formSheet"
  hasOwnModalCloseButton?: boolean
  alwaysPresentModally?: boolean
  hidesBackButton?: boolean
  fullBleed?: boolean
  // If this module is the root view of a particular tab, name it here
  isRootViewForTabName?: BottomTabType
  // If this module should only be shown in one particular tab, name it here
  onlyShowInTabName?: BottomTabType
}

type ModuleDescriptor =
  | {
      type: "react"
      Component: React.ComponentType<any>
      options: ViewOptions
    }
  | {
      type: "native"
      options: ViewOptions
    }

function reactModule(Component: React.ComponentType<any>, options: ViewOptions = {}): ModuleDescriptor {
  return { type: "react", options, Component }
}

function nativeModule(options: ViewOptions = {}): ModuleDescriptor {
  return { type: "native", options }
}

// little helper function to make sure we get both intellisense and good type information on the result
function defineModules<T extends string>(obj: Record<T, ModuleDescriptor>) {
  return obj
}

export type AppModule = keyof typeof modules

export const modules = defineModules({
  Admin: nativeModule({ alwaysPresentModally: true }),
  Admin2: reactModule(AdminMenu, { alwaysPresentModally: true, hasOwnModalCloseButton: true }),
  About: reactModule(About),
  Articles: reactModule(ArticlesQueryRenderer),
  Artist: reactModule(ArtistQueryRenderer),
  ArtistShows: reactModule(ArtistShows2QueryRenderer),
  ArtistSeries: reactModule(ArtistSeriesQueryRenderer),
  Artwork: reactModule(Artwork),
  ArtworkMedium: reactModule(ArtworkMediumQueryRenderer),
  ArtworkAttributionClassFAQ: reactModule(ArtworkAttributionClassFAQQueryRenderer),
  Auction: nativeModule(),
  Auction2: reactModule(SaleQueryRenderer, { fullBleed: true }),
  Auctions: reactModule(SalesQueryRenderer),
  AuctionInfo: reactModule(SaleInfoQueryRenderer),
  AuctionFAQ: reactModule(SaleFAQ),
  AuctionResult: reactModule(AuctionResultQueryRenderer),
  AuctionResultsForYou: reactModule(AuctionResultsForYouQueryRenderer),
  AuctionRegistration: reactModule(RegistrationFlow, {
    alwaysPresentModally: true,
    hasOwnModalCloseButton: true,
    fullBleed: true,
  }),
  AuctionBidArtwork: reactModule(BidFlow, {
    alwaysPresentModally: true,
    hasOwnModalCloseButton: true,
    fullBleed: true,
  }),
  BottomTabs: reactModule(BottomTabs, { fullBleed: true }),
  City: reactModule(CityView, { fullBleed: true }),
  CityBMWList: reactModule(CityBMWListQueryRenderer, { fullBleed: true }),
  CityFairList: reactModule(CityFairListQueryRenderer, { fullBleed: true }),
  CityPicker: reactModule(CityPicker, { fullBleed: true }),
  CitySavedList: reactModule(CitySavedListQueryRenderer),
  CitySectionList: reactModule(CitySectionListQueryRenderer),
  Collection: reactModule(CollectionQueryRenderer, { fullBleed: true }),
  ConsignmentsSubmissionForm: reactModule(ConsignmentsSubmissionForm, {
    alwaysPresentModally: true,
    hasOwnModalCloseButton: true,
  }),
  Conversation: reactModule(Conversation, { onlyShowInTabName: "inbox" }),
  Fair: reactModule(FairQueryRenderer, { fullBleed: true }),
  FairMoreInfo: reactModule(FairMoreInfoQueryRenderer),
  FairArticles: reactModule(FairArticlesQueryRenderer),
  FairAllFollowedArtists: reactModule(FairAllFollowedArtistsQueryRenderer),
  FairBMWArtActivation: reactModule(FairBMWArtActivationQueryRenderer, { fullBleed: true }),
  Favorites: reactModule(Favorites),
  Feature: reactModule(FeatureQueryRenderer, { fullBleed: true }),
  FullArtistSeriesList: reactModule(ArtistSeriesFullArtistSeriesListQueryRenderer),
  FullFeaturedArtistList: reactModule(CollectionFullFeaturedArtistListQueryRenderer),
  Gene: reactModule(GeneQueryRenderer),
  Tag: reactModule(TagQueryRenderer),
  Home: reactModule(HomeQueryRenderer, { isRootViewForTabName: "home" }),
  Inbox: reactModule(InboxWrapper, { isRootViewForTabName: "inbox" }),
  Inquiry: reactModule(Inquiry, { alwaysPresentModally: true, hasOwnModalCloseButton: true }),
  LiveAuction: nativeModule({
    alwaysPresentModally: true,
    hasOwnModalCloseButton: true,
    modalPresentationStyle: "fullScreen",
  }),
  LocalDiscovery: nativeModule(),
  WebView: nativeModule(),
  ReactWebView: reactModule(ArtsyReactWebViewPage, {
    fullBleed: true,
    hasOwnModalCloseButton: true,
    hidesBackButton: true,
  }),
  MakeOfferModal: reactModule(MakeOfferModalQueryRenderer, {
    hasOwnModalCloseButton: true,
  }),
  Map: reactModule(MapContainer, { fullBleed: true }),
  MyAccount: reactModule(MyAccountQueryRenderer),
  MyAccountEditEmail: reactModule(MyAccountEditEmailQueryRenderer, { hidesBackButton: true }),
  MyAccountEditName: reactModule(MyAccountEditNameQueryRenderer, { hidesBackButton: true }),
  MyAccountEditPassword: reactModule(MyAccountEditPassword, { hidesBackButton: true }),
  MyAccountEditPhone: reactModule(MyAccountEditPhoneQueryRenderer, { hidesBackButton: true }),
  MyBids: reactModule(MyBidsQueryRenderer),
  MyCollection: reactModule(MyCollectionQueryRenderer),
  MyCollectionArtwork: reactModule(MyCollectionArtworkQueryRenderer),
  MyCollectionArtworkFullDetails: reactModule(MyCollectionArtworkFullDetailsQueryRenderer),
  MyCollectionArtworkImages: reactModule(MyCollectionArtworkImagesQueryRenderer),
  MyProfile: reactModule(MyProfileQueryRenderer, { isRootViewForTabName: "profile" }),
  MyProfilePayment: reactModule(MyProfilePaymentQueryRenderer),
  OrderHistory: reactModule(OrderHistoryQueryRender),
  OrderDetails: reactModule(OrderDetailsQueryRender),
  MyProfilePaymentNewCreditCard: reactModule(MyProfilePaymentNewCreditCard, { hidesBackButton: true }),
  MyProfilePushNotifications: reactModule(MyProfilePushNotificationsQueryRenderer),
  MySellingProfile: reactModule(View),
  Partner: reactModule(Partner, { fullBleed: true }),
  PartnerLocations: reactModule(PartnerLocations),
  PrivacyRequest: reactModule(PrivacyRequest),
  Sales: reactModule(Consignments, { isRootViewForTabName: "sell" }),
  SalesNotRootTabView: reactModule(Consignments),
  Search: reactModule(SearchWithTracking, { isRootViewForTabName: "search" }),
  Show: reactModule(ShowQueryRenderer, { fullBleed: true }),
  ShowMoreInfo: reactModule(ShowMoreInfoQueryRenderer),
  SavedAddresses: reactModule(SavedAddressesQueryRenderer),
  SavedAddressesForm: reactModule(SavedAddressesFormQueryRenderer, {
    alwaysPresentModally: true,
    hasOwnModalCloseButton: false,
  }),
  VanityURLEntity: reactModule(VanityURLEntityRenderer, { fullBleed: true }),
  ViewingRoom: reactModule(ViewingRoomQueryRenderer, { fullBleed: true }),
  ViewingRoomArtwork: reactModule(ViewingRoomArtworkQueryRenderer),
  ViewingRoomArtworks: reactModule(ViewingRoomArtworksQueryRenderer),
  ViewingRooms: reactModule(ViewingRoomsListQueryRenderer),
  Checkout: reactModule(Checkout, {
    hasOwnModalCloseButton: true,
  }),
  WorksForYou: reactModule(WorksForYouQueryRenderer),
  LotsByArtistsYouFollow: reactModule(LotsByArtistsYouFollowQueryRenderer),
  Storybook: reactModule(StorybookUI, { fullBleed: true, hidesBackButton: true }),
  SavedSearchAlertsList: reactModule(SavedSearchAlertsListQueryRenderer),
  EditSavedSearchAlert: reactModule(EditSavedSearchAlertQueryRenderer),
})

// Register react modules with the app registry
for (const moduleName of Object.keys(modules)) {
  const descriptor = modules[moduleName as AppModule]
  if ("Component" in descriptor) {
    if (Platform.OS === "ios") {
      register(moduleName, descriptor.Component, { fullBleed: descriptor.options.fullBleed })
    }
  }
}

const Main: React.FC<{}> = track()(({}) => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "673710093763-hbj813nj4h3h183c4ildmu8vvqc0ek4h.apps.googleusercontent.com",
    })
    if (Platform.OS === "ios") {
      const scheme = Appearance.getColorScheme()
      SegmentTrackingProvider.identify?.(null, {
        [AnalyticsConstants.UserInterfaceStyle.key]: (() => {
          switch (scheme) {
            case "light":
              return AnalyticsConstants.UserInterfaceStyle.value.Light
            case "dark":
              return AnalyticsConstants.UserInterfaceStyle.value.Dark
          }
          return AnalyticsConstants.UserInterfaceStyle.value.Unspecified
        })(),
      })
    }
  }, [])
  const showNewOnboarding = useFeatureFlag("AREnableNewOnboardingFlow")
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) =>
    showNewOnboarding ? !!state.auth.userID : !!state.native.sessionState.userID
  )
  const onboardingState = GlobalStore.useAppState((state) =>
    showNewOnboarding ? state.auth.onboardingState : state.native.sessionState.onboardingState
  )
  const forceUpdateMessage = GlobalStore.useAppState((state) => state.config.echo.forceUpdateMessage)

  useSentryConfig()
  useStripeConfig()
  useWebViewCookies()

  if (!isHydrated) {
    return <View />
  }

  if (forceUpdateMessage) {
    return <ForceUpdate forceUpdateMessage={forceUpdateMessage} />
  }

  if (!isLoggedIn || onboardingState === "incomplete") {
    return showNewOnboarding ? <Onboarding /> : <NativeViewController viewName="Onboarding" />
  }

  return <BottomTabsNavigator />
})

if (Platform.OS === "ios") {
  register("Artsy", Main, { fullBleed: true, isMainView: true })
}
