import {
  BackButton,
  Button,
  Flex,
  Input,
  LinkText,
  Spacer,
  Text,
  useTheme,
} from "@artsy/palette-mobile"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useRecaptcha } from "app/Components/Recaptcha/Recaptcha"
import { AuthContext } from "app/Scenes/Onboarding/Auth2/AuthContext"
import { useAuthNavigation } from "app/Scenes/Onboarding/Auth2/hooks/useAuthNavigation"
import { useInputAutofocus } from "app/Scenes/Onboarding/Auth2/hooks/useInputAutofocus"
import { OnboardingNavigationStack } from "app/Scenes/Onboarding/Onboarding"
import { AuthPromiseRejectType, AuthPromiseResolveType } from "app/store/AuthModel"
import { GlobalStore } from "app/store/GlobalStore"
import { osMajorVersion } from "app/utils/platformUtil"
import { Formik, useFormikContext } from "formik"
import { MotiView } from "moti"
import React, { useRef, useState } from "react"
import { Image, InteractionManager, Platform } from "react-native"
import { Easing } from "react-native-reanimated"
import * as Yup from "yup"

interface LoginEmailFormValues {
  email: string
}

export const LoginWelcomeStep: React.FC = () => {
  const navigation = useAuthNavigation()

  const { Recaptcha, token } = useRecaptcha({
    source: "authentication",
    action: "verify_email",
  })

  return (
    <>
      <Recaptcha />

      <Formik<LoginEmailFormValues>
        initialValues={{ email: "" }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Please provide a valid email address")
            .required("Email field is required"),
        })}
        onSubmit={async ({ email }, { resetForm }) => {
          // FIXME
          if (!token) {
            navigation.navigate({
              name: "LoginPasswordStep",
              params: { email, showSignUpLink: true },
            })
            return
          }

          const res = await GlobalStore.actions.auth.verifyUser({ email, recaptchaToken: token })

          if (res === "user_exists") {
            navigation.navigate({ name: "LoginPasswordStep", params: { email } })
          } else if (res === "user_does_not_exist") {
            navigation.navigate({ name: "SignUpPasswordStep", params: { email } })
          } else if (res === "something_went_wrong") {
            navigation.navigate({
              name: "LoginPasswordStep",
              params: { email, showSignUpLink: true },
            })
          }

          resetForm({ values: { email } })
        }}
      >
        <LoginWelcomeStepForm />
      </Formik>
    </>
  )
}

const LoginWelcomeStepForm: React.FC = () => {
  const setModalExpanded = AuthContext.useStoreActions((actions) => actions.setModalExpanded)
  const isModalExpanded = AuthContext.useStoreState((state) => state.isModalExpanded)

  const { color } = useTheme()
  const { handleChange, handleSubmit, isSubmitting, isValid, resetForm, values } =
    useFormikContext<LoginEmailFormValues>()

  const navigation = useNavigation<NavigationProp<OnboardingNavigationStack>>()
  const emailRef = useRef<Input>(null)

  useInputAutofocus({
    screenName: "LoginWelcomeStep",
    inputRef: emailRef,
    enabled: isModalExpanded,
  })

  const handleBackButtonPress = () => {
    requestAnimationFrame(() => {
      emailRef.current?.blur()
      setModalExpanded(false)
      resetForm({ values: { email: "" } })
    })
  }

  const handleEmailFocus = () => {
    setModalExpanded(true)
  }

  return (
    <Flex p={2}>
      {!!isModalExpanded && (
        <>
          <BackButton onPress={handleBackButtonPress} />
          <Spacer y={1} />
        </>
      )}

      <Text variant="sm-display">Sign up or log in</Text>

      <Input
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        blurOnSubmit={false}
        placeholderTextColor={color("black30")}
        ref={emailRef}
        spellCheck={false}
        keyboardType="email-address"
        textContentType="username"
        returnKeyType="next"
        title="Email"
        value={values.email}
        onChangeText={(text) => {
          handleChange("email")(text.trim())
        }}
        onFocus={handleEmailFocus}
        onSubmitEditing={handleSubmit}
      />

      <MotiView
        from={{ opacity: isModalExpanded ? 0 : 1 }}
        animate={{ opacity: isModalExpanded ? 1 : 0 }}
        transition={{ type: "timing", duration: 400, easing: Easing.linear }}
        style={{ display: isModalExpanded ? "flex" : "none" }}
      >
        <Spacer y={2} />

        <Button
          block
          width="100%"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!isValid || !values.email}
        >
          Continue
        </Button>
      </MotiView>

      <MotiView
        from={{ opacity: isModalExpanded ? 1 : 0 }}
        animate={{ opacity: isModalExpanded ? 0 : 1 }}
        transition={{ type: "timing", duration: 400, easing: Easing.linear }}
        style={{ display: isModalExpanded ? "none" : "flex" }}
      >
        <Spacer y={2} />

        <SocialLoginButtons />

        <Spacer y={1} />

        <Text variant="xxs" color="black60" textAlign="center" lineHeight="16px">
          By tapping Continue with Apple, Facebook, or Google, you agree to Artsy’s{" "}
          <LinkText
            variant="xxs"
            onPress={() => navigation.navigate("OnboardingWebView", { url: "/terms" })}
            lineHeight="16px"
          >
            Terms and Conditions
          </LinkText>{" "}
          and{" "}
          <LinkText
            variant="xxs"
            onPress={() => navigation.navigate("OnboardingWebView", { url: "/privacy" })}
            lineHeight="16px"
          >
            Privacy Policy
          </LinkText>
          .
        </Text>
      </MotiView>
    </Flex>
  )
}

