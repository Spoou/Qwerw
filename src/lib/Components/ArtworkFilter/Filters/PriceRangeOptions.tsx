import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "lib/Components/ArtworkFilter"
import {
  AggregateOption,
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore, useSelectedOptionsDisplay } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { Input } from "lib/Components/Input/Input"
import { Flex, Text } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { parsePriceRangeLabel, parseRange, Range } from "./helpers"
import { SingleSelectOptionScreen } from "./SingleSelectOption"

interface PriceRangeOptionsScreenProps
  extends StackScreenProps<ArtworkFilterNavigationStack, "PriceRangeOptionsScreen"> {}

const PARAM_NAME = FilterParamName.priceRange

const PRICE_RANGE_OPTIONS: FilterData[] = [
  { displayText: "$50,000+", paramValue: "50000-*", paramName: PARAM_NAME },
  { displayText: "$10,000–50,000", paramValue: "10000-50000", paramName: PARAM_NAME },
  { displayText: "$5,000–10,000", paramValue: "5000-10000", paramName: PARAM_NAME },
  { displayText: "$1,000–5,000", paramValue: "1000-5000", paramName: PARAM_NAME },
  { displayText: "$0–1,000", paramValue: "*-1000", paramName: PARAM_NAME },
]

interface CustomPriceInputProps {
  initialValue: Range
  onChange(value: Range): void
}

export const CustomPriceInput: React.FC<CustomPriceInputProps> = ({
  initialValue = { min: "*", max: "*" },
  onChange,
}) => {
  const isMounted = useRef(false)
  const [state, setState] = useState<Range>(initialValue)

  const handleChange = (key: "min" | "max") => (text: string) => {
    const parsed = parseInt(text, 10)
    const value = isNaN(parsed) ? "*" : parsed
    setState((prevState) => ({ ...prevState, [key]: value }))
  }

  useEffect(() => {
    // Ignore initial mount
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    onChange(state)
  }, [state])

  return (
    <Flex flexDirection="row" alignItems="center" mt={2} mb={1} mx={2}>
      <Input
        placeholder="$ USD minimum"
        defaultValue={state.min === "*" || state.min === 0 ? undefined : String(state.min)}
        keyboardType="number-pad"
        onChangeText={handleChange("min")}
        autoFocus
      />

      <Text mx={2}>to</Text>

      <Input
        placeholder="$ USD maximum"
        defaultValue={state.max === "*" ? undefined : String(state.max)}
        keyboardType="number-pad"
        onChangeText={handleChange("max")}
      />
    </Flex>
  )
}

export const PriceRangeOptionsScreen: React.FC<PriceRangeOptionsScreenProps> = ({ navigation }) => {
  const selectFiltersAction = ArtworksFiltersStore.useStoreActions((state) => state.selectFiltersAction)

  const selectedOptions = useSelectedOptionsDisplay()
  const selectedOption = selectedOptions.find((option) => option.paramName === PARAM_NAME)!

  const selectOption = (option: AggregateOption) => {
    selectFiltersAction({
      displayText: option.displayText,
      paramValue: option.paramValue,
      paramName: PARAM_NAME,
    })
  }

  const handleCustomPriceChange = (value: Range) => {
    selectFiltersAction({
      displayText: parsePriceRangeLabel(value.min, value.max),
      paramValue: `${value.min}-${value.max}`,
      paramName: PARAM_NAME,
    })
  }

  return (
    <SingleSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.priceRange}
      useScrollView={true}
      filterOptions={[
        <CustomPriceInput
          initialValue={parseRange(selectedOption.paramValue as string)}
          onChange={handleCustomPriceChange}
        />,
        ...PRICE_RANGE_OPTIONS,
      ]}
      selectedOption={selectedOption}
      navigation={navigation}
    />
  )
}
