import { useFeatureFlag } from "lib/store/GlobalStore"
import { BellIcon, Box, Button, Separator, Text, useColor } from "palette"
import React, { ReactNode, useState } from "react"
import { Pressable } from "react-native"

export interface ArtworkFilterApplyButtonProps {
  disabled: boolean
  onCreateAlertPress?: () => void
  onPress: () => void
}

interface Button {
  label: string
  disabled?: boolean
  icon?: ReactNode
  onPress: () => void
}

const InnerButton: React.FC<Button> = (props) => {
  const { label, disabled, icon, onPress } = props
  const [isPressed, setIsPressed] = useState(false)

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      disabled={disabled}
      style={{ flex: 1, opacity: disabled ? 0.4 : 1 }}
    >
      <Box flex={1} flexDirection="row" alignItems="center" justifyContent="center">
        {icon}
        <Text
          variant="xs"
          color="white100"
          lineHeight={14}
          style={{ textDecorationLine: isPressed ? "underline" : "none" }}
        >
          {label}
        </Text>
      </Box>
    </Pressable>
  )
}

export const ArtworkFilterApplyButton: React.FC<ArtworkFilterApplyButtonProps> = (props) => {
  const { disabled, onCreateAlertPress, onPress } = props
  const color = useColor()
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")

  if (isEnabledImprovedAlertsFlow && onCreateAlertPress) {
    return (
      <Box
        p={2}
        backgroundColor="white"
        style={{
          shadowColor: color("black100"),
          shadowOffset: {
            width: 0,
            height: 7,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 12,
        }}
      >
        <Box height={50} borderRadius={50} px={1} backgroundColor="black100" flexDirection="row" alignItems="center">
          <InnerButton
            label="Create Alert"
            icon={<BellIcon fill="white100" width="15px" height="15px" mr={1} />}
            onPress={onCreateAlertPress}
          />
          <Box width="1" height={20} backgroundColor="white100" mx={1} />
          <InnerButton disabled={disabled} label="Apply Filters" onPress={onPress} />
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Separator my={0} />
      <Box p={2} pb={30}>
        <Button disabled={disabled} onPress={onPress} block width={100} variant="fillDark" size="large">
          Show results
        </Button>
      </Box>
    </>
  )
}
