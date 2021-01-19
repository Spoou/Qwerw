import { FilterParamName } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
import { Aggregations, ArtworkFilterContext, reducer } from "../../../utils/ArtworkFilter/ArtworkFiltersStore"
import { InstitutionOptionsScreen } from "../InstitutionOptions"
import { sharedAggregateFilterValidation, ValidationParams } from "./AggregationOptionCommonValidation"
import { getEssentialProps } from "./helper"

describe("Institution Options Screen", () => {
  const mockAggregations: Aggregations = [
    {
      slice: "INSTITUTION",
      counts: [
        {
          name: "Musée Picasso Paris",
          count: 36,
          value: "musee-picasso-paris",
        },
        {
          name: "Fondation Beyeler",
          count: 33,
          value: "fondation-beyeler",
        },
        {
          name: "Tate",
          count: 11,
          value: "tate",
        },
      ],
    },
  ]

  const MockInstitutionScreen = ({ initialState }: any) => {
    const [filterState, dispatch] = React.useReducer(reducer, initialState)

    return (
      <ArtworkFilterContext.Provider
        value={{
          state: filterState,
          dispatch,
        }}
      >
        <InstitutionOptionsScreen {...getEssentialProps()} />
      </ArtworkFilterContext.Provider>
    )
  }

  const aggregateParams: ValidationParams = {
    Screen: MockInstitutionScreen,
    aggregations: mockAggregations,
    paramName: FilterParamName.institution,
    filterKey: "institution",
    name: "institution",
  }

  sharedAggregateFilterValidation(aggregateParams)
})
