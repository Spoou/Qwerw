import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { ReverseImageArtworkScreen } from "./Screens/Artwork/ReverseImageArtwork"
import { ReverseImageArtworkNotFoundScreen } from "./Screens/ArtworkNotFound/ReverseImageArtworkNotFoundScreen"
import { ReverseImageCameraScreen } from "./Screens/Camera/ReverseImageCamera"
import { ReverseImageMultipleResultsScreen } from "./Screens/MultipleResults/ReverseImageMultipleResults"
import { ReverseImageNavigationStack } from "./types"

const Stack = createStackNavigator<ReverseImageNavigationStack>()

export const ReverseImage = () => {
  return (
    <NavigationContainer independent>
      <Stack.Navigator
        initialRouteName="Camera"
        headerMode="screen"
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
          headerShown: false,
        }}
      >
        <Stack.Screen name="Camera" component={ReverseImageCameraScreen} />
        <Stack.Screen name="MultipleResults" component={ReverseImageMultipleResultsScreen} />
        <Stack.Screen name="ArtworkNotFound" component={ReverseImageArtworkNotFoundScreen} />
        <Stack.Screen name="Artwork" component={ReverseImageArtworkScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
