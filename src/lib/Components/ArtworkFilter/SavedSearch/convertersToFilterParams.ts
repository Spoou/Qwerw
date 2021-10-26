import { compact, Dictionary, isNil, keyBy, mapValues } from "lodash"
import {
  Aggregation,
  Aggregations,
  FilterData,
  filterKeyFromAggregation,
  FilterParamName,
  getDisplayNameForTimePeriod,
} from "../ArtworkFilterHelpers"
import { DEFAULT_FILTERS } from "../ArtworkFilterStore"
import { ATTRIBUTION_CLASS_OPTIONS } from "../Filters/AttributionClassOptions"
import { COLORS_INDEXED_BY_VALUE } from "../Filters/ColorsOptions"
import { localizeDimension, parsePriceRangeLabel, parseRange } from "../Filters/helpers"
import { SIZES_OPTIONS } from "../Filters/NewSizesOptions"
import { WAYS_TO_BUY_FILTER_PARAM_NAMES } from "../Filters/WaysToBuyOptions"
import { FALLBACK_SIZE_OPTIONS, shouldExtractValueNamesFromAggregation } from "./constants"
import { SearchCriteriaAttributeKeys, SearchCriteriaAttributes } from "./types"

export type AggregationByFilterParamName = Dictionary<Aggregation[]>

export const convertPriceToFilterParam = (criteria: SearchCriteriaAttributes): FilterData | null => {
  const priceRangeValue = criteria[FilterParamName.priceRange]

  if (!isNil(priceRangeValue)) {
    const { min, max } = parseRange(priceRangeValue)

    if (min !== "*" || max !== "*") {
      return {
        displayText: parsePriceRangeLabel(min, max),
        paramValue: `${min}-${max}`,
        paramName: FilterParamName.priceRange,
      }
    }
  }

  return null
}

export const convertCustomSizeToFilterParamByName = (paramName: FilterParamName, range: string) => {
  const { min, max } = parseRange(range)
  const widthMinLocalized = localizeDimension(min, "in")
  const widthMaxLocalized = localizeDimension(max, "in")

  return {
    displayText: `${widthMinLocalized.value}-${widthMaxLocalized.value}`,
    paramValue: `${min}-${max}`,
    paramName,
  }
}

export const convertSizeToFilterParams = (criteria: SearchCriteriaAttributes): FilterData[] | null => {
  const filterParams: FilterData[] = []
  const dimensionRangeValue = criteria.dimensionRange
  const widthValue = criteria[FilterParamName.width]
  const heightValue = criteria[FilterParamName.height]
  const sizesValues = criteria[FilterParamName.sizes]

  // Convert old size filter format to new
  if (!isNil(dimensionRangeValue) && dimensionRangeValue !== "0-*") {
    const sizeOptionItem = FALLBACK_SIZE_OPTIONS.find((option) => option.oldParamValue === dimensionRangeValue)

    if (sizeOptionItem) {
      filterParams.push({
        displayText: sizeOptionItem.displayText,
        paramValue: [sizeOptionItem.newParamValue],
        paramName: FilterParamName.sizes,
      })
    }
  }

  if (Array.isArray(sizesValues)) {
    const sizeOptions = sizesValues.map((sizeValue) => {
      return SIZES_OPTIONS.find((sizeOption) => sizeOption.paramValue === sizeValue)
    })
    const filledSizeOptions = compact(sizeOptions)

    if (filledSizeOptions.length > 0) {
      filterParams.push({
        displayText: filledSizeOptions.map((sizeOption) => sizeOption.displayText).join(", "),
        paramValue: filledSizeOptions.map((sizeOption) => sizeOption.paramValue) as string[],
        paramName: FilterParamName.sizes,
      })
    }
  }

  // Parse custom width size
  if (!isNil(widthValue)) {
    filterParams.push(convertCustomSizeToFilterParamByName(FilterParamName.width, widthValue))
  }

  // Parse custom height size
  if (!isNil(heightValue)) {
    filterParams.push(convertCustomSizeToFilterParamByName(FilterParamName.height, heightValue))
  }

  if (filterParams.length > 0) {
    return filterParams
  }

  return null
}

export const convertColorsToFilterParam = (
  criteria: SearchCriteriaAttributes,
  aggregation: AggregationByFilterParamName
): FilterData | null => {
  const colorsValue = criteria[FilterParamName.colors]

  if (Array.isArray(colorsValue) && colorsValue.length > 0) {
    const colorFromAggregationByValue = keyBy(aggregation[FilterParamName.colors], "value")
    const availableColors = colorsValue.filter((color) => !!colorFromAggregationByValue[color])
    const colorNames = availableColors.map((color) => COLORS_INDEXED_BY_VALUE[color].name)

    if (availableColors.length > 0) {
      return {
        displayText: colorNames.join(", "),
        paramValue: availableColors,
        paramName: FilterParamName.colors,
      }
    }
  }

  return null
}

