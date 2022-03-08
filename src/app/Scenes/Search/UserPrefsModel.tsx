import { MyCollectionArtworkFormQuery } from "__generated__/MyCollectionArtworkFormQuery.graphql"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { GlobalStoreModel } from "app/store/GlobalStoreModel"
import { Action, action, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy"
import { getCurrencies } from "react-native-localize"
import { fetchQuery, graphql } from "relay-runtime"

const currencies = ["USD", "EUR", "GBP"] as const
const metrics = ["in", "cm"] as const

export type Currency = typeof currencies[number]
export type Metric = typeof metrics[number]
export type ViewOption = "grid" | "list"

// set default currency depending on device locale
const userCurrencies = getCurrencies()

const DEFAULT_CURRENCY =
  (userCurrencies.find((userCurrency) =>
    (currencies as unknown as string[]).includes(userCurrency)
  ) as Currency) ?? "USD"
const DEFAULT_METRIC = ""
const DEFAULT_VIEW_OPTION = "grid"
// please update this when adding new user preferences
export interface UserPrefs {
  pricePaidCurrency: Currency
  metric: Metric
  artworkViewOption: ViewOption
}

export interface UserPrefsModel {
  currency: Currency
  metric: Metric | ""
  artworkViewOption: ViewOption
  setCurrency: Action<this, Currency>
  setMetric: Action<this, Metric>
  fetchRemoteUserPrefs: Thunk<UserPrefsModel>
  didRehydrate: ThunkOn<UserPrefsModel, {}, GlobalStoreModel>
  setArtworkViewOption: Action<this, ViewOption>
}

export const getUserPrefsModel = (): UserPrefsModel => ({
  currency: DEFAULT_CURRENCY,
  metric: DEFAULT_METRIC,
  artworkViewOption: DEFAULT_VIEW_OPTION,
  setCurrency: action((state, currency) => {
    if (currencies.includes(currency)) {
      state.currency = currency
    } else {
      console.warn("Currency not supported")
    }
  }),
  setMetric: action((state, metric) => {
    if (metrics.includes(metric)) {
      state.metric = metric
    } else {
      console.warn("Metric/Dimension Unit not supported")
    }
  }),
  fetchRemoteUserPrefs: thunk(async (actions) => {
    const me = await fetchMe()

    actions.setMetric(me?.lengthUnitPreference.toLowerCase() as Metric)
    actions.setCurrency(me?.currencyPreference as Currency)
  }),
  didRehydrate: thunkOn(
    (_, storeActions) => storeActions.rehydrate,
    (actions, __, store) => {
      const persistedCurrency = store.getState().currency
      const persistedMetric = store.getState().metric

      actions.setCurrency(persistedCurrency as Currency)
      actions.setMetric(persistedMetric as Metric)

      actions.fetchRemoteUserPrefs()
    }
  ),
  setArtworkViewOption: action((state, viewOption) => {
    state.artworkViewOption = viewOption
  }),
})

const fetchMe = async () => {
  const result = await fetchQuery<MyCollectionArtworkFormQuery>(
    defaultEnvironment,
    graphql`
      query MyCollectionArtworkFormQuery {
        me {
          lengthUnitPreference
          currencyPreference
        }
      }
    `,
    {}
  ).toPromise()

  return result?.me
}
