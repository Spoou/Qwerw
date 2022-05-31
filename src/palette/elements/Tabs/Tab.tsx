import { Text } from "palette"
import { useColor } from "palette/hooks"
import React from "react"
import { ViewProps } from "react-native"
import { Pressable, View, ViewStyle } from "react-native"

export interface TabProps {
  label: string
  superscript?: JSX.Element
  active: boolean
  style?: ViewStyle
  onPress: () => void
  onLayout: ViewProps["onLayout"]
}

export const Tab: React.FC<TabProps> = ({
  label,
  superscript,
  active,
  onLayout,
  onPress,
  style,
}) => {
  const color = useColor()
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          onLayout={onLayout}
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 15,
            paddingVertical: 10,
            flexDirection: "row",
            ...style,
          }}
        >
          <Text
            fontSize={16}
            color={active ? color("black100") : pressed ? color("blue100") : color("black60")}
            style={{
              textDecorationLine: pressed ? "underline" : "none",
            }}
            // backgroundColor="green"
          >
            {label}
          </Text>
          {superscript}
        </View>
      )}
    </Pressable>
  )
}
