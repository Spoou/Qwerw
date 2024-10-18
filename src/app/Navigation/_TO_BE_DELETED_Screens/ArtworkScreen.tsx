import { Button, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { AuthenticatedRoutesParams } from "app/Navigation/AuthenticatedRoutes/Tabs"

export const ArtworkScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<AuthenticatedRoutesParams>>()

  return (
    <Flex justifyContent="center" alignItems="center" flex={1}>
      <Text variant="lg-display">Artwork Screen</Text>

      <Spacer y={2} />

      <Button
        onPress={() => {
          navigation.goBack()
        }}
      >
        Go back to Home
      </Button>
    </Flex>
  )
}
