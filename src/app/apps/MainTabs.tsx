import { Flex, Text } from "@artsy/palette-mobile"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { SearchTab } from "app/apps/Search/SearchTab"

export type BottomTabParamList = {
  HomeTab: undefined
  SearchTab: undefined
  InboxTab: undefined
  SellTab: undefined
  ProfileTab: undefined
}

// TODO: Why is bundler/metro so unhappy about putting a top-level apps folder
const Tab = createBottomTabNavigator<BottomTabParamList>()

const HomeTab = () => (
  <Flex style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Home</Text>
  </Flex>
)

const InboxTab = () => (
  <Flex style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Inbox</Text>
  </Flex>
)

const SellTab = () => (
  <Flex style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Sell</Text>
  </Flex>
)

const ProfileTab = () => (
  <Flex style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Profile</Text>
  </Flex>
)

export const MainTabs = () => {
  return (
    <Tab.Navigator initialRouteName="SearchTab" screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={HomeTab} />
      <Tab.Screen name="SearchTab" component={SearchTab} />
      <Tab.Screen name="InboxTab" component={InboxTab} />
      <Tab.Screen name="SellTab" component={SellTab} />
      <Tab.Screen name="ProfileTab" component={ProfileTab} />
    </Tab.Navigator>
  )
}