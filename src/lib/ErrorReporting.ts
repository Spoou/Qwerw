import * as Sentry from "@sentry/react-native"
import Config from "react-native-config"
import { LegacyNativeModules } from "./NativeModules/LegacyNativeModules"
import { getCurrentEmissionState } from "./store/GlobalStore"

if (getCurrentEmissionState().sentryDSN) {
  // Important!: this needs to match the releaseVersion specified
  // in fastfile for sentry releases for sourcemaps to work correctly
  const appVersion = LegacyNativeModules.ARTemporaryAPIModule.appVersion
  const buildVersion = LegacyNativeModules.ARTemporaryAPIModule.buildVersion
  let sentryReleaseName = appVersion + "+" + buildVersion

  // Releases on sentry are org-wide so we need to distinguish
  // names in staging
  if (Config.SENTRY_BETA_DSN === getCurrentEmissionState().sentryDSN) {
    sentryReleaseName = sentryReleaseName + "-beta"
  }

  Sentry.init({
    dsn: getCurrentEmissionState().sentryDSN,
    release: sentryReleaseName,
    enableAutoSessionTracking: true,
    autoSessionTracking: true,
  })
}
