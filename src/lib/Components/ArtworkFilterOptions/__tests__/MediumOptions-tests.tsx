import { FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { Aggregations, ArtworkFilterContext, reducer } from "../../../utils/ArtworkFilter/ArtworkFiltersStore"
import { MediumOptionsScreen } from "../MediumOptions"
import { sharedAggregateFilterValidation, ValidationParams } from "./AggregationOptionCommonValidation"

describe("Medium Options Screen", () => {
  const mockAggregations: Aggregations = [
    {
      slice: "MEDIUM",
      counts: [
        {
          name: "Prints",
          count: 2956,
          value: "prints",
        },
        {
          name: "Design",
          count: 513,
          value: "design",
        },
        {
          name: "Sculpture",
          count: 277,
          value: "sculpture",
        },
        {
          name: "Work on Paper",
          count: 149,
          value: "work-on-paper",
        },
        {
          name: "Painting",
          count: 145,
          value: "painting",
        },
        {
          name: "Drawing",
          count: 83,
          value: "drawing",
        },
        {
          name: "Jewelry",
          count: 9,
          value: "jewelry",
        },
        {
          name: "Photography",
          count: 4,
          value: "photography",
        },
      ],
    },
  ]

  const MockMediumScreen = ({ initialState, navigator }: any) => {
    const [filterState, dispatch] = React.useReducer(reducer, initialState)

    return (
      <ArtworkFilterContext.Provider
        value={{
          state: filterState,
          dispatch,
        }}
      >
        <MediumOptionsScreen navigator={navigator} />
      </ArtworkFilterContext.Provider>
    )
  }

  const aggregateParams: ValidationParams = {
    Screen: MockMediumScreen,
    aggregations: mockAggregations,
    paramName: FilterParamName.medium,
    filterKey: FilterParamName.medium,
    name: "medium",
  }
  sharedAggregateFilterValidation(aggregateParams)
})
