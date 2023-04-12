import { stringify } from "querystring"
import { ArtsyKeyboardAvoidingView, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { ArtistAutosuggest } from "app/Components/ArtistAutosuggest/ArtistAutosuggest"
import { ArtworkFilterNavigationStack } from "app/Components/ArtworkFilter"
import { FilterDisplayName } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworkFilterOptionItem } from "app/Components/ArtworkFilter/components/ArtworkFilterOptionItem"
import { Button } from "app/Components/Button"
import { useToast } from "app/Components/Toast/toastHook"
import {
  ALLOWED_FILTERS,
  filterSearchFilters,
  paramsToSnakeCase,
} from "app/Scenes/PriceDatabase/utils/helpers"
import { PriceDatabaseSearchModel } from "app/Scenes/PriceDatabase/validation"
import { navigate } from "app/system/navigation/navigate"
import { useFormikContext } from "formik"

export const PriceDatabaseSearch: React.FC<StackScreenProps<ArtworkFilterNavigationStack>> = ({
  navigation,
}) => {
  const toast = useToast()

  const { values, isValid } = useFormikContext<PriceDatabaseSearchModel>()

  const handleSearch = () => {
    if (!values.artistId) {
      console.error("No Artist selected.")
      toast.show("Please select an artist.", "top", {
        backgroundColor: "red100",
      })

      return
    }

    const pathName = `/artist/${values.artistId}/auction-results`
    const searchFilters = filterSearchFilters(values, ALLOWED_FILTERS)
    const queryString = stringify(paramsToSnakeCase(searchFilters))
    const paramFlag = "scroll_to_market_signals=true"

    const url = queryString ? `${pathName}?${queryString}&${paramFlag}` : `${pathName}?${paramFlag}`

    navigate(url)
  }

  return (
    <ArtsyKeyboardAvoidingView>
      <Flex my={2}>
        <Flex mx={2} mb={2}>
          <Text variant="xl">Artsy Price</Text>
          <Text variant="xl" mb={0.5}>
            Database
          </Text>

          <Text variant="xs">
            Unlimited access to millions of auction results and art market data — for free.
          </Text>

          <Spacer y={4} />

          <ArtistAutosuggest title={null} placeholder="Search by artist name" />
        </Flex>

        <ArtworkFilterOptionItem
          item={{
            displayText: FilterDisplayName.medium,
            filterType: "medium",
            ScreenComponent: "MediumOptionsScreen",
          }}
          onPress={() => {
            navigation.navigate("MediumOptionsScreen")
          }}
        />

        <ArtworkFilterOptionItem
          item={{
            displayText: FilterDisplayName.sizes,
            filterType: "sizes",
            ScreenComponent: "SizesOptionsScreen",
          }}
          onPress={() => {
            navigation.navigate("SizesOptionsScreen")
          }}
        />

        <Spacer y={2} />

        <Flex mx={2}>
          <Button disabled={!isValid} width="100%" maxWidth="440px" onPress={handleSearch} block>
            Search
          </Button>
        </Flex>
      </Flex>
    </ArtsyKeyboardAvoidingView>
  )
}
