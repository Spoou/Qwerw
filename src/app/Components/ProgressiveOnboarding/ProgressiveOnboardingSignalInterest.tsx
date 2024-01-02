import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { useIsFocused } from "@react-navigation/native"
import { useSetActivePopover } from "app/Components/ProgressiveOnboarding/useSetActivePopover"
import { GlobalStore } from "app/store/GlobalStore"
import { ElementInView } from "app/utils/ElementInView"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useState } from "react"

export const ProgressiveOnboardingSignalInterest: React.FC = ({ children }) => {
  const [isInView, setIsInView] = useState(false)
  const {
    isDismissed,
    sessionState: { isReady },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { dismiss, setIsReady } = GlobalStore.actions.progressiveOnboarding
  const isFocused = useIsFocused()
  const isPartnerOfferEnabled = useFeatureFlag("AREnablePartnerOffer")

  const isDisplayable =
    isReady &&
    !isDismissed("signal-interest").status &&
    isFocused &&
    isInView &&
    isPartnerOfferEnabled
  const { isActive, clearActivePopover } = useSetActivePopover(isDisplayable)

  const handleDismiss = () => {
    setIsReady(false)
    dismiss("signal-interest")
  }

  if (isDisplayable && isActive) {
    return (
      <Popover
        visible={isActive}
        onDismiss={handleDismiss}
        onPressOutside={handleDismiss}
        onCloseComplete={clearActivePopover}
        placement="top"
        title={
          <Text variant="xs" color="white100">
            Learn more about saves and{"\n"}how to manage your preferences.
          </Text>
        }
      >
        <Flex pointerEvents="none">{children}</Flex>
      </Popover>
    )
  }

  if (isInView) {
    return <>{children}</>
  }

  return <ElementInView onVisible={() => setIsInView(true)}>{children}</ElementInView>
}
