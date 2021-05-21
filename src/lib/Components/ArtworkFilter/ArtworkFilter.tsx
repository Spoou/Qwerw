import { ActionType, ContextModule } from "@artsy/cohesion"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import {
  changedFiltersParams,
  FilterArray,
  filterArtworksParams,
  FilterParams,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { AdditionalGeneIDsOptionsScreen } from "lib/Components/ArtworkFilter/Filters/AdditionalGeneIDsOptions"
import { ArtistIDsOptionsScreen } from "lib/Components/ArtworkFilter/Filters/ArtistIDsOptionsScreen"
import { ArtistNationalitiesOptionsScreen } from "lib/Components/ArtworkFilter/Filters/ArtistNationalitiesOptions"
import { AttributionClassOptionsScreen } from "lib/Components/ArtworkFilter/Filters/AttributionClassOptions"
import { CategoriesOptionsScreen } from "lib/Components/ArtworkFilter/Filters/CategoriesOptions"
import { ColorsOptionsScreen } from "lib/Components/ArtworkFilter/Filters/ColorsOptions"
import { EstimateRangeOptionsScreen } from "lib/Components/ArtworkFilter/Filters/EstimateRangeOptions"
import { GalleriesAndInstitutionsOptionsScreen } from "lib/Components/ArtworkFilter/Filters/GalleriesAndInstitutionsOptions"
import { MaterialsTermsOptionsScreen } from "lib/Components/ArtworkFilter/Filters/MaterialsTermsOptions"
import { MediumOptionsScreen } from "lib/Components/ArtworkFilter/Filters/MediumOptions"
import { PriceRangeOptionsScreen } from "lib/Components/ArtworkFilter/Filters/PriceRangeOptions"
import { SizeOptionsScreen } from "lib/Components/ArtworkFilter/Filters/SizeOptions"
import { SizesOptionsScreen } from "lib/Components/ArtworkFilter/Filters/SizesOptions"
import { SortOptionsScreen } from "lib/Components/ArtworkFilter/Filters/SortOptions"
import { TimePeriodOptionsScreen } from "lib/Components/ArtworkFilter/Filters/TimePeriodOptions"
import { ViewAsOptionsScreen } from "lib/Components/ArtworkFilter/Filters/ViewAsOptions"
import { WaysToBuyOptionsScreen } from "lib/Components/ArtworkFilter/Filters/WaysToBuyOptions"
import { YearOptionsScreen } from "lib/Components/ArtworkFilter/Filters/YearOptions"
import { OwnerEntityTypes, PageNames } from "lib/utils/track/schema"
import _ from "lodash"
import { Box, Button, Separator } from "palette"
import React from "react"
import { View, ViewProps } from "react-native"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { FancyModal } from "../FancyModal/FancyModal"
import { ArtworkFilterOptionsScreen, FilterModalMode as ArtworkFilterMode } from "./ArtworkFilterOptionsScreen"

interface ArtworkFilterProps extends ViewProps {
  closeModal?: () => void
  exitModal?: () => void
  id: string
  initiallyAppliedFilters?: FilterArray
  isFilterArtworksModalVisible: boolean
  mode: ArtworkFilterMode
  slug: string
  title?: string
}

interface ArtworkFilterOptionsScreenParams {
  closeModal: () => void
  exitModal: () => void
  id: string
  initiallyAppliedFilters?: FilterArray
  mode: ArtworkFilterMode
  slug: string
  title?: string
}

// This needs to be a `type` rather than an `interface`
// see src/lib/Scenes/MyCollection/Screens/ArtworkFormModal/MyCollectionArtworkFormModal.tsx#L35
// tslint:disable-next-line:interface-over-type-literal
export type ArtworkFilterNavigationStack = {
  AdditionalGeneIDsOptionsScreen: undefined
  ArtistIDsOptionsScreen: undefined
  ArtistNationalitiesOptionsScreen: undefined
  AttributionClassOptionsScreen: undefined
  CategoriesOptionsScreen: undefined
  ColorOptionsScreen: undefined
  ColorsOptionsScreen: undefined
  EstimateRangeOptionsScreen: undefined
  FilterOptionsScreen: ArtworkFilterOptionsScreenParams
  GalleriesAndInstitutionsOptionsScreen: undefined
  MaterialsTermsOptionsScreen: undefined
  MediumOptionsScreen: undefined
  PriceRangeOptionsScreen: undefined
  SizeOptionsScreen: undefined
  SizesOptionsScreen: undefined
  SortOptionsScreen: undefined
  TimePeriodOptionsScreen: undefined
  ViewAsOptionsScreen: undefined
  WaysToBuyOptionsScreen: undefined
  YearOptionsScreen: undefined
}

const Stack = createStackNavigator<ArtworkFilterNavigationStack>()

export const ArtworkFilterNavigator: React.FC<ArtworkFilterProps> = (props) => {
  const tracking = useTracking()
  const { exitModal, id, mode, slug, closeModal } = props

  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const selectedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.selectedFilters)
  const previouslyAppliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.previouslyAppliedFilters)
  const filterTypeState = ArtworksFiltersStore.useStoreState((state) => state.filterType)

  const applyFiltersAction = ArtworksFiltersStore.useStoreActions((action) => action.applyFiltersAction)
  const resetFiltersAction = ArtworksFiltersStore.useStoreActions((action) => action.resetFiltersAction)

  const handleClosingModal = () => {
    resetFiltersAction()
    closeModal?.()
  }

  const applyFilters = () => {
    applyFiltersAction()
    exitModal?.()
  }

  const trackChangeFilters = ({
    actionType,
    changedParams,
    contextModule,
    currentParams,
    ownerEntity,
    screenName,
  }: {
    actionType: ActionType
    changedParams: any
    contextModule?: ContextModule
    currentParams: FilterParams
    ownerEntity: OwnerEntityTypes
    screenName: PageNames
  }) => {
    tracking.trackEvent({
      context_module: contextModule,
      context_screen: screenName,
      context_screen_owner_type: ownerEntity,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      current: JSON.stringify(currentParams),
      changed: JSON.stringify(changedParams),
      action_type: actionType,
    })
  }

  const isApplyButtonEnabled =
    selectedFiltersState.length > 0 || (previouslyAppliedFiltersState.length === 0 && appliedFiltersState.length > 0)

  return (
    <NavigationContainer independent>
      <FancyModal visible={props.isFilterArtworksModalVisible} onBackgroundPressed={handleClosingModal}>
        <View style={{ flex: 1 }}>
          <Stack.Navigator
            // force it to not use react-native-screens, which is broken inside a react-native Modal for some reason
            detachInactiveScreens={false}
            screenOptions={{
              ...TransitionPresets.SlideFromRightIOS,
              headerShown: false,
              safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
              cardStyle: { backgroundColor: "white" },
            }}
          >
            <Stack.Screen name="FilterOptionsScreen" component={ArtworkFilterOptionsScreen} initialParams={props} />
            <Stack.Screen name="ArtistIDsOptionsScreen" component={ArtistIDsOptionsScreen} />
            <Stack.Screen name="AttributionClassOptionsScreen" component={AttributionClassOptionsScreen} />
            <Stack.Screen name="ColorsOptionsScreen" component={ColorsOptionsScreen} />
            <Stack.Screen name="EstimateRangeOptionsScreen" component={EstimateRangeOptionsScreen} />
            <Stack.Screen
              name="GalleriesAndInstitutionsOptionsScreen"
              component={GalleriesAndInstitutionsOptionsScreen}
            />
            <Stack.Screen name="AdditionalGeneIDsOptionsScreen" component={AdditionalGeneIDsOptionsScreen} />
            <Stack.Screen name="MediumOptionsScreen" component={MediumOptionsScreen} />
            <Stack.Screen name="PriceRangeOptionsScreen" component={PriceRangeOptionsScreen} />
            <Stack.Screen name="SizeOptionsScreen" component={SizeOptionsScreen} />
            <Stack.Screen name="SizesOptionsScreen" component={SizesOptionsScreen} />
            <Stack.Screen name="SortOptionsScreen" component={SortOptionsScreen} />
            <Stack.Screen name="TimePeriodOptionsScreen" component={TimePeriodOptionsScreen} />
            <Stack.Screen name="ViewAsOptionsScreen" component={ViewAsOptionsScreen} />
            <Stack.Screen
              name="YearOptionsScreen"
              component={YearOptionsScreen}
              options={{
                // Avoid PanResponser conflicts between the slider and the slide back gesture
                gestureEnabled: false,
              }}
            />
            <Stack.Screen name="WaysToBuyOptionsScreen" component={WaysToBuyOptionsScreen} />
            <Stack.Screen name="CategoriesOptionsScreen" component={CategoriesOptionsScreen} />
            <Stack.Screen name="MaterialsTermsOptionsScreen" component={MaterialsTermsOptionsScreen} />
            <Stack.Screen name="ArtistNationalitiesOptionsScreen" component={ArtistNationalitiesOptionsScreen} />
          </Stack.Navigator>

          <Separator my={0} />

          <ApplyButtonContainer>
            <ApplyButton
              disabled={!isApplyButtonEnabled}
              onPress={() => {
                const appliedFiltersParams = filterArtworksParams(appliedFiltersState, filterTypeState)
                // TODO: Update to use cohesion
                switch (mode) {
                  case ArtworkFilterMode.Collection:
                    trackChangeFilters({
                      actionType: ActionType.commercialFilterParamsChanged,
                      screenName: PageNames.Collection,
                      ownerEntity: OwnerEntityTypes.Collection,
                      currentParams: appliedFiltersParams,
                      changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
                    })
                    break
                  case ArtworkFilterMode.ArtistArtworks:
                    trackChangeFilters({
                      actionType: ActionType.commercialFilterParamsChanged,
                      screenName: PageNames.ArtistPage,
                      ownerEntity: OwnerEntityTypes.Artist,
                      currentParams: appliedFiltersParams,
                      changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
                    })
                    break
                  case ArtworkFilterMode.Fair:
                    trackChangeFilters({
                      actionType: ActionType.commercialFilterParamsChanged,
                      screenName: PageNames.FairPage,
                      ownerEntity: OwnerEntityTypes.Fair,
                      currentParams: appliedFiltersParams,
                      changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
                    })
                    break
                  case ArtworkFilterMode.SaleArtworks:
                    trackChangeFilters({
                      actionType: ActionType.commercialFilterParamsChanged,
                      screenName: PageNames.Auction,
                      ownerEntity: OwnerEntityTypes.Auction,
                      currentParams: appliedFiltersParams,
                      changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
                    })
                    break
                  case ArtworkFilterMode.Show:
                    trackChangeFilters({
                      actionType: ActionType.commercialFilterParamsChanged,
                      screenName: PageNames.ShowPage,
                      ownerEntity: OwnerEntityTypes.Show,
                      currentParams: appliedFiltersParams,
                      changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
                    })
                    break
                  case ArtworkFilterMode.AuctionResults:
                    trackChangeFilters({
                      actionType: ActionType.auctionResultsFilterParamsChanged,
                      screenName: PageNames.ArtistPage,
                      ownerEntity: OwnerEntityTypes.Artist,
                      currentParams: appliedFiltersParams,
                      changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
                      contextModule: ContextModule.auctionResults,
                    })
                    break
                  case ArtworkFilterMode.Partner:
                    trackChangeFilters({
                      actionType: ActionType.commercialFilterParamsChanged,
                      screenName: PageNames.PartnerPage,
                      ownerEntity: OwnerEntityTypes.Partner,
                      currentParams: appliedFiltersParams,
                      changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
                    })
                    break
                  case ArtworkFilterMode.ArtistSeries:
                    trackChangeFilters({
                      actionType: ActionType.commercialFilterParamsChanged,
                      screenName: PageNames.ArtistSeriesPage,
                      ownerEntity: OwnerEntityTypes.ArtistSeries,
                      currentParams: appliedFiltersParams,
                      changedParams: changedFiltersParams(appliedFiltersParams, selectedFiltersState),
                    })
                    break
                }
                applyFilters()
              }}
              block
              width={100}
              variant="primaryBlack"
              size="large"
            >
              Show results
            </ApplyButton>
          </ApplyButtonContainer>
        </View>
      </FancyModal>
    </NavigationContainer>
  )
}

export const ApplyButton = styled(Button)``
export const ApplyButtonContainer = styled(Box)`
  padding: 20px;
  padding-bottom: 30px;
`
