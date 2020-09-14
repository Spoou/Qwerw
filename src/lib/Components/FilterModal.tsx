import {
  changedFiltersParams,
  filterArtworksParams,
  FilterDisplayName,
  FilterParamName,
  FilterParams,
} from "lib/Scenes/Collection/Helpers/FilterArtworksHelpers"
import { Schema } from "lib/utils/track"
import { OwnerEntityTypes, PageNames } from "lib/utils/track/schema"
import _ from "lodash"
import { ArrowRightIcon, Box, Button, CloseIcon, color, FilterIcon, Flex, Sans, Separator } from "palette"
import React, { useContext } from "react"
import { FlatList, TouchableOpacity, View, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import {
  AggregationName,
  Aggregations,
  ArtworkFilterContext,
  FilterData,
  useSelectedOptionsDisplay,
} from "../utils/ArtworkFiltersStore"
import { AnimatedBottomButton } from "./AnimatedBottomButton"
import { ColorOption, ColorOptionsScreen } from "./ArtworkFilterOptions/ColorOptions"
import { colorHexMap } from "./ArtworkFilterOptions/ColorSwatch"
import { GalleryOptionsScreen } from "./ArtworkFilterOptions/GalleryOptions"
import { InstitutionOptionsScreen } from "./ArtworkFilterOptions/InstitutionOptions"
import { MediumOptionsScreen } from "./ArtworkFilterOptions/MediumOptions"
import { PriceRangeOptionsScreen } from "./ArtworkFilterOptions/PriceRangeOptions"
import { SizeOptionsScreen } from "./ArtworkFilterOptions/SizeOptions"
import { SortOptionsScreen } from "./ArtworkFilterOptions/SortOptions"
import { TimePeriodOptionsScreen } from "./ArtworkFilterOptions/TimePeriodOptions"
import { WaysToBuyOptionsScreen } from "./ArtworkFilterOptions/WaysToBuyOptions"
import { FancyModal } from "./FancyModal/FancyModal"

interface FilterModalProps extends ViewProperties {
  closeModal?: () => void
  exitModal?: () => void
  navigator?: NavigatorIOS
  isFilterArtworksModalVisible: boolean
  id: string
  slug: string
  mode: FilterModalMode
}

export const FilterModalNavigator: React.SFC<FilterModalProps> = (props) => {
  const tracking = useTracking()

  const { closeModal, exitModal, isFilterArtworksModalVisible, id, slug, mode } = props
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const handleClosingModal = () => {
    dispatch({ type: "resetFilters" })
    closeModal?.()
  }

  const applyFilters = () => {
    dispatch({ type: "applyFilters" })
    exitModal?.()
  }

  const trackChangeFilters = (
    screenName: PageNames,
    ownerEntity: OwnerEntityTypes,
    currentParams: FilterParams,
    changedParams: any
  ) => {
    tracking.trackEvent({
      context_screen: screenName,
      context_screen_owner_type: ownerEntity,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      current: currentParams,
      changed: changedParams,
      action_type: Schema.ActionTypes.ChangeFilterParams,
    })
  }

  const getApplyButtonCount = () => {
    const selectedFiltersSum = state.selectedFilters.length

    return selectedFiltersSum > 0 ? `Apply (${selectedFiltersSum})` : "Apply"
  }

  const isApplyButtonEnabled =
    state.selectedFilters.length > 0 || (state.previouslyAppliedFilters.length === 0 && state.appliedFilters.length > 0)

  return (
    <FancyModal visible={isFilterArtworksModalVisible} onBackgroundPressed={handleClosingModal} maxHeight={550}>
      <View style={{ flex: 1 }}>
        <NavigatorIOS
          navigationBarHidden={true}
          initialRoute={{
            component: FilterOptions,
            passProps: { closeModal, id, slug, mode },
            title: "",
          }}
          style={{ flex: 1 }}
        />
        <ApplyButtonContainer>
          <ApplyButton
            disabled={!isApplyButtonEnabled}
            onPress={() => {
              const appliedFiltersParams = filterArtworksParams(state.appliedFilters)
              // TODO: Update to use cohesion
              switch (mode) {
                case "Collection":
                  trackChangeFilters(
                    PageNames.Collection,
                    OwnerEntityTypes.Collection,
                    appliedFiltersParams,
                    changedFiltersParams(appliedFiltersParams, state.selectedFilters)
                  )
                  break
                case "ArtistArtworks":
                  trackChangeFilters(
                    PageNames.ArtistPage,
                    OwnerEntityTypes.Artist,
                    appliedFiltersParams,
                    changedFiltersParams(appliedFiltersParams, state.selectedFilters)
                  )
                  break
              }
              applyFilters()
            }}
            block
            width={100}
            variant="primaryBlack"
            size="large"
          >
            {getApplyButtonCount()}
          </ApplyButton>
        </ApplyButtonContainer>
      </View>
    </FancyModal>
  )
}

type FilterScreen =
  | "sort"
  | "waysToBuy"
  | "medium"
  | "priceRange"
  | "majorPeriods"
  | "dimensionRange"
  | "color"
  | "gallery"
  | "institution"

export interface FilterDisplayConfig {
  filterType: FilterScreen
  displayText: string
  ScreenComponent: React.SFC<any>
}

export enum FilterModalMode {
  Collection = "Collection",
  ArtistArtworks = "ArtistArtworks",
}

interface FilterOptionsProps {
  closeModal: () => void
  navigator: NavigatorIOS
  id: string
  slug: string
  mode: FilterModalMode
}

export const FilterOptions: React.SFC<FilterOptionsProps> = (props) => {
  const tracking = useTracking()
  const { closeModal, navigator, id, slug, mode } = props

  const { dispatch, state } = useContext(ArtworkFilterContext)

  const navigateToNextFilterScreen = (NextComponent: any /* STRICTNESS_MIGRATION */) => {
    navigator.push({
      component: NextComponent,
    })
  }

  const concreteAggregations = state.aggregations ?? []
  const aggregateFilterOptions: FilterDisplayConfig[] = _.compact(
    concreteAggregations.map((aggregation) => {
      const filterOption = filterKeyFromAggregation[aggregation.slice]
      return filterOption ? filterOptionToDisplayConfigMap[filterOption] : null
    })
  )

  const staticFilterOptions: FilterDisplayConfig[] = [
    filterOptionToDisplayConfigMap.sort,
    filterOptionToDisplayConfigMap.waysToBuy,
  ]

  const filterScreenSort = (left: FilterDisplayConfig, right: FilterDisplayConfig): number => {
    let sortOrder: FilterScreen[] = []

    // Filter order is based on frequency of use for a given page
    switch (mode) {
      case "Collection":
        sortOrder = [
          "sort",
          "medium",
          "priceRange",
          "waysToBuy",
          "dimensionRange",
          "majorPeriods",
          "color",
          "gallery",
          "institution",
        ]
        break
      case "ArtistArtworks":
        sortOrder = [
          "sort",
          "medium",
          "priceRange",
          "waysToBuy",
          "gallery",
          "institution",
          "dimensionRange",
          "majorPeriods",
          "color",
        ]
        break
    }

    const leftParam = left.filterType
    const rightParam = right.filterType
    if (sortOrder.indexOf(leftParam) < sortOrder.indexOf(rightParam)) {
      return -1
    } else {
      return 1
    }
  }

  const filterOptions: FilterDisplayConfig[] = staticFilterOptions.concat(aggregateFilterOptions)
  const sortedFilterOptions = filterOptions.sort(filterScreenSort)

  const clearAllFilters = () => {
    dispatch({ type: "clearAll" })
  }

  const trackClear = (screenName: PageNames, ownerEntity: OwnerEntityTypes) => {
    tracking.trackEvent({
      action_name: "clearFilters",
      context_screen: screenName,
      context_screen_owner_type: ownerEntity,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    })
  }

  const handleTappingCloseIcon = () => {
    closeModal()
  }

  const selectedOptions = useSelectedOptionsDisplay()
  const multiSelectedOptions = selectedOptions.filter((option) => option.paramValue === true)

  const selectedOption = (filterType: FilterScreen) => {
    if (filterType === "waysToBuy") {
      if (multiSelectedOptions.length === 0) {
        return "All"
      }
      return multiSelectionDisplay()
    } else if (filterType === "gallery" || filterType === "institution") {
      const displayText = selectedOptions.find((option) => option.filterKey === filterType)?.displayText
      if (displayText) {
        return displayText
      } else {
        return "All"
      }
    }
    return selectedOptions.find((option) => option.paramName === filterType)?.displayText
  }

  const multiSelectionDisplay = (): string => {
    const displayTexts: string[] = []
    multiSelectedOptions.forEach((f: FilterData) => {
      displayTexts.push(f.displayText)
    })
    return displayTexts.join(", ")
  }

  return (
    <Flex style={{ flex: 1 }}>
      <Flex flexGrow={0} flexDirection="row" justifyContent="space-between">
        <Flex alignItems="flex-end" mt={0.5} mb={2}>
          <CloseIconContainer hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={handleTappingCloseIcon}>
            <CloseIcon fill="black100" />
          </CloseIconContainer>
        </Flex>
        <Sans size="4" weight="medium" style={{ alignSelf: "center" }}>
          Filter
        </Sans>
        <ClearAllButton
          onPress={() => {
            switch (mode) {
              case "Collection":
                trackClear(PageNames.Collection, OwnerEntityTypes.Collection)
                break
              case "ArtistArtworks":
                trackClear(PageNames.ArtistPage, OwnerEntityTypes.Artist)
                break
            }

            clearAllFilters()
          }}
        >
          <Sans mr={2} mt={2} size="4" color="black100">
            Clear all
          </Sans>
        </ClearAllButton>
      </Flex>
      <Separator />
      <FlatList<FilterDisplayConfig>
        keyExtractor={(_item, index) => String(index)}
        data={sortedFilterOptions}
        style={{ flexGrow: 1 }}
        renderItem={({ item }) => {
          return (
            <Box>
              <TouchableOptionListItemRow onPress={() => navigateToNextFilterScreen(item.ScreenComponent)}>
                <OptionListItem>
                  <Flex p={2} pr="15px" flexDirection="row" justifyContent="space-between" flexGrow={1}>
                    <Sans size="3t" color="black100">
                      {item.displayText}
                    </Sans>
                    <Flex flexDirection="row" alignItems="center">
                      <OptionDetail currentOption={selectedOption(item.filterType)} filterType={item.filterType} />
                      <ArrowRightIcon fill="black30" ml="1" />
                    </Flex>
                  </Flex>
                </OptionListItem>
              </TouchableOptionListItemRow>
            </Box>
          )
        }}
      />
    </Flex>
  )
}

const OptionDetail: React.FC<{ currentOption: any; filterType: any }> = ({ currentOption, filterType }) => {
  if (filterType === FilterParamName.color && currentOption !== "All") {
    return <ColorSwatch colorOption={currentOption} />
  } else {
    return <CurrentOption size="3t">{currentOption}</CurrentOption>
  }
}

const ColorSwatch: React.FC<{ colorOption: ColorOption }> = ({ colorOption }) => {
  return (
    <Box
      mr={0.3}
      style={{
        alignSelf: "center",
        width: 10,
        height: 10,
        borderRadius: 10 / 2,
        backgroundColor: colorHexMap[colorOption],
      }}
    />
  )
}

export const FilterHeader = styled(Sans)`
  margin-top: 20px;
  padding-left: 35px;
`

export const FilterArtworkButton = styled(Flex)`
  border-radius: 20;
  background-color: ${color("black100")};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.12);
`

export const AnimatedArtworkFilterButton: React.FC<{ count: number; isVisible: boolean; onPress: () => void }> = ({
  count,
  isVisible,
  onPress,
}) => (
  <AnimatedBottomButton isVisible={isVisible} onPress={onPress}>
    <FilterArtworkButton px="2">
      <FilterIcon fill="white100" />
      <Sans size="3t" pl="1" py="1" color="white100" weight="medium">
        Filter
      </Sans>
      {count > 0 && (
        <>
          <Sans size="3t" pl={0.5} py="1" color="white100" weight="medium">
            {"\u2022"}
          </Sans>
          <Sans size="3t" pl={0.5} py="1" color="white100" weight="medium">
            {count}
          </Sans>
        </>
      )}
    </FilterArtworkButton>
  </AnimatedBottomButton>
)

export const TouchableOptionListItemRow = styled(TouchableOpacity)``

export const CloseIconContainer = styled(TouchableOpacity)`
  margin: 20px 0px 0px 20px;
`

export const OptionListItem = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  border: solid 0.5px ${color("black10")};
  border-right-width: 0;
  border-top-width: 0;
  border-left-width: 0;
`

export const CurrentOption = styled(Sans)`
  color: ${color("black60")};
`
export const ClearAllButton = styled(TouchableOpacity)``
export const ApplyButton = styled(Button)``
export const ApplyButtonContainer = styled(Box)`
  padding: 20px;
  padding-bottom: 30px;
  border: solid 0.5px ${color("black10")};
  border-right-width: 0;
  border-left-width: 0;
`

const filterKeyFromAggregation: Record<AggregationName, FilterParamName | string | undefined> = {
  COLOR: FilterParamName.color,
  DIMENSION_RANGE: FilterParamName.size,
  GALLERY: "gallery",
  INSTITUTION: "institution",
  MAJOR_PERIOD: FilterParamName.timePeriod,
  MEDIUM: FilterParamName.medium,
  PRICE_RANGE: FilterParamName.priceRange,
}

// For most cases filter key can simply be FilterParamName, exception
// is gallery and institution which share a paramName in metaphysics
export const aggregationNameFromFilter: Record<string, AggregationName | undefined> = {
  gallery: "GALLERY",
  institution: "INSTITUTION",
  color: "COLOR",
  dimensionRange: "DIMENSION_RANGE",
  majorPeriods: "MAJOR_PERIOD",
  medium: "MEDIUM",
  priceRange: "PRICE_RANGE",
}

export const aggregationForFilter = (filterKey: string, aggregations: Aggregations) => {
  const aggregationName = aggregationNameFromFilter[filterKey]
  const aggregation = aggregations!.find((value) => value.slice === aggregationName)
  return aggregation
}

const filterOptionToDisplayConfigMap: Record<string, FilterDisplayConfig> = {
  sort: {
    displayText: FilterDisplayName.sort,
    filterType: "sort",
    ScreenComponent: SortOptionsScreen,
  },
  medium: {
    displayText: FilterDisplayName.medium,
    filterType: "medium",
    ScreenComponent: MediumOptionsScreen,
  },
  priceRange: {
    displayText: FilterDisplayName.priceRange,
    filterType: "priceRange",
    ScreenComponent: PriceRangeOptionsScreen,
  },
  waysToBuy: {
    displayText: FilterDisplayName.waysToBuy,
    filterType: "waysToBuy",
    ScreenComponent: WaysToBuyOptionsScreen,
  },
  dimensionRange: {
    displayText: FilterDisplayName.size,
    filterType: "dimensionRange",
    ScreenComponent: SizeOptionsScreen,
  },
  color: {
    displayText: FilterDisplayName.color,
    filterType: "color",
    ScreenComponent: ColorOptionsScreen,
  },
  majorPeriods: {
    displayText: FilterDisplayName.timePeriod,
    filterType: "majorPeriods",
    ScreenComponent: TimePeriodOptionsScreen,
  },
  institution: {
    displayText: FilterDisplayName.institution,
    filterType: "institution",
    ScreenComponent: InstitutionOptionsScreen,
  },
  gallery: {
    displayText: FilterDisplayName.gallery,
    filterType: "gallery",
    ScreenComponent: GalleryOptionsScreen,
  },
}
