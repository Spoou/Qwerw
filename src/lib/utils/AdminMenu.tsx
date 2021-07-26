import AsyncStorage from "@react-native-community/async-storage"
import * as Sentry from "@sentry/react-native"
import { MenuItem } from "lib/Components/MenuItem"
import { useToast } from "lib/Components/Toast/toastHook"
import { ArtsyNativeModule } from "lib/NativeModules/ArtsyNativeModule"
import { clearAll } from "lib/NativeModules/GraphQLQueryCache"
import { dismissModal, navigate } from "lib/navigation/navigate"
import { environment, EnvironmentKey } from "lib/store/config/EnvironmentModel"
import { DevToggleName, devToggles, FeatureName, features } from "lib/store/config/features"
import { GlobalStore } from "lib/store/GlobalStore"
import { capitalize, compact, sortBy } from "lodash"
import { ChevronIcon, CloseIcon, Flex, ReloadIcon, Separator, Spacer, Text, useColor } from "palette"
import React, { useEffect, useState } from "react"
import {
  Alert,
  AlertButton,
  BackHandler,
  DevSettings,
  Platform,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native"
import Config from "react-native-config"
import { getBuildNumber, getVersion } from "react-native-device-info"
import { useScreenDimensions } from "./useScreenDimensions"

export const ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY = "ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY"

const configurableFeatureFlagKeys = sortBy(
  Object.entries(features).filter(([_, { showInAdminMenu }]) => showInAdminMenu),
  ([k, { description }]) => description ?? k
).map(([k]) => k as FeatureName)

const configurableDevToggleKeys = sortBy(Object.entries(devToggles), ([k, { description }]) => description ?? k).map(
  ([k]) => k as DevToggleName
)

export const AdminMenu: React.FC<{ onClose(): void }> = ({ onClose = dismissModal }) => {
  useEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackButton)

      return () => BackHandler.removeEventListener("hardwareBackPress", handleBackButton)
    }, [])
  )
  const handleBackButton = () => {
    onClose()
    return true
  }

  return (
    <Flex
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "white",
      }}
      pb="2"
      pt={useScreenDimensions().safeAreaInsets.top + 20}
    >
      <Flex flexDirection="row" justifyContent="space-between">
        <Text variant="largeTitle" pb="2" px="2">
          Admin Settings
        </Text>
        <Buttons onClose={onClose} />
      </Flex>

      <ScrollView
        style={{ flex: 1, backgroundColor: "white", borderRadius: 4, overflow: "hidden" }}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        <Text variant="small" color="grey" mx="2">
          eigen v{getVersion()}, build {getBuildNumber()} ({ArtsyNativeModule.gitCommitShortHash})
        </Text>
        {Platform.OS === "ios" && (
          <>
            <MenuItem
              title="Go to old Admin menu"
              onPress={() => {
                navigate("/admin", { modal: true })
              }}
            />
            <Flex mx="2">
              <Separator my="1" />
            </Flex>
          </>
        )}
        <EnvironmentOptions onClose={onClose} />

        <Flex mx="2">
          <Separator my="1" />
        </Flex>

        <Text variant="title" my="1" mx="2">
          Feature Flags
        </Text>
        {configurableFeatureFlagKeys.map((flagKey) => {
          return <FeatureFlagItem key={flagKey} flagKey={flagKey} />
        })}
        {Platform.OS === "android" && (
          <FeatureFlagItemFromAsyncStorage
            flagKey={ASYNC_STORAGE_PUSH_NOTIFICATIONS_KEY}
            title={"Enable Push Notifications"}
          />
        )}
        <Flex mx="2">
          <Separator my="1" />
        </Flex>
        <Text variant="title" my="1" mx="2">
          Tools
        </Text>
        {configurableDevToggleKeys.map((devToggleKey) => {
          return <DevToggleItem key={devToggleKey} toggleKey={devToggleKey} />
        })}
        <MenuItem
          title="Clear AsyncStorage"
          chevron={null}
          onPress={() => {
            AsyncStorage.clear()
          }}
        />
        <MenuItem
          title="Clear Relay Cache"
          chevron={null}
          onPress={() => {
            clearAll()
          }}
        />
        <MenuItem
          title="Throw Sentry Error"
          onPress={() => {
            if (!Config.SENTRY_DSN) {
              Alert.alert(
                "No Sentry DSN available",
                __DEV__ ? "Set it in .env.shared and re-build the app." : undefined
              )
              return
            }
            throw Error("Sentry test error")
          }}
          chevron={null}
        />
        <MenuItem
          title="Trigger Sentry Native Crash"
          onPress={() => {
            if (!Config.SENTRY_DSN) {
              Alert.alert(
                "No Sentry DSN available",
                __DEV__ ? "Set it in .env.shared and re-build the app." : undefined
              )
              return
            }
            Sentry.nativeCrash()
          }}
          chevron={null}
        />
      </ScrollView>
    </Flex>
  )
}