const SocialLoginButtons: React.FC = () => {
  const [mode, _setMode] = useState<"login" | "signup">("login")

  const handleApplePress = () =>
    onSocialLogin(() => {
      return GlobalStore.actions.auth.authApple({ agreedToReceiveEmails: true })
    })

  const handleGooglePress = () =>
    onSocialLogin(() => {
      return GlobalStore.actions.auth.authGoogle({
        signInOrUp: mode === "login" ? "signIn" : "signUp",
        agreedToReceiveEmails: mode === "signup",
      })
    })

  const handleFacebookPress = () =>
    onSocialLogin(() => {
      return GlobalStore.actions.auth.authFacebook({
        signInOrUp: mode === "login" ? "signIn" : "signUp",
        agreedToReceiveEmails: mode === "signup",
      })
    })

  return (
    <Flex>
      <Text variant="xs" textAlign="center">
        Or continue with
      </Text>

      <Spacer y={1} />

      <Flex flexDirection="row" justifyContent="space-evenly" width="100%">
        {Platform.OS === "ios" && osMajorVersion() >= 13 && (
          <Button variant="fillDark" width="100%" onPress={handleApplePress}>
            <Flex height="100%" justifyContent="center" alignItems="center">
              <Image source={require("images/apple.webp")} />
            </Flex>
          </Button>
        )}

        <Button variant="outline" onPress={handleGooglePress}>
          <Flex justifyContent="center" alignItems="center">
            <Image
              source={require("images/google.webp")}
              style={{ position: "relative", top: 2 }}
            />
          </Flex>
        </Button>

        <Button variant="outline" width="100%" onPress={handleFacebookPress}>
          <Flex justifyContent="center" alignItems="center">
            <Image
              source={require("images/facebook.webp")}
              style={{ position: "relative", top: 2 }}
            />
          </Flex>
        </Button>
      </Flex>
    </Flex>
  )
}

const onSocialLogin = async (callback: () => Promise<AuthPromiseResolveType>) => {
  GlobalStore.actions.auth.setSessionState({ isLoading: true })

  InteractionManager.runAfterInteractions(() => {
    callback().catch((error: AuthPromiseRejectType) => {
      InteractionManager.runAfterInteractions(() => {
        GlobalStore.actions.auth.setSessionState({ isLoading: false })

        InteractionManager.runAfterInteractions(() => {
          // TODO: handle error like OnboardingSocialPick does
          console.error(error)
        })
      })
    })
  })
}
