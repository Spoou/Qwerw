import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { ArtQuizNavigationQuery } from "__generated__/ArtQuizNavigationQuery.graphql"
import { ArtQuizArtworks } from "app/Scenes/ArtQuiz/ArtQuizArtworks"
import { ArtQuizLoader } from "app/Scenes/ArtQuiz/ArtQuizLoader"
import { ArtQuizResults } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResults"
import { ArtQuizWelcome } from "app/Scenes/ArtQuiz/ArtQuizWelcome"
import { navigate } from "app/system/navigation/navigate"
import { Suspense, useEffect } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export type ArtQuizNavigationStack = {
  ArtQuizWelcome: undefined
  ArtQuizArtworks: undefined
  ArtQuizResults: undefined
}

export const StackNavigator = createStackNavigator<ArtQuizNavigationStack>()

const ArtQuiz: React.FC = () => {
  const queryResult = useLazyLoadQuery<ArtQuizNavigationQuery>(artQuizNavigationQuery, {}).me?.quiz
  const isQuizCompleted = !!queryResult?.completedAt

  useEffect(() => {
    if (isQuizCompleted) {
      navigate("/art-quiz/results")
    }
  }, [isQuizCompleted])

  return (
    <NavigationContainer independent>
      <StackNavigator.Navigator
        screenOptions={{
          ...TransitionPresets.DefaultTransition,
          headerShown: false,
          headerMode: "screen",
          gestureEnabled: false,
        }}
      >
        <StackNavigator.Screen name="ArtQuizWelcome" component={ArtQuizWelcome} />
        <StackNavigator.Screen name="ArtQuizArtworks" component={ArtQuizArtworks} />
        <StackNavigator.Screen name="ArtQuizResults" component={ArtQuizResults} />
      </StackNavigator.Navigator>
    </NavigationContainer>
  )
}

export const ArtQuizNavigation = () => {
  return (
    <Suspense fallback={<ArtQuizLoader />}>
      <ArtQuiz />
    </Suspense>
  )
}

const artQuizNavigationQuery = graphql`
  query ArtQuizNavigationQuery {
    me {
      quiz {
        completedAt
      }
    }
  }
`
