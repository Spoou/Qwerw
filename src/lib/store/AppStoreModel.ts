import { Action, action, State } from "easy-peasy"
import { BottomTabsModel } from "lib/Scenes/BottomTabs/BottomTabsModel"
import { SearchModel } from "lib/Scenes/Search/SearchModel"
import { NativeModel } from "./NativeModel"
import { assignDeep } from "./persistence"

export const CURRENT_APP_VERSION = 1
interface AppStoreStateModel {
  version: number
  sessionState: {
    isHydrated: boolean
  }

  native: NativeModel

  bottomTabs: BottomTabsModel
  search: SearchModel
}
export interface AppStoreModel extends AppStoreStateModel {
  rehydrate: Action<AppStoreModel, DeepPartial<State<AppStoreStateModel>>>
}

export const appStoreModel: AppStoreModel = {
  // META STATE
  version: CURRENT_APP_VERSION,
  rehydrate: action((state, unpersistedState) => {
    if (!__TEST__ && state.sessionState.isHydrated) {
      console.error("The store was already hydrated. `rehydrate` should only be called once.")
      return
    }
    assignDeep(state, unpersistedState)
    state.sessionState.isHydrated = true
  }),
  sessionState: {
    // we don't perform hydration at test time so let's set it to always true for tests
    isHydrated: __TEST__,
  },

  // NATIVE MIGRATION STATE
  native: NativeModel,

  // APP MODULE STATE
  bottomTabs: BottomTabsModel,
  search: SearchModel,
}

export type AppStoreState = State<AppStoreModel>
