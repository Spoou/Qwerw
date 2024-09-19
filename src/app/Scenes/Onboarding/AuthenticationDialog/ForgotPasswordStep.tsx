import { BackButton, Button, Flex, Text, useTheme } from "@artsy/palette-mobile"
import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { StackScreenProps } from "@react-navigation/stack"
import { BottomSheetInput } from "app/Components/BottomSheetInput"
import { OnboardingHomeNavigationStack } from "app/Scenes/Onboarding/OnboardingHome"
import { GlobalStore } from "app/store/GlobalStore"
import { Field, Formik, FormikHelpers } from "formik"
import * as Yup from "yup"

type ForgotPasswordStepProps = StackScreenProps<OnboardingHomeNavigationStack, "ForgotPasswordStep">

interface ForgotPasswordStepFormValues {
  password: string
}

export const ForgotPasswordStep: React.FC<ForgotPasswordStepProps> = ({ navigation, route }) => {
  const { space } = useTheme()

  const handleContinueButtonPress = async (
    { password }: ForgotPasswordStepFormValues,
    { validateForm }: FormikHelpers<ForgotPasswordStepFormValues>
  ) => {
    await validateForm()

    const response = await GlobalStore.actions.auth.signIn({
      oauthProvider: "email",
      oauthMode: "email",
      email: route.params.email,
      password,
    })

    console.log({ response })
  }

  const handleBackButtonPress = () => {
    navigation.goBack()
  }

  return (
    <BottomSheetScrollView>
      <Formik
        initialValues={{ password: "" }}
        onSubmit={handleContinueButtonPress}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .min(8)
            .matches(/[A-Z]/)
            .matches(/[a-z]/)
            .matches(/[0-9]/)
            .required(),
        })}
        validateOnMount
      >
        {({ handleChange, handleSubmit, isValid, values }) => {
          return (
            <Flex padding={2} gap={space(1)}>
              <BackButton onPress={handleBackButtonPress} />
              <Text variant="sm-display">Welcome back to Artsy</Text>

              <Field
                name="password"
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect={false}
                secureTextEntry
                component={BottomSheetInput}
                placeholder="Enter your password"
                returnKeyType="done"
                title="Password"
                value={values.password}
                onChangeText={handleChange("password")}
              />

              <Button block width={100} onPress={handleSubmit} disabled={!isValid}>
                Continue
              </Button>
            </Flex>
          )
        }}
      </Formik>
    </BottomSheetScrollView>
  )
}
