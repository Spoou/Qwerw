import { Input2, useColor } from "@artsy/palette-mobile"
import { StackScreenProps } from "@react-navigation/stack"
import { useFormikContext } from "formik"
import { Platform } from "react-native"
import {
  FormikSchema,
  OnboardingCreateAccountNavigationStack,
  OnboardingCreateAccountScreenWrapper,
} from "./OnboardingCreateAccount"

export interface OnboardingCreateAccountEmailParams {
  navigateToWelcomeScreen: () => void
}

type OnboardingCreateAccountEmailProps = StackScreenProps<
  OnboardingCreateAccountNavigationStack,
  "OnboardingCreateAccountEmail"
>

export const OnboardingCreateAccountEmail: React.FC<OnboardingCreateAccountEmailProps> = ({
  route,
}) => {
  const color = useColor()
  const { values, handleChange, errors, setErrors, handleSubmit } = useFormikContext<FormikSchema>()

  return (
    <OnboardingCreateAccountScreenWrapper
      onBackButtonPress={route.params.navigateToWelcomeScreen}
      title="Sign Up with Email"
    >
      <Input2
        autoCapitalize="none"
        autoComplete="email"
        enableClearButton
        autoFocus
        title="Email"
        keyboardType="email-address"
        onChangeText={(text) => {
          // Hide error when the user starts to type again
          if (errors.email) {
            setErrors({
              email: undefined,
            })
          }
          handleChange("email")(text.trim())
        }}
        onSubmitEditing={handleSubmit}
        blurOnSubmit={false}
        placeholderTextColor={color("black30")}
        placeholder="Email address"
        value={values.email}
        returnKeyType="next"
        spellCheck={false}
        autoCorrect={false}
        textContentType={Platform.OS === "ios" ? "username" : "emailAddress"}
        error={errors.email}
        testID="emailInput"
      />
    </OnboardingCreateAccountScreenWrapper>
  )
}
