import { action, Action, computed, Computed, thunkOn, ThunkOn } from "easy-peasy"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { EchoModel, getEchoModel } from "./config/EchoModel"
import { EnvironmentModel, getEnvironmentModel } from "./config/EnvironmentModel"
import { FeaturesModel, getFeaturesModel } from "./config/FeaturesModel"
import { unsafe__getEnvironment } from "./GlobalStore"
import { GlobalStoreModel } from "./GlobalStoreModel"

export interface ConfigModel {
  echo: EchoModel
  features: FeaturesModel
  environment: EnvironmentModel

  userIsDevFlipValue: boolean
  userIsDev: Computed<this, boolean, GlobalStoreModel>
  setUserIsDevFlipValue: Action<this, ConfigModel["userIsDevFlipValue"]>
  onSetUserIsDevFlipValue: ThunkOn<this>
}

export const getConfigModel = (): ConfigModel => ({
  echo: getEchoModel(),
  features: getFeaturesModel(),
  environment: getEnvironmentModel(),

  userIsDevFlipValue: false,
  userIsDev: computed([(_, store) => store], (store) => {
    let retval = false
    if (__DEV__) {
      retval = true
    }
    if (store.auth.userHasArtsyEmail) {
      retval = true
    }
    return store.config.userIsDevFlipValue ? !retval : retval
  }),
  setUserIsDevFlipValue: action((state, nextValue) => {
    state.userIsDevFlipValue = nextValue
  }),
  onSetUserIsDevFlipValue: thunkOn(
    (actions) => actions.setUserIsDevFlipValue,
    () => {
      LegacyNativeModules.ARNotificationsManager.reactStateUpdated(unsafe__getEnvironment())
    }
  ),
})