export const convertAggregationValueNamesToFilterParam = (
  paramName: FilterParamName,
  aggregations: Aggregation[],
  criteriaValues: string[]
): FilterData | null => {
  const aggregationByValue = keyBy(aggregations, "value")
  const availableValues = criteriaValues.filter((criteriaValue) => !!aggregationByValue[criteriaValue])
  const names = availableValues.map((value) => aggregationByValue[value].name)

  if (availableValues.length > 0) {
    return {
      displayText: names.join(", "),
      paramValue: availableValues,
      paramName,
    }
  }

  return null
}

export const convertAttributionToFilterParam = (criteria: SearchCriteriaAttributes): FilterData | null => {
  const attributionValues = criteria[FilterParamName.attributionClass]

  if (Array.isArray(attributionValues) && attributionValues.length > 0) {
    const attributionItemByValue = keyBy(ATTRIBUTION_CLASS_OPTIONS, "paramValue")
    const availableAttributions = attributionValues.filter((attribution) => !!attributionItemByValue[attribution])
    const names = availableAttributions.map((attribution) => attributionItemByValue[attribution].displayText)

    if (availableAttributions.length > 0) {
      return {
        displayText: names.join(", "),
        paramValue: availableAttributions,
        paramName: FilterParamName.attributionClass,
      }
    }
  }

  return null
}

export const convertWaysToBuyToFilterParams = (criteria: SearchCriteriaAttributes): FilterData[] | null => {
  const defautFilterParamByName = keyBy(DEFAULT_FILTERS, "paramName")
  const availableWaysToBuyFilterParamNames = WAYS_TO_BUY_FILTER_PARAM_NAMES.filter(
    (filterParamName) => !isNil(criteria[filterParamName as SearchCriteriaAttributeKeys])
  )

  if (availableWaysToBuyFilterParamNames.length > 0) {
    return availableWaysToBuyFilterParamNames.map((filterParamName) => ({
      displayText: defautFilterParamByName[filterParamName].displayText,
      paramValue: criteria[filterParamName as SearchCriteriaAttributeKeys]!,
      paramName: filterParamName,
    }))
  }

  return null
}

export const convertMajorPeriodToFilterParam = (criteria: SearchCriteriaAttributes): FilterData | null => {
  const periods = criteria[FilterParamName.timePeriod]

  if (Array.isArray(periods) && periods.length > 0) {
    const namedPeriods = periods.map((period) => getDisplayNameForTimePeriod(period))

    return {
      displayText: namedPeriods.join(", "),
      paramValue: periods,
      paramName: FilterParamName.timePeriod,
    }
  }

  return null
}

export const convertSavedSearchCriteriaToFilterParams = (
  criteria: SearchCriteriaAttributes,
  aggregations: Aggregations
): FilterData[] => {
  let filterParams: FilterData[] = []
  const aggregationByFilterParamName = keyBy(aggregations, (aggregation) => filterKeyFromAggregation[aggregation.slice])
  const aggregationValueByFilterParamName = mapValues(
    aggregationByFilterParamName,
    "counts"
  ) as AggregationByFilterParamName

  const converters = [
    convertPriceToFilterParam,
    convertSizeToFilterParams,
    convertColorsToFilterParam,
    convertAttributionToFilterParam,
    convertWaysToBuyToFilterParams,
    convertMajorPeriodToFilterParam,
  ]

  converters.forEach((converter) => {
    const filterParamItem = converter(criteria, aggregationValueByFilterParamName)

    if (filterParamItem) {
      filterParams = filterParams.concat(filterParamItem)
    }
  })

  // Extract value names from aggregation
  shouldExtractValueNamesFromAggregation.forEach((filterParamName) => {
    const aggregationValue = aggregationValueByFilterParamName[filterParamName]
    const criteriaValue = criteria[filterParamName as SearchCriteriaAttributeKeys] as string[]

    if (aggregationValue) {
      const filterParamItem = convertAggregationValueNamesToFilterParam(
        filterParamName,
        aggregationValue,
        criteriaValue
      )

      if (filterParamItem) {
        filterParams = filterParams.concat(filterParamItem)
      }
    }
  })

  return filterParams
}
