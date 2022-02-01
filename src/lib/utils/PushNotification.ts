import AsyncStorage from "@react-native-community/async-storage"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { navigate } from "lib/navigation/navigate"
import { getCurrentEmissionState, unsafe__getEnvironment } from "lib/store/GlobalStore"
import { GlobalStore, unsafe_getUserAccessToken } from "lib/store/GlobalStore"
import { PendingPushNotification } from "lib/store/PendingPushNotificationModel"
import { Platform } from "react-native"
import { getDeviceId } from "react-native-device-info"
import PushNotification, { ReceivedNotification } from "react-native-push-notification"

export const PUSH_NOTIFICATION_TOKEN = "PUSH_NOTIFICATION_TOKEN"
export const HAS_PENDING_NOTIFICATION = "HAS_PENDING_NOTIFICATION"

const MAX_ELAPSED_TAPPED_NOTIFICATION_TIME = 90 // seconds

export const CHANNELS = [
  {
    name: "Artsy's default notifications channel",
    id: "Default",
    properties: { channelDescription: "Artsy's default notifications channel" },
  },
]

type TypedNotification = Omit<ReceivedNotification, "userInfo"> & { title?: string }

export enum PushAuthorizationStatus {
  NotDetermined = "notDetermined",
  Authorized = "authorized",
  Denied = "denied",
}

export const savePendingToken = async () => {
  const hasPendingToken = await AsyncStorage.getItem(HAS_PENDING_NOTIFICATION)
  const token = await AsyncStorage.getItem(PUSH_NOTIFICATION_TOKEN)
  if (token && hasPendingToken === "true") {
    const saved = await saveToken(token, true)
    if (saved) {
      await AsyncStorage.removeItem(HAS_PENDING_NOTIFICATION)
    }
  }
}

export const saveToken = (token: string, ignoreSameTokenCheck: boolean = false) => {
  return new Promise<boolean>(async (resolve, reject) => {
    const previousToken = await AsyncStorage.getItem(PUSH_NOTIFICATION_TOKEN)
    if (token !== previousToken || ignoreSameTokenCheck) {
      const { authenticationToken, userAgent } = getCurrentEmissionState()
      if (!authenticationToken) {
        // user is not logged in. The first time a user opens the app, expect token to be gotten before the global store is initialised
        // save the token and send to gravity when they log in
        await AsyncStorage.multiSet([
          [HAS_PENDING_NOTIFICATION, "true"],
          [PUSH_NOTIFICATION_TOKEN, token],
        ])
        reject("Push Notification: No access token")
      } else {
        const environment = unsafe__getEnvironment()
        const url = environment.gravityURL + "/api/v1/device"
        const name = __TEST__ ? "my-device-name" : getDeviceId()
        const production = environment.env === "production"
        const body = JSON.stringify({
          name,
          token,
          app_id: "net.artsy.artsy",
          platform: Platform.OS,
          production,
        })
        const headers = {
          "Content-Type": "application/json",
          "X-ACCESS-TOKEN": authenticationToken,
          "User-Agent": userAgent,
        }
        const request = new Request(url, { method: "POST", body, headers })
        const res = await fetch(request)
        const response = await res.json()
        if (response.status < 200 || response.status > 299 || response.error) {
          if (__DEV__) {
            console.warn(`New Push Token ${token} was NOT saved`, response?.error)
          }
          reject("Push Notification: Failed to save new push notification token")
          return
        }
        if (__DEV__) {
          console.log(`New Push Token ${token} saved!`)
        }
        await AsyncStorage.setItem(PUSH_NOTIFICATION_TOKEN, token)
        resolve(true)
      }
    }
  })
}

export const createChannel = (channelId: string, channelName: string, properties: any = {}) => {
  PushNotification.createChannel(
    {
      channelId,
      channelName,
      ...properties,
    },
    (created) => {
      if (created && __DEV__) {
        console.log(`NEW CHANNEL ${channelName} CREATED`)
      }
    }
  )
}