const Buttons: React.FC<{ onClose(): void }> = ({ onClose }) => {
  return (
    <Flex style={{ flexDirection: "row", alignItems: "center" }} pb="2" px="2">
      {!!__DEV__ && (
        <>
          <TouchableOpacity
            onPress={() => {
              onClose()
              requestAnimationFrame(() => DevSettings.reload())
            }}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <ReloadIcon width={16} height={16} />
          </TouchableOpacity>
          <Spacer mr="2" />
        </>
      )}

      <TouchableOpacity onPress={onClose} hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CloseIcon />
      </TouchableOpacity>
    </Flex>
  )
}

const FeatureFlagItemFromAsyncStorage: React.FC<{ flagKey: string; title: string }> = ({ flagKey, title }) => {
  const [flagValue, setFlagValue] = useState<string>("")
  useEffect(() => {
    AsyncStorage.getItem(flagKey).then((value) => {
      if (value) {
        setFlagValue(value)
      }
    })
  }, [])
  return (
    <MenuItem
      title={title}
      onPress={() => {
        Alert.alert(title, "This change will take effect after reloading the App", [
          {
            text: "Override with 'Yes'",
            onPress() {
              AsyncStorage.setItem(flagKey, "true", (error) => {
                if (!error) {
                  setFlagValue("true")
                }
              })
            },
          },
          {
            text: "Override with 'No'",
            onPress() {
              AsyncStorage.setItem(flagKey, "false", (error) => {
                if (!error) {
                  setFlagValue("false")
                }
              })
            },
          },
        ])
      }}
      value={
        <Text variant="subtitle" color="black60">
          {flagValue}
        </Text>
      }
    />
  )
}

const FeatureFlagItem: React.FC<{ flagKey: FeatureName }> = ({ flagKey }) => {
  const config = GlobalStore.useAppState((s) => s.config)
  const currentValue = config.features.flags[flagKey]
  const isAdminOverrideInEffect = flagKey in config.features.adminOverrides
  const valText = currentValue ? "Yes" : "No"
  const description = features[flagKey].description ?? flagKey

  return (
    <MenuItem
      title={description}
      onPress={() => {
        Alert.alert(description, undefined, [
          {
            text: "Override with 'Yes'",
            onPress() {
              GlobalStore.actions.config.features.setAdminOverride({ key: flagKey, value: true })
              if (flagKey === "AREnableNewOnboardingFlow") {
                // this is a temporary solution to log out if user switched to new onboarding flow, it will be removed once we get rid of native onboarding (tag: AREnableNewOnboardingFlow)
                ;(async () => await GlobalStore.actions.signOut())()
              }
            },
          },
          {
            text: "Override with 'No'",
            onPress() {
              GlobalStore.actions.config.features.setAdminOverride({ key: flagKey, value: false })
              if (flagKey === "AREnableNewOnboardingFlow") {
                // this is a temporary solution to log out if user switched to new onboarding flow, it will be removed once we get rid of native onboarding (tag: AREnableNewOnboardingFlow)
                ;(async () => await GlobalStore.actions.signOut())()
              }
            },
          },
          {
            text: isAdminOverrideInEffect ? "Revert to default value" : "Keep default value",
            onPress() {
              GlobalStore.actions.config.features.setAdminOverride({ key: flagKey, value: null })
              if (flagKey === "AREnableNewOnboardingFlow" && isAdminOverrideInEffect) {
                // this is a temporary solution to log out if user switched to new onboarding flow, it will be removed once we get rid of native onboarding (tag: AREnableNewOnboardingFlow)
                ;(async () => await GlobalStore.actions.signOut())()
              }
            },
            style: "destructive",
          },
        ])
      }}
      value={
        isAdminOverrideInEffect ? (
          <Text variant="subtitle" color="black100" fontWeight="bold">
            {valText}
          </Text>
        ) : (
          <Text variant="subtitle" color="black60">
            {valText}
          </Text>
        )
      }
    />
  )
}

const DevToggleItem: React.FC<{ toggleKey: DevToggleName }> = ({ toggleKey }) => {
  const config = GlobalStore.useAppState((s) => s.config)
  const currentValue = config.features.devToggles[toggleKey]
  const valText = currentValue ? "Yes" : "No"
  const description = devToggles[toggleKey].description
  const toast = useToast()

  return (
    <MenuItem
      title={description}
      onPress={() => {
        Alert.alert(description, undefined, [
          {
            text: currentValue ? "Keep turned ON" : "Turn ON",
            onPress() {
              GlobalStore.actions.config.features.setAdminOverride({ key: toggleKey, value: true })
              devToggles[toggleKey].onChange?.(true, { toast })
            },
          },
          {
            text: currentValue ? "Turn OFF" : "Keep turned OFF",
            onPress() {
              GlobalStore.actions.config.features.setAdminOverride({ key: toggleKey, value: false })
              devToggles[toggleKey].onChange?.(false, { toast })
            },
          },
        ])
      }}
      value={
        currentValue ? (
          <Text variant="subtitle" color="black100" fontWeight="bold">
            {valText}
          </Text>
        ) : (
          <Text variant="subtitle" color="black60">
            {valText}
          </Text>
        )
      }
    />
  )
}

function envMenuOption(
  env: "staging" | "production",
  currentEnv: "staging" | "production",
  showCustomURLOptions: boolean,
  setShowCustomURLOptions: (newValue: boolean) => void,
  onClose: () => void
): AlertButton | null {
  let text = `Log out and switch to '${capitalize(env)}'`
  if (currentEnv === env) {
    if (!__DEV__) {
      return null
    }
    if (showCustomURLOptions) {
      text = `Reset all to '${capitalize(env)}'`
    } else {
      text = `Customize '${capitalize(env)}'`
    }
  }
  return {
    text,
    onPress() {
      GlobalStore.actions.config.environment.clearAdminOverrides()
      if (env !== currentEnv) {
        GlobalStore.actions.config.environment.setEnv(env)
        onClose()
        GlobalStore.actions.signOut()
      } else {
        setShowCustomURLOptions(!showCustomURLOptions)
      }
    },
  }
}

const EnvironmentOptions: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const color = useColor()
  const { env, adminOverrides, strings } = GlobalStore.useAppState((store) => store.config.environment)
  // show custom url options if there are already admin overrides in effect, or if the user has tapped the option
  // to set custom overrides during the lifetime of this component
  const [showCustomURLOptions, setShowCustomURLOptions] = useState(Object.keys(adminOverrides).length > 0)
  return (
    <>
      <MenuItem
        title="Environment"
        value={showCustomURLOptions ? `Custom (${capitalize(env)})` : capitalize(env)}
        onPress={() => {
          Alert.alert(
            "Environment",
            undefined,
            compact([
              envMenuOption("staging", env, showCustomURLOptions, setShowCustomURLOptions, onClose),
              envMenuOption("production", env, showCustomURLOptions, setShowCustomURLOptions, onClose),
              {
                text: "Cancel",
                style: "destructive",
              },
            ]),
            { cancelable: true }
          )
        }}
      />
      {!!showCustomURLOptions &&
        Object.entries(environment).map(([key, { description, presets }]) => {
          return (
            <TouchableHighlight
              key={key}
              underlayColor={color("black5")}
              onPress={() => {
                Alert.alert(
                  description,
                  undefined,
                  Object.entries(presets).map(([name, value]) => ({
                    text: name,
                    onPress: () => {
                      GlobalStore.actions.config.environment.setAdminOverride({ key: key as EnvironmentKey, value })
                    },
                  }))
                )
              }}
            >
              <Flex ml="2" mr="15px" my="5px" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Flex>
                  <Text variant="caption" color="black60" mb="0.5">
                    {description}
                  </Text>
                  <Flex key={key} flexDirection="row" justifyContent="space-between">
                    <Text variant="caption">{strings[key as EnvironmentKey]}</Text>
                  </Flex>
                </Flex>
                <ChevronIcon fill="black60" direction="right" />
              </Flex>
            </TouchableHighlight>
          )
        })}
    </>
  )
}
