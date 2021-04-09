import { captureException } from "@sentry/react-native"
import { BottomTabsModelFetchCurrentUnreadConversationCountQuery } from "__generated__/BottomTabsModelFetchCurrentUnreadConversationCountQuery.graphql"
import { Action, action, Thunk, thunk } from "easy-peasy"
import { saveDevNavigationStateSelectedTab } from "lib/navigation/useReloadedDevNavigationState"
import { createEnvironment } from "lib/relay/createEnvironment"
import { metaphysicsURLMiddleware, persistedQueryMiddleware } from "lib/relay/middlewares/metaphysicsMiddleware"
import { simpleLoggerMiddleware } from "lib/relay/middlewares/simpleLoggerMiddleware"
import { GlobalStore } from "lib/store/GlobalStore"
import { fetchQuery, graphql } from "react-relay"
import { BottomTabType } from "./BottomTabType"

export interface BottomTabsModel {
  sessionState: {
    unreadConversationCount: number
    tabProps: Partial<{ [k in BottomTabType]: object }>
    selectedTab: BottomTabType
  }
  unreadConversationCountChanged: Action<BottomTabsModel, number>
  fetchCurrentUnreadConversationCount: Thunk<BottomTabsModel>

  switchTab: Action<BottomTabsModel, BottomTabType>
  setTabProps: Action<BottomTabsModel, { tab: BottomTabType; props: object | undefined }>
}

export const getBottomTabsModel = (): BottomTabsModel => ({
  sessionState: {
    unreadConversationCount: 0,
    tabProps: {},
    selectedTab: "home",
  },
  unreadConversationCountChanged: action((state, unreadConversationCount) => {
    state.sessionState.unreadConversationCount = unreadConversationCount
  }),
  fetchCurrentUnreadConversationCount: thunk(async () => {
    try {
      const result = await fetchQuery<BottomTabsModelFetchCurrentUnreadConversationCountQuery>(
        createEnvironment([[persistedQueryMiddleware(), metaphysicsURLMiddleware(), simpleLoggerMiddleware()]]),
        graphql`
          query BottomTabsModelFetchCurrentUnreadConversationCountQuery {
            me @principalField {
              unreadConversationCount
            }
          }
        `,
        {},
        { force: true }
      )
      if (result?.me?.unreadConversationCount != null) {
        GlobalStore.actions.bottomTabs.unreadConversationCountChanged(result.me.unreadConversationCount)
        GlobalStore.actions.native.setApplicationIconBadgeNumber(result.me.unreadConversationCount)
      }
    } catch (e) {
      if (__DEV__) {
        console.warn(
          "[DEV] Couldn't fetch unreadConversationCount.\n\nThis happens from time to time in staging. If it's happening reliably for you, there's a problem and you should look into it."
        )
        console.log(e)
      } else {
        captureException(e)
      }
    }
  }),
  setTabProps: action((state, { tab, props }) => {
    state.sessionState.tabProps[tab] = props
  }),
  switchTab: action((state, tabType) => {
    state.sessionState.selectedTab = tabType
    saveDevNavigationStateSelectedTab(tabType)
  }),
})
