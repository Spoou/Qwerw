import { FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { Aggregations, ArtworkFilterContext, reducer } from "../../../utils/ArtworkFilter/ArtworkFiltersStore"
import { TimePeriodOptionsScreen } from "../TimePeriodOptions"
import { sharedAggregateFilterValidation, ValidationParams } from "./AggregationOptionCommonValidation"

describe("Time Period Options Screen", () => {
  const mockAggregations: Aggregations = [
    {
      slice: "MAJOR_PERIOD",
      counts: [
        {
          name: "Late 19th Century",
          count: 6,
          value: "Late 19th Century",
        },
        {
          name: "2010",
          count: 10,
          value: "2010",
        },
        {
          name: "2000",
          count: 4,
          value: "2000",
        },
        {
          name: "1990",
          count: 20,
          value: "1990",
        },
        {
          name: "1980",
          count: 46,
          value: "1980",
        },
        {
          name: "1970",
          count: 524,
          value: "1970",
        },
      ],
    },
  ]

  const MockTimePeriodScreen = ({ initialState, navigator }: any) => {
    const [filterState, dispatch] = React.useReducer(reducer, initialState)

    return (
      <ArtworkFilterContext.Provider
        value={{
          state: filterState,
          dispatch,
        }}
      >
        <TimePeriodOptionsScreen navigator={navigator} />
      </ArtworkFilterContext.Provider>
    )
  }

  const aggregateParams: ValidationParams = {
    Screen: MockTimePeriodScreen,
    aggregations: mockAggregations,
    paramName: FilterParamName.timePeriod,
    filterKey: FilterParamName.timePeriod,
    name: "timePeriod",
  }

  sharedAggregateFilterValidation(aggregateParams)
})
