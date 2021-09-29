import { ActionType, OwnerType, Screen } from "@artsy/cohesion"
import { addBreadcrumb } from "@sentry/react-native"
import { EventEmitter } from "events"
import { AppModule, modules, ViewOptions } from "lib/AppRegistry"
import { __unsafe_switchTab } from "lib/NativeModules/ARScreenPresenterModule"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"
import { GlobalStore, unsafe__getSelectedTab } from "lib/store/GlobalStore"
import { Schema } from "lib/utils/track"
import { postEventToProviders } from "lib/utils/track/providers"
import { Linking, Platform } from "react-native"
import { matchRoute } from "./routes"

export interface ViewDescriptor extends ViewOptions {
  type: "react" | "native"
  moduleName: AppModule
  // Whether the new view should replace the previous (modal only)
  replace?: boolean
  props: object
}

export interface NavigateOptions {
  modal?: boolean
  passProps?: object
  replace?: boolean
  // Only when onlyShowInTabName specified
  popToRootTabView?: boolean
}

let lastInvocation = { url: "", timestamp: 0 }

export async function navigate(url: string, options: NavigateOptions = {}) {
  // Debounce double taps
  if (lastInvocation.url === url && Date.now() - lastInvocation.timestamp < 1000) {
    return
  }

  lastInvocation = { url, timestamp: Date.now() }

  const result = matchRoute(url)

  if (result.type === "external_url") {
    Linking.openURL(result.url)
    return
  }

  addBreadcrumb({
    message: `user navigated to ${url}`,
    category: "navigation",
  })

  const module = modules[result.module]
  const presentModally = options.modal ?? module.options.alwaysPresentModally ?? false
  const { replace = false, popToRootTabView } = options

  const screenDescriptor: ViewDescriptor = {
    type: module.type,
    moduleName: result.module,
    replace,
    props: {
      ...result.params,
      ...options.passProps,
    },
    ...module.options,
  }

  if (presentModally) {
    LegacyNativeModules.ARScreenPresenterModule.presentModal(screenDescriptor)
  } else if (module.options.isRootViewForTabName) {
    // this view is one of our root tab views, e.g. home, search, etc.
    // switch to the tab, pop the stack, and scroll to the top.
    await LegacyNativeModules.ARScreenPresenterModule.popToRootAndScrollToTop(module.options.isRootViewForTabName)
    switchTab(module.options.isRootViewForTabName, screenDescriptor.props)
  } else {
    const { onlyShowInTabName } = module.options
    const selectedTab = unsafe__getSelectedTab()
    const delayExecution = !!onlyShowInTabName && onlyShowInTabName !== selectedTab
    const pushView = () => {
      LegacyNativeModules.ARScreenPresenterModule.pushView(onlyShowInTabName ?? selectedTab, screenDescriptor)
    }

    if (onlyShowInTabName) {
      if (popToRootTabView) {
        await LegacyNativeModules.ARScreenPresenterModule.popToRootAndScrollToTop(onlyShowInTabName)
      }

      switchTab(onlyShowInTabName)
    }

    if (delayExecution) {
      requestAnimationFrame(pushView)
    } else {
      pushView()
    }
  }
}

export const navigationEvents = new EventEmitter()

export function switchTab(tab: BottomTabType, props?: object) {
  // root tabs are only mounted once so cannot be tracked
  // like other screens manually track screen views here
  postEventToProviders(tracks.tabScreenView(tab))

  if (props) {
    GlobalStore.actions.bottomTabs.setTabProps({ tab, props })
  }
  if (Platform.OS === "ios") {
    GlobalStore.actions.bottomTabs.switchTab(tab)
  } else {
    __unsafe_switchTab(tab)
  }
}

const tracks = {
  tabScreenView: (tab: BottomTabType): Screen => {
    let tabScreen = OwnerType.home
    switch (tab) {
      case "home":
        tabScreen = OwnerType.home
        break
      case "inbox":
        tabScreen = OwnerType.inbox
        break
      case "profile":
        tabScreen = OwnerType.profile
        break
      case "search":
        tabScreen = OwnerType.search
        break
      case "sell":
        tabScreen = OwnerType.sell
        break
    }

    return {
      context_screen_owner_type: tabScreen,
      action: ActionType.screen,
    }
  },
}

export function dismissModal() {
  LegacyNativeModules.ARScreenPresenterModule.dismissModal()
  if (Platform.OS === "android") {
    navigationEvents.emit("modalDismissed")
  }
}

export function goBack() {
  LegacyNativeModules.ARScreenPresenterModule.goBack(unsafe__getSelectedTab())
  navigationEvents.emit("goBack")
}

export function popParentViewController() {
  LegacyNativeModules.ARScreenPresenterModule.popStack(unsafe__getSelectedTab())
}

export enum EntityType {
  Partner = "partner",
  Fair = "fair",
}

export enum SlugType {
  ProfileID = "profileID",
  FairID = "fairID",
}

export function navigateToPartner(slug: string) {
  navigate(slug, { passProps: { entity: EntityType.Partner, slugType: SlugType.ProfileID } })
}

/**
 * Looks up the entity by slug passed in and presents appropriate viewController
 * @param component: ignored, kept for compatibility
 * @param slug: identifier for the entity to be presented
 * @param entity: type of entity we are routing to, this is currently used to determine what loading
 * state to show, either 'fair' or 'partner'
 * @param slugType: type of slug or id being passed, this determines how the entity is looked up
 * in the api, if we have a fairID we can route directly to fair component and load the fair, if
 * we have a profileID we must first fetch the profile and find the ownerType which can be a fair
 * partner or other.
 */
export function navigateToEntity(slug: string, entity: EntityType, slugType: SlugType) {
  navigate(slug, { passProps: { entity, slugType } })
}
