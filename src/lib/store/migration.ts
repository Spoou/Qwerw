// easy-peasy ships with a fork of immer so let's use that instead of adding another copy of immer to our bundle.
import { produce } from "immer-peasy"

/**
 * IMPORTANT
 * Before you modify this file please read docs/adding_state_migrations.md
 */

export const Versions = {
  AddSearchesAndNativeAndBottomTabs: 1,
  AddConsignments: 2,
  RenameConsignmentsToMyCollection: 3,
  RemoveMyCollectionNavigationState: 4,
}

export const CURRENT_APP_VERSION = Versions.RemoveMyCollectionNavigationState

export type Migrations = Record<number, (oldState: any) => any>
export const artsyAppMigrations: Migrations = {
  [Versions.AddSearchesAndNativeAndBottomTabs]: (_) => ({
    bottomTabs: {},
    native: {},
    search: { recentSearches: [] },
  }),
  [Versions.AddConsignments]: (state) => {
    state.consignments = {
      artwork: {},
      navigation: {},
    }
  },
  [Versions.RenameConsignmentsToMyCollection]: (state) => {
    state.myCollection = state.consignments
    delete state.consignments
  },
  [Versions.RemoveMyCollectionNavigationState]: (state) => {
    delete state.myCollection.navigation
  },
}

export function migrate<State extends { version: number }>({
  state,
  migrations = artsyAppMigrations,
  toVersion = CURRENT_APP_VERSION,
}: {
  state: State
  migrations?: Migrations
  toVersion?: number
}): {
  version: number
} {
  if (typeof state.version !== "number") {
    throw new Error("Bad state.version " + JSON.stringify(state))
  }
  while (state.version < toVersion) {
    const nextVersion = state.version + 1
    const migrator = migrations[nextVersion]
    if (!migrator) {
      throw new Error("No migrator found for app version " + nextVersion)
    }
    state = produce(state, migrator)
    state.version = nextVersion
  }
  return state
}
