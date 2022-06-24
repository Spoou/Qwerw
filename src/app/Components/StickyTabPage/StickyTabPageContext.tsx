import { GlobalState } from "app/utils/useGlobalState"
import React from "react"
import Animated from "react-native-reanimated"
import { TabVisualClues } from "./StickyTabPage"

export const StickyTabPageContext = React.createContext<{
  staticHeaderHeight: Animated.Node<number> | null
  stickyHeaderHeight: Animated.Node<number> | null
  headerOffsetY: Animated.Value<number>
  tabLabels: string[]
  tabVisualClues: Array<TabVisualClues | undefined>
  refreshControllPadding: number | undefined
  activeTabIndex: GlobalState<number>
  setActiveTabIndex(index: number): void
}>(null as any)

export function useStickyTabPageContext() {
  return React.useContext(StickyTabPageContext)
}
