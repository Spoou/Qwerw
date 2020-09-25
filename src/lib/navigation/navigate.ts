import { isNativeModule, modules } from "lib/AppRegistry"
import { Linking, NativeModules } from "react-native"
import { matchRoute } from "./routes"

export function navigate(url: string, options: { modal?: boolean } = {}) {
  const result = matchRoute(url)

  if (result.type === "external_url") {
    Linking.openURL(result.url)
    return
  }

  const module = modules[result.module]

  const presentModally = options.modal ?? module.alwaysPresentModally ?? false

  if (isNativeModule(module)) {
    NativeModules.ARScreenPresenterModule.presentNativeScreen(result.module, result.params, presentModally)
  } else {
    if (module.isRootViewForTabName && !presentModally) {
      NativeModules.ARScreenPresenterModule.switchTab(module.isRootViewForTabName, result.params, true)
    } else {
      if (module.onlyShowInTabName) {
        NativeModules.ARScreenPresenterModule.switchTab(module.onlyShowInTabName, {}, true)
      }
      NativeModules.ARScreenPresenterModule.presentReactScreen(
        result.module,
        result.params,
        presentModally,
        module.hidesBackButton ?? false
      )
    }
  }
}

export function dismissModal() {
  NativeModules.ARScreenPresenterModule.dismissModal()
}

export function goBack() {
  NativeModules.ARScreenPresenterModule.goBack()
}
