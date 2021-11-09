import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { getCurrentEmissionState, GlobalStore } from "lib/store/GlobalStore"
import { AdminMenuWrapper } from "lib/utils/AdminMenuWrapper"
import { addTrackingProvider, track } from "lib/utils/track"
import { SEGMENT_TRACKING_PROVIDER, SegmentTrackingProvider } from "lib/utils/track/SegmentTrackingProvider"
import { useDeepLinks } from "lib/utils/useDeepLinks"
import { useStripeConfig } from "lib/utils/useStripeConfig"
import React, { useEffect } from "react"
import { Appearance, UIManager, View } from "react-native"
import RNBootSplash from "react-native-bootsplash"
import { AppProviders } from "./AppProviders"
import { useWebViewCookies } from "./Components/ArtsyReactWebView"
import { useSentryConfig } from "./ErrorReporting"
import { ArtsyNativeModule } from "./NativeModules/ArtsyNativeModule"
import { ModalStack } from "./navigation/ModalStack"
import { BottomTabsNavigator } from "./Scenes/BottomTabs/BottomTabsNavigator"
import { ForceUpdate } from "./Scenes/ForceUpdate/ForceUpdate"
import { Onboarding } from "./Scenes/Onboarding/Onboarding"
import { createAllChannels, savePendingToken } from "./utils/PushNotification"
import { ConsoleTrackingProvider } from "./utils/track/ConsoleTrackingProvider"
import { AnalyticsConstants } from "./utils/track/constants"
import { useInitialNotification } from "./utils/useInitialNotification"

addTrackingProvider(SEGMENT_TRACKING_PROVIDER, SegmentTrackingProvider)
addTrackingProvider("console", ConsoleTrackingProvider)

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const Main: React.FC<{}> = track()(({}) => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "673710093763-hbj813nj4h3h183c4ildmu8vvqc0ek4h.apps.googleusercontent.com",
    })
  }, [])
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const onboardingState = GlobalStore.useAppState((state) => state.auth.onboardingState)
  const forceUpdateMessage = GlobalStore.useAppState((state) => state.config.echo.forceUpdateMessage)

  useSentryConfig()
  useStripeConfig()
  useWebViewCookies()
  useDeepLinks()
  useInitialNotification()

  useEffect(() => {
    createAllChannels()
    const scheme = Appearance.getColorScheme()
    // null id means keep whatever id was there before. we only update the user interface info here.
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
  }, [])

  useEffect(() => {
    const launchCount = getCurrentEmissionState().launchCount
    if (launchCount > 1) {
      return
    }
    SegmentTrackingProvider.postEvent({ name: AnalyticsConstants.FreshInstall })
  }, [])

  useEffect(() => {
    if (isHydrated) {
      // We wait a bit until the UI finishes drawing behind the splash screen
      setTimeout(() => {
        RNBootSplash.hide().then(() => {
          requestAnimationFrame(() => {
            ArtsyNativeModule.lockActivityScreenOrientation()
          })
        })
        ArtsyNativeModule.setAppStyling()
        if (isLoggedIn) {
          ArtsyNativeModule.setNavigationBarColor("#FFFFFF")
          ArtsyNativeModule.setAppLightContrast(false)
        }
      }, 500)
    }
  }, [isHydrated])

  useEffect(() => {
    if (isLoggedIn) {
      savePendingToken()
    }
  }, [isLoggedIn])

  if (!isHydrated) {
    return <View />
  }

  if (forceUpdateMessage) {
    return <ForceUpdate forceUpdateMessage={forceUpdateMessage} />
  }

  if (!isLoggedIn || onboardingState === "incomplete") {
    return <Onboarding />
  }

  return (
    <ModalStack>
      <BottomTabsNavigator />
    </ModalStack>
  )
})

export const App = () => (
  <AppProviders>
    <AdminMenuWrapper>
      <Main />
    </AdminMenuWrapper>
  </AppProviders>
)
