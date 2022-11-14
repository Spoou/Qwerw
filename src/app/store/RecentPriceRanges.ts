import { action, Action } from "easy-peasy"
import { GlobalStore } from "./GlobalStore"

export const MAX_SHOWN_RECENT_PRICE_RANGES = 3

export interface RecentPriceRangesModel {
  recentPriceRanges: string[]
  addNewPriceRange: Action<this, string>
}

export const getRecentPriceRanges = (): RecentPriceRangesModel => ({
  recentPriceRanges: [],
  addNewPriceRange: action((state, priceRange) => {
    const prevPriceRanges = state.recentPriceRanges.slice(0, MAX_SHOWN_RECENT_PRICE_RANGES - 1)
    state.recentPriceRanges = [priceRange, ...prevPriceRanges]
  }),
})

export const useRecentPriceRanges = () => {
  return GlobalStore.useAppState((state) => {
    return state.recentPriceRanges.recentPriceRanges
  })
}
