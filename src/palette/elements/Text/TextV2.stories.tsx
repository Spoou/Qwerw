import { TEXT_FONT_SIZES } from "@artsy/palette-tokens/dist/typography/v2"
import { storiesOf } from "@storybook/react-native"
import { isThemeV2, useTheme } from "palette"
import React from "react"
import { withHooks, withThemeV2AndSwitcher } from "storybook/decorators"
import { DList } from "storybook/helpers"
import { Text, TextV2, TextV2Props } from "."

const variants: Array<TextV2Props["variant"]> = [
  "small",
  "largeTitle",
  "title",
  "subtitle",
  "text",
  "mediumText",
  "caption",
]

const oldFontSizes: Array<keyof typeof TEXT_FONT_SIZES> = ["size1", "size4", "size7", "size10"]

const TextWrapper: React.FC<TextV2Props> = (props) => {
  const { theme } = useTheme()
  const Comp = isThemeV2(theme) ? TextV2 : Text
  // @ts-ignore
  return <Comp {...props} />
}

storiesOf("Theme/TextV2", module)
  .addDecorator(withThemeV2AndSwitcher)
  .addDecorator(withHooks)
  .add("Variants", () => (
    <DList
      data={variants}
      renderItem={({ item: variant }) => <TextWrapper variant={variant}>{variant} ~~ This is a v2 text.</TextWrapper>}
    />
  ))
  .add("Old fontSize", () => (
    <DList
      data={oldFontSizes}
      renderItem={({ item: fontSize }) => (
        <TextWrapper fontSize={fontSize}>{fontSize} ~~ This is a v2 text.</TextWrapper>
      )}
    />
  ))