export const createAllChannels = () => {
  CHANNELS.forEach((channel) => {
    createChannel(channel.name, channel.id, channel.properties)
  })
}

export const createLocalNotification = (notification: TypedNotification) => {
  const channelId = notification.data.channelId ?? CHANNELS[0].id
  const channelName = notification.data.channelName ?? channelId

  const create = () => {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId, // (required) channelId, if the channel doesn't exist, notification will not trigger.
      subText: notification.subText,
      ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
      userInfo: notification.data,

      /* iOS and Android properties */
      id: 0,
      message: notification.title ?? "Artsy", // (required)
    })
  }
  PushNotification.channelExists(channelId, (exists) => {
    if (exists) {
      create()
    } else {
      createChannel(channelId, channelName)
      create()
    }
  })
}

export const handlePendingNotification = (notification: PendingPushNotification | null) => {
  if (!notification) {
    return
  }
  const elapsedTimeInSecs = Math.floor((Date.now() - notification.tappedAt) / 1000)
  if (elapsedTimeInSecs <= MAX_ELAPSED_TAPPED_NOTIFICATION_TIME && !!notification.data.url) {
    navigate(notification.data.url, { passProps: notification.data })
  }
  GlobalStore.actions.pendingPushNotification.setPendingPushNotification(null)
}

export const handleReceivedNotification = (
  notification: Omit<ReceivedNotification, "userInfo">
) => {
  if (__DEV__ && !__TEST__) {
    console.log("RECIEVED NOTIFICATION", notification)
  }
  const isLoggedIn = !!unsafe_getUserAccessToken()
  if (notification.userInteraction) {
    if (!isLoggedIn) {
      // removing finish because we do not use it on android and we don't want to serialise functions at this time
      const newNotification = { ...notification, finish: undefined, tappedAt: Date.now() }
      delete newNotification.finish
      GlobalStore.actions.pendingPushNotification.setPendingPushNotification(newNotification)
      return
    }
    const hasUrl = !!notification.data.url
    if (isLoggedIn && hasUrl) {
      navigate(notification.data.url as string, { passProps: notification.data })
      // clear any pending notification
      GlobalStore.actions.pendingPushNotification.setPendingPushNotification(null)
      return
    }
    return
  }
  if (notification.foreground) {
    // flash notification and put it in Tray
    // In order to have a consistent behaviour in Android & iOS with the most flexibility,
    // it is best to handle it manually by prompting a local notification when onNotification
    // is triggered by a remote push notification on foreground
    const typedNotification: TypedNotification = { ...notification }
    createLocalNotification(typedNotification)
  }
}

export async function configure() {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: (token) => {
      if (__DEV__) {
        console.log("TOKEN:", token)
      }
      saveToken(token.token)
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: handleReceivedNotification,

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: (notification) => {
      if (__DEV__) {
        console.log("ACTION:", notification.action)
        console.log("NOTIFICATION:", notification)
      }

      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: (err) => {
      if (__DEV__) {
        console.error(err?.message, err)
      }
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    // permissions: {
    //   alert: true,
    //   badge: true,
    //   sound: true,
    // },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    // TODO:- Update this as required when implementing for ios
    requestPermissions: true,
  })
}

export const getNotificationPermissionsStatus = (): Promise<PushAuthorizationStatus> => {
  return new Promise((resolve) => {
    if (Platform.OS === "ios") {
      LegacyNativeModules.ARTemporaryAPIModule.fetchNotificationPermissions(
        (_, result: PushAuthorizationStatus) => {
          resolve(result)
        }
      )
    } else if (Platform.OS === "android") {
      PushNotification.checkPermissions((permissions) => {
        resolve(
          permissions.alert ? PushAuthorizationStatus.Authorized : PushAuthorizationStatus.Denied
        )
      })
    }
  })
}

module.exports = {
  configure,
  saveToken,
  savePendingToken,
  handlePendingNotification,
  handleReceivedNotification,
  createChannel,
  createAllChannels,
  createLocalNotification,
  getNotificationPermissionsStatus,
  CHANNELS,
  PushAuthorizationStatus,
}
