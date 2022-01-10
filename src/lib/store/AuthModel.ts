import { ActionType, AuthService, CreatedAccount } from "@artsy/cohesion"
import { appleAuth } from "@invertase/react-native-apple-authentication"
import CookieManager from "@react-native-cookies/cookies"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { useNavigation } from "@react-navigation/native"
import { action, Action, Computed, computed, StateMapper, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy"
import * as RelayCache from "lib/relay/RelayCache"
import { isArtsyEmail } from "lib/utils/general"
import { getNotificationPermissionsStatus, PushAuthorizationStatus } from "lib/utils/PushNotification"
import { postEventToProviders } from "lib/utils/track/providers"
import { SegmentTrackingProvider } from "lib/utils/track/SegmentTrackingProvider"
import { capitalize } from "lodash"
import { stringify } from "qs"
import { Alert, Linking, Platform } from "react-native"
import Config from "react-native-config"
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from "react-native-fbsdk-next"
import Keychain from "react-native-keychain"
import { LegacyNativeModules } from "../NativeModules/LegacyNativeModules"
import { getCurrentEmissionState } from "./GlobalStore"
import type { GlobalStoreModel } from "./GlobalStoreModel"

type BasicHttpMethod = "GET" | "PUT" | "POST" | "DELETE"

const showError = (res: any, reject: (reason?: any) => void, provider: "facebook" | "apple" | "google") => {
  const providerName = capitalize(provider)
  if (res.error_description) {
    if (res.error_description.includes("no account linked to oauth token")) {
      reject(
        `There is no email associated with your ${providerName} account. Please log in using your email and password instead.`
      )
    } else {
      reject("Login attempt failed")
    }
  }
}

interface EmailOAuthParams {
  oauthProvider: "email"
  email: string
  password: string
}
interface FacebookOAuthParams {
  oauthProvider: "facebook"
  accessToken: string
}
interface GoogleOAuthParams {
  oauthProvider: "google"
  accessToken: string
}
interface AppleOAuthParams {
  oauthProvider: "apple"
  idToken: string
  appleUID: string
}

type OAuthParams = EmailOAuthParams | FacebookOAuthParams | GoogleOAuthParams | AppleOAuthParams

type OnboardingState = "none" | "incomplete" | "complete"
export interface AuthModel {
  // State
  userID: string | null
  userAccessToken: string | null
  userAccessTokenExpiresIn: string | null
  xAppToken: string | null
  xApptokenExpiresIn: string | null
  onboardingState: OnboardingState
  userEmail: string | null
  previousSessionUserID: string | null

  userHasArtsyEmail: Computed<this, boolean, GlobalStoreModel>

  // Actions
  setState: Action<this, Partial<StateMapper<this, "1">>>
  getXAppToken: Thunk<this, void, {}, GlobalStoreModel, Promise<string>>
  accountExists: Thunk<
    this,
    OAuthParams,
    {},
    GlobalStoreModel,
    Promise<
      ({ accountExists: false; xAccessToken: undefined } | { accountExists: true; xAccessToken: string }) & {
        response: any
      }
    >
  >
  userExists: Thunk<this, { email: string }, {}, GlobalStoreModel>
  verifyPassword: Thunk<this, { email: string; password: string }, {}, GlobalStoreModel, Promise<boolean>>
  signIn: Thunk<
    this,
    { email: string; onboardingState?: OnboardingState } & OAuthParams,
    {},
    GlobalStoreModel,
    Promise<boolean>
  >
  signUp: Thunk<
    this,
    { email: string; name: string; agreedToReceiveEmails: boolean } & OAuthParams,
    {},
    GlobalStoreModel,
    Promise<{ success: boolean; message?: string }>
  >
  authFacebook: Thunk<this, { navigation: ReturnType<typeof useNavigation> }, {}, GlobalStoreModel, Promise<true>>
  authGoogle: Thunk<this, void, {}, GlobalStoreModel, Promise<true>>
  authApple: Thunk<this, void, {}, GlobalStoreModel, Promise<true>>
  forgotPassword: Thunk<this, { email: string }, {}, GlobalStoreModel, Promise<boolean>>
  gravityUnauthenticatedRequest: Thunk<
    this,
    {
      path: string
      method?: BasicHttpMethod
      body?: object
      headers?: RequestInit["headers"]
    },
    {},
    GlobalStoreModel,
    ReturnType<typeof fetch>
  >
  signOut: Thunk<this>

  notifyTracking: Thunk<this, { userId: string | null }>
  requestPushNotifPermission: Thunk<this>
  didRehydrate: ThunkOn<this, {}, GlobalStoreModel>
}

export const getAuthModel = (): AuthModel => ({
  userID: null,
  userAccessToken: null,
  userAccessTokenExpiresIn: null,
  xAppToken: null,
  xApptokenExpiresIn: null,
  onboardingState: "none",
  userEmail: null,
  previousSessionUserID: null,
  userHasArtsyEmail: computed((state) => isArtsyEmail(state.userEmail ?? "")),

  setState: action((state, payload) => Object.assign(state, payload)),
  getXAppToken: thunk(async (actions, _payload, context) => {
    const xAppToken = context.getState().xAppToken
    if (xAppToken) {
      // TODO: handle expiry
      return xAppToken
    }
    const gravityBaseURL = context.getStoreState().config.environment.strings.gravityURL
    const tokenURL = `${gravityBaseURL}/api/v1/xapp_token?${stringify({
      client_id: Config.ARTSY_API_CLIENT_KEY,
      client_secret: Config.ARTSY_API_CLIENT_SECRET,
    })}`
    const result = await fetch(tokenURL, {
      headers: {
        "User-Agent": getCurrentEmissionState().userAgent,
      },
    })
    // TODO: check status
    const json = (await result.json()) as {
      xapp_token: string
      expires_in: string
    }
    if (json.xapp_token) {
      actions.setState({
        xAppToken: json.xapp_token,
        xApptokenExpiresIn: json.expires_in,
      })
      return json.xapp_token
    }
    throw new Error("Unable to get x-app-token from " + tokenURL)
  }),
  gravityUnauthenticatedRequest: thunk(async (actions, payload, context) => {
    const gravityBaseURL = context.getStoreState().config.environment.strings.gravityURL
    const xAppToken = await actions.getXAppToken()

    return await fetch(`${gravityBaseURL}${payload.path}`, {
      method: payload.method || "GET",
      headers: {
        "X-Xapp-Token": xAppToken,
        Accept: "application/json",
        "User-Agent": getCurrentEmissionState().userAgent,
        ...payload.headers,
      },
      body: payload.body ? JSON.stringify(payload.body) : undefined,
    })
  }),
  accountExists: thunk(async (actions, args) => {
    const { oauthProvider } = args

    const grantTypeMap = {
      facebook: "oauth_token",
      google: "oauth_token",
      apple: "apple_uid",
      email: "credentials",
    }

    const resultGravityAccessToken = await actions.gravityUnauthenticatedRequest({
      path: `/oauth2/access_token`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        oauth_provider: oauthProvider,

        email: oauthProvider === "email" ? args.email : undefined,
        password: oauthProvider === "email" ? args.password : undefined,
        oauth_token: oauthProvider === "facebook" || oauthProvider === "google" ? args.accessToken : undefined,
        apple_uid: oauthProvider === "apple" ? args.appleUID : undefined,
        id_token: oauthProvider === "apple" ? args.idToken : undefined,
        grant_type: grantTypeMap[oauthProvider],

        client_id: Config.ARTSY_API_CLIENT_KEY,
        client_secret: Config.ARTSY_API_CLIENT_SECRET,
        scope: "offline_access",
      },
    })
    const accountExists = resultGravityAccessToken.status === 201
    const response = await resultGravityAccessToken.json()

    if (!accountExists) {
      return { accountExists, response }
    }

    const { access_token: xAccessToken } = response
    return { accountExists, xAccessToken, response }
  }),
  userExists: thunk(async (actions, { email }) => {
    const result = await actions.gravityUnauthenticatedRequest({
      path: `/api/v1/user?${stringify({ email })}`,
    })
    if (result.status === 200) {
      return true
    } else if (result.status === 404) {
      return false
    } else {
      throw new Error(JSON.stringify(await result.json()))
    }
  }),
  forgotPassword: thunk(async (actions, { email }) => {
    const result = await actions.gravityUnauthenticatedRequest({
      path: `/api/v1/users/send_reset_password_instructions`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email,
      },
    })

    // For security purposes we don't want to disclose when a user is not found
    // this is indicated by 400 on gravity side, treat as success
    if (result.ok || result.status === 400) {
      return true
    }
    return false
  }),
  verifyPassword: thunk(async (actions, { email, password }) => {
    const result = await actions.gravityUnauthenticatedRequest({
      path: `/oauth2/access_token`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        email,
        oauth_provider: "email",

        password,
        grant_type: "credentials",

        client_id: Config.ARTSY_API_CLIENT_KEY,
        client_secret: Config.ARTSY_API_CLIENT_SECRET,
        scope: "offline_access",
      },
    })
    return result.status === 201
  }),
  signIn: thunk(async (actions, args, store) => {
    const { oauthProvider, email, onboardingState } = args

    const { accountExists, xAccessToken, response } = await actions.accountExists(args)

    if (accountExists) {
      const user = await (
        await actions.gravityUnauthenticatedRequest({
          path: `/api/v1/me`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-ACCESS-TOKEN": xAccessToken!,
          },
        })
      ).json()

      const { expires_in } = response
      actions.setState({
        userAccessToken: xAccessToken,
        userAccessTokenExpiresIn: expires_in,
        userID: user.id,
        userEmail: email,
        onboardingState: onboardingState ?? "complete",
      })

      if (oauthProvider === "email") {
        Keychain.setInternetCredentials(
          store.getStoreState().config.environment.strings.webURL.slice("https://".length),
          email,
          args.password
        )
      }

      if (user.id !== store.getState().previousSessionUserID) {
        store.getStoreActions().search.clearRecentSearches()
      }

      actions.notifyTracking({ userId: user.id })
      postEventToProviders(tracks.loggedIn(oauthProvider))

      // Keep native iOS in sync with react-native auth state
      if (Platform.OS === "ios") {
        requestAnimationFrame(() => {
          LegacyNativeModules.ArtsyNativeModule.updateAuthState(xAccessToken!, expires_in, user)
        })
      }

      if (!onboardingState || onboardingState === "complete" || onboardingState === "none") {
        actions.requestPushNotifPermission()
      }

      return true
    }

    return false
  }),
  signUp: thunk(async (actions, args) => {
    const { oauthProvider, email, name, agreedToReceiveEmails } = args
    const result = await actions.gravityUnauthenticatedRequest({
      path: `/api/v1/user`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        provider: oauthProvider,
        email,
        name,

        password: oauthProvider === "email" ? args.password : undefined,
        oauth_token: oauthProvider === "facebook" || oauthProvider === "google" ? args.accessToken : undefined,
        apple_uid: oauthProvider === "apple" ? args.appleUID : undefined,
        id_token: oauthProvider === "apple" ? args.idToken : undefined,

        agreed_to_receive_emails: agreedToReceiveEmails,
        accepted_terms_of_service: true,
      },
    })

    // The user account has been successfully created
    if (result.status === 201) {
      postEventToProviders(tracks.createdAccount({ signUpMethod: oauthProvider }))

      switch (oauthProvider) {
        case "facebook":
        case "google":
          await actions.signIn({
            oauthProvider,
            email,
            accessToken: args.accessToken,
            onboardingState: "incomplete",
          })
          break
        case "apple":
          await actions.signIn({
            oauthProvider,
            email,
            idToken: args.idToken,
            appleUID: args.appleUID,
            onboardingState: "incomplete",
          })
          break
        case "email":
          await actions.signIn({
            oauthProvider,
            email,
            password: args.password,
            onboardingState: "incomplete",
          })
          break
        default:
          assertNever(oauthProvider)
      }

      return { success: true }
    }

    const resultJson = await result.json()
    let message = ""
    const providerName = capitalize(oauthProvider)
    if (resultJson?.error === "User Already Exists") {
      message = `Your ${providerName} email account is linked to an Artsy user account please Log in using your email and password instead.`
    } else if (resultJson?.error === "Another Account Already Linked") {
      message =
        `Your ${providerName} account is already linked to another Artsy account. ` +
        `Try logging out and back in with ${providerName}. Then consider ` +
        `deleting that user account and re-linking ${providerName}. `
    } else if (resultJson.message && resultJson.message.match("Unauthorized source IP address")) {
      message = `You could not create an account because your IP address was blocked by ${providerName}`
    } else {
      message = "Failed to sign up"
    }

    return { success: false, message }
  }),
  authFacebook: thunk(async (actions, { navigation }) => {
    return await new Promise<true>(async (resolve, reject) => {
      const { declinedPermissions, isCancelled } = await LoginManager.logInWithPermissions(["public_profile", "email"])
      if (declinedPermissions?.includes("email")) {
        reject("Please allow the use of email to continue.")
      }

      const accessToken = !isCancelled && (await AccessToken.getCurrentAccessToken())
      if (!accessToken) {
        return
      }

      const responseFacebookInfoCallback = async (
        error: { message: string },
        facebookInfo: { email?: string; name: string }
      ) => {
        if (error) {
          reject(`Error fetching facebook data: ${error.message}`)
          return
        }

        if (!facebookInfo.email) {
          reject(
            "There is no email associated with your Facebook account. Please log in using your email and password instead."
          )
          return
        }

        /**
         * General way of how we determine account existance and link state:
         *
         * First we ask FB for the email, name, and access token.
         *
         * - If the email does not exist in gravity, then we know it's a first-time login.
         *     In that case we go ahead and create the account using FB.
         *
         * - If the email exists, then either this is an existing FB account, or it's an existing email account.
         *   - If gravity is ok with our access token, then we know it's a FB account.
         *       In that case we can continue with the login.
         *   - If gravity is *not* ok with our access token, then we know it's an email account.
         *       In that case, we take the user to the link screen.
         *       There, they can choose to either link FB to their email account, or use separate accounts, one FB and one email.
         */

        const emailExists = await actions.userExists({ email: facebookInfo.email! })
        if (!emailExists) {
          // thats a new email, continue with FB.

          const resultGravitySignUp = await actions.signUp({
            email: facebookInfo.email,
            name: facebookInfo.name,
            accessToken: accessToken.accessToken,
            oauthProvider: "facebook",
            agreedToReceiveEmails: true,
          })

          resultGravitySignUp.success ? resolve(true) : reject(resultGravitySignUp.message)
        } else {
          // that email exists. either as a FB account, or as an email account, or any other social.

          const { accountExists: accountIsFB, xAccessToken } = await actions.accountExists({
            oauthProvider: "facebook",
            accessToken: accessToken.accessToken,
          })

          if (accountIsFB) {
            // its a FB account, continue with FB.

            const resultGravityEmail = await actions.gravityUnauthenticatedRequest({
              path: `/api/v1/me`,
              headers: { "X-ACCESS-TOKEN": xAccessToken! },
            })
            const { email } = await resultGravityEmail.json()
            const resultGravitySignIn = await actions.signIn({
              oauthProvider: "facebook",
              email,
              accessToken: accessToken.accessToken,
            })

            resultGravitySignIn ? resolve(true) : reject("Could not log in")
          } else {
            // its not a FB account, we need to link or make a separate account.
            navigation.navigate("OnboardingSocialLink", { email })
          }
        }
      }

      // get info from facebook
      const infoRequest = new GraphRequest(
        "/me",
        {
          accessToken: accessToken.accessToken,
          parameters: {
            fields: {
              string: "email,name",
            },
          },
        },
        responseFacebookInfoCallback
      )
      new GraphRequestManager().addRequest(infoRequest).start()
    })
  }),
  authGoogle: thunk(async (actions) => {
    return await new Promise<true>(async (resolve, reject) => {
      if (!(await GoogleSignin.hasPlayServices())) {
        reject("Play services are not available.")
      }

      const userInfo = await GoogleSignin.signIn()
      const accessToken = (await GoogleSignin.getTokens()).accessToken

      const { accountExists, xAccessToken, response } = await actions.accountExists({
        oauthProvider: "google",
        accessToken,
      })

      if (accountExists) {
        const resultGravityEmail = await actions.gravityUnauthenticatedRequest({
          path: `/api/v1/me`,
          headers: { "X-ACCESS-TOKEN": xAccessToken! },
        })
        const { email } = await resultGravityEmail.json()
        const resultGravitySignIn = await actions.signIn({
          oauthProvider: "google",
          email,
          accessToken,
        })

        resultGravitySignIn ? resolve(true) : reject("Could not log in")
      } else {
        const accountShouldBeCreated = response.error_description.includes("no account linked to oauth token")

        if (accountShouldBeCreated) {
          const resultGravitySignUp = userInfo.user.name
            ? await actions.signUp({
                email: userInfo.user.email,
                name: userInfo.user.name,
                accessToken,
                oauthProvider: "google",
                agreedToReceiveEmails: true,
              })
            : { success: false }

          resultGravitySignUp.success ? resolve(true) : reject(resultGravitySignUp.message)
        } else {
          showError(response, reject, "google")
        }
      }
    })
  }),
  authApple: thunk(async (actions) => {
    return await new Promise(async (resolve, reject) => {
      const userInfo = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })

      const idToken = userInfo.identityToken
      if (!idToken) {
        reject("Failed to authenticate using apple sign in")
        return
      }

      const appleUID = userInfo.user

      const { accountExists, xAccessToken, response } = await actions.accountExists({
        oauthProvider: "apple",
        appleUID,
        idToken,
      })

      if (accountExists) {
        const resultGravityEmail = await actions.gravityUnauthenticatedRequest({
          path: `/api/v1/me`,
          headers: { "X-ACCESS-TOKEN": xAccessToken! },
        })
        const { email } = await resultGravityEmail.json()
        const resultGravitySignIn = await actions.signIn({
          oauthProvider: "apple",
          email,
          appleUID,
          idToken,
        })

        resultGravitySignIn ? resolve(true) : reject("Could not log in")
      } else {
        const accountShouldBeCreated = response.error_description.includes("no account linked to oauth token")

        if (accountShouldBeCreated) {
          const firstName = userInfo.fullName?.givenName ? userInfo.fullName.givenName : ""
          const lastName = userInfo.fullName?.familyName ? userInfo.fullName.familyName : ""

          const resultGravitySignUp = userInfo.email
            ? await actions.signUp({
                email: userInfo.email,
                name: `${firstName} ${lastName}`.trim(),
                appleUID,
                idToken,
                oauthProvider: "apple",
                agreedToReceiveEmails: true,
              })
            : { success: false }

          resultGravitySignUp.success ? resolve(true) : reject(resultGravitySignUp.message)
        } else {
          showError(response, reject, "apple")
        }
      }
    })
  }),
  signOut: thunk(async () => {
    const signOutGoogle = async () => {
      try {
        await GoogleSignin.revokeAccess()
        await GoogleSignin.signOut()
      } catch (error) {
        console.log("Failed to signout from Google")
        console.error(error)
      }
    }

    await Promise.all([
      Platform.OS === "ios" ? await LegacyNativeModules.ArtsyNativeModule.clearUserData() : Promise.resolve(),
      await signOutGoogle(),
      CookieManager.clearAll(),
      RelayCache.clearAll(),
    ])
  }),
  notifyTracking: thunk((_, { userId }) => {
    SegmentTrackingProvider.identify?.(userId, { is_temporary_user: userId === null ? 1 : 0 })
  }),
  requestPushNotifPermission: thunk(async () => {
    const pushNotificationsPermissionsStatus = await getNotificationPermissionsStatus()
    if (pushNotificationsPermissionsStatus !== PushAuthorizationStatus.Authorized) {
      setTimeout(() => {
        if (Platform.OS === "ios") {
          LegacyNativeModules.ARTemporaryAPIModule.requestPrepromptNotificationPermissions()
        } else {
          Alert.alert(
            "Artsy Would Like to Send You Notifications",
            "Turn on notifications to get important updates about artists you follow.",
            [
              { text: "Dismiss", style: "cancel" },
              { text: "Settings", onPress: () => Linking.openSettings() },
            ]
          )
        }
      }, 3000)
    }
  }),
  didRehydrate: thunkOn(
    (_, storeActions) => storeActions.rehydrate,
    (actions, __, store) => {
      actions.notifyTracking({ userId: store.getState().userID })
    }
  ),
})

const tracks = {
  createdAccount: ({ signUpMethod }: { signUpMethod: AuthService }): Partial<CreatedAccount> => ({
    action: ActionType.createdAccount,
    service: signUpMethod,
  }),
  loggedIn: (service: AuthService) => ({
    action: ActionType.successfullyLoggedIn,
    service,
  }),
}
