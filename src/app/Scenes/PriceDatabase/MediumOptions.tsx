import { StackScreenProps } from "@react-navigation/stack"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import {
  FilterData,
  FilterDisplayName,
  FilterParamName,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { MultiSelectOptionScreen } from "app/Components/ArtworkFilter/Filters/MultiSelectOption"
import { PriceDatabaseFormModel } from "app/Scenes/PriceDatabase/validation"
import { useFormikContext } from "formik"

type MediumOptionsScreenProps = StackScreenProps<
  ArtworkFilterNavigationStack,
  "MediumOptionsScreen"
>

export const MediumOptions: React.FC<MediumOptionsScreenProps> = ({ navigation }) => {
  const { values, setFieldValue } = useFormikContext<PriceDatabaseFormModel>()

  const selectOption = (option: FilterData) => {
    if (!values.categories.includes(option.paramValue as string)) {
      // Append the paramValue
      setFieldValue("categories", [...values.categories, option.paramValue])
    } else {
      // Remove the paramValue
      setFieldValue(
        "categories",
        values.categories.filter((value) => value !== option.paramValue)
      )
    }
  }

  return (
    <MultiSelectOptionScreen
      onSelect={selectOption}
      filterHeaderText={FilterDisplayName.categories}
      filterOptions={options}
      isSelected={(item) => values.categories.includes(item.paramValue as string)}
      navigation={navigation}
    />
  )
}

const options = [
  {
    displayText: "Painting",
    paramValue: "Painting",
    paramName: FilterParamName.categories,
  },
  {
    displayText: "Work on paper",
    paramValue: "Work on Paper",
    paramName: FilterParamName.categories,
  },
  {
    displayText: "Sculpture",
    paramValue: "Sculpture",
    paramName: FilterParamName.categories,
  },
  { displayText: "Print", paramValue: "Print", paramName: FilterParamName.categories },
  {
    displayText: "Photography",
    paramValue: "Photography",
    paramName: FilterParamName.categories,
  },
  {
    displayText: "Textile arts",
    paramValue: "Textile Arts",
    paramName: FilterParamName.categories,
  },
]
