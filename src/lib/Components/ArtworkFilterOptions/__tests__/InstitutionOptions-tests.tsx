import { Aggregations, FilterParamName } from "lib/Components/ArtworkFilter/FilterArtworksHelpers"
import React from "react"
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

  const MockInstitutionScreen = () => <InstitutionOptionsScreen {...getEssentialProps()} />

  const aggregateParams: ValidationParams = {
    Screen: MockInstitutionScreen,
    aggregations: mockAggregations,
    paramName: FilterParamName.institution,
    filterKey: "institution",
    name: "institution",
  }

  sharedAggregateFilterValidation(aggregateParams)
})
