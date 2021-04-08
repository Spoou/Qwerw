import { StackScreenProps } from "@react-navigation/stack"
import { BackButton } from "lib/navigation/BackButton"
import { Flex, Text } from "palette"
import React from "react"
import { OnboardingCreateAccountNavigationStack } from "./OnboardingCreateAccount"

interface OnboardingCreateAccountPasswordProps
  extends StackScreenProps<OnboardingCreateAccountNavigationStack, "OnboardingCreateAccountPassword"> {}

export const OnboardingCreateAccountPassword: React.FC<OnboardingCreateAccountPasswordProps> = () => {
  return (
    <Flex flex={1} justifyContent="center" alignItems="center" backgroundColor="white">
      <BackButton
        onPress={() => {
          // Navigate back to OnboardingCreateAccountEmail screen
        }}
      />
      <Text variant="title">OnboardingCreateAccountPassword</Text>
    </Flex>
  )
}
