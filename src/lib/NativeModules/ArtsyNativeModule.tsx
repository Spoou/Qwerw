import { NativeModules, PixelRatio, Platform } from "react-native"
import { LegacyNativeModules } from "./LegacyNativeModules"

/**
 * Cross-platform native module facade.
 * All new artsy-specific native bridge code should be exposed here.
 * Any legacy iOS native bridge code that is made cross-platform should also be exposed here.
 */
export const ArtsyNativeModule = {
  launchCount:
    Platform.OS === "ios"
      ? LegacyNativeModules.ARNotificationsManager.nativeState.launchCount
      : (NativeModules.ArtsyNativeModule.getConstants().launchCount as number),
  setAppStyling:
    Platform.OS === "ios"
      ? () => {
          console.error("setAppStyling is unsupported on iOS")
        }
      : NativeModules.ArtsyNativeModule.setAppStyling,
  setNavigationBarColor:
    Platform.OS === "ios"
      ? () => {
          console.error("setNavigationBarColor is unsupported on iOS")
        }
      : NativeModules.ArtsyNativeModule.setNavigationBarColor,
  setAppTheme:
    Platform.OS === "ios"
      ? () => {
          console.error("setAppTheme is unsupported on iOS")
        }
      : NativeModules.ArtsyNativeModule.setAppTheme,
  get navigationBarHeight() {
    return Platform.OS === "ios"
      ? 0
      : NativeModules.ArtsyNativeModule.getConstants().navigationBarHeight / PixelRatio.get()
  },
}
