import { Box } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { SearchCriteriaAttributes } from "app/Components/ArtworkFilter/SavedSearch/types"
import { CreateSavedSearchAlertNavigationStack } from "app/Scenes/SavedSearchAlert/SavedSearchAlertModel"
import {
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { CreateSavedSearchAlertContentQueryRenderer } from "app/Scenes/SavedSearchAlert/containers/CreateSavedSearchContentContainer"

type Props = StackScreenProps<CreateSavedSearchAlertNavigationStack, "CreateSavedSearchAlert">

export const CreateSavedSearchAlertScreen: React.FC<Props> = (props) => {
  const { route, navigation } = props
  const { attributes, aggregations, entity, ...other } = route.params

  return (
    <SavedSearchStoreProvider
      runtimeModel={{
        ...savedSearchModel,
        attributes: attributes as SearchCriteriaAttributes,
        aggregations,
        entity,
      }}
    >
      <Box flex={1}>
        <CreateSavedSearchAlertContentQueryRenderer navigation={navigation} {...other} />
      </Box>
    </SavedSearchStoreProvider>
  )
}
