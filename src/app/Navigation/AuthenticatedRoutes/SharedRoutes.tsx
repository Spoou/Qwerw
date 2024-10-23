import { useScreenDimensions } from "@artsy/palette-mobile"
import { AppModule, modules } from "app/AppRegistry"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { View } from "react-native"

export const SharedRoutes = (): JSX.Element => {
  return (
    <TabStackNavigator.Group>
      {Object.entries(modules).map(([moduleName, module]) => {
        if (module.type === "react" && module.Component && !module.options.isRootViewForTabName) {
          return (
            <TabStackNavigator.Screen
              key={moduleName}
              name={moduleName as AppModule}
              options={{
                presentation: module.options.alwaysPresentModally ? "fullScreenModal" : "card",
                ...module.options.screenOptions,
              }}
              children={(props) => {
                const params = props.route.params || {}
                return (
                  <ScreenWrapper fullBleed={module.options.fullBleed}>
                    <module.Component {...params} {...props} />
                  </ScreenWrapper>
                )
              }}
            />
          )
        }
        return null
      })}
    </TabStackNavigator.Group>
  )
}

export interface ScreenWrapperProps {
  fullBleed?: boolean
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ fullBleed, children }) => {
  const safeAreaInsets = useScreenDimensions().safeAreaInsets
  const paddingTop = fullBleed ? 0 : safeAreaInsets.top
  return <View style={{ flex: 1, paddingTop }}>{children}</View>
}
