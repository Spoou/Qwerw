import { SplitFactory } from "@splitsoftware/splitio-react-native"
import { IReactNativeSettings } from "@splitsoftware/splitio-react-native/types/splitio"
import { DateTime } from "luxon"
import { useEffect } from "react"
import Config from "react-native-config"
import { getUniqueId } from "react-native-device-info"
import { GlobalStore, useFeatureFlag } from "../store/GlobalStore"
import { EXPERIMENT_NAME, experiments } from "./experiments"

let client: SplitIO.IClient | null = null

export const useExperiments = () => {
  const enableSplitIOABTesting = useFeatureFlag("AREnableSplitIOABTesting")
  const environment = GlobalStore.useAppState((store) => store.config.environment.env)
  const userIdOrDeviceId = GlobalStore.useAppState((store) => store.auth.userID ?? `not-logged-in_${getUniqueId()}`)

  useEffect(() => {
    if (enableSplitIOABTesting) {
      const config: IReactNativeSettings = {
        core: {
          authorizationKey:
            environment === "staging" ? Config.SPLIT_IO_STAGING_API_KEY : Config.SPLIT_IO_PRODUCTION_API_KEY,
          key: userIdOrDeviceId,
        },
        // debug: true,
        streamingEnabled: true,
      }
      const factory: SplitIO.ISDK = SplitFactory(config)
      client = client ?? factory.client()

      client?.on(client.Event.SDK_READY, () => {
        GlobalStore.actions.config.experiments.setSessionState({ isReady: true, lastUpdate: DateTime.utc().toISO() })
      })
      client?.on(client.Event.SDK_READY_TIMED_OUT, () => {
        GlobalStore.actions.config.experiments.setSessionState({ isReady: false })
      })
      client?.on(client.Event.SDK_UPDATE, () => {
        GlobalStore.actions.config.experiments.setSessionState({ lastUpdate: DateTime.now().toISO() })
      })
    }
  }, [enableSplitIOABTesting])
}

export const useTreatment = (treatment: EXPERIMENT_NAME) => {
  const enableSplitIOABTesting = useFeatureFlag("AREnableSplitIOABTesting")
  const isReady = GlobalStore.useAppState((store) => store.config.experiments.sessionState.isReady)

  // This next one, we don't really use, but we need it inside this hook, to make the hook re-render the components it is used it.
  // When the `SDK_UPDATE` event comes, the `lastUpdate` updates, and that means that `client.getTreatment(treatment)` will return a new value.
  // @ts-ignore
  const _lastUpdate = GlobalStore.useAppState((store) => store.config.experiments.sessionState.lastUpdate)

  if (!enableSplitIOABTesting) {
    return experiments[treatment].fallbackTreatment
  }

  if (!isReady || !client) {
    // just return the fallback if anything went wrong with the Split setup
    return experiments[treatment].fallbackTreatment
  }

  return client.getTreatment(treatment)
}
