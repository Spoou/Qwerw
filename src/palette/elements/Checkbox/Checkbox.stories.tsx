import { storiesOf } from "@storybook/react-native"
import React from "react"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"
import { Checkbox } from "./Checkbox"

storiesOf("Checkbox", module)
  .addDecorator(withTheme)
  .add("Variants", () => (
    <List>
      <Checkbox />
      <Checkbox text="Checkbox" />
      <Checkbox
        text={`Multiline
Text`}
      />
      <Checkbox text="Checkbox" subtitle="Subtitle" />
      <Checkbox
        text={`Multiline
Text`}
        subtitle="With Subtitle"
      />

      <Checkbox checked text="Checked" />
      <Checkbox checked={false} text="Unchecked" />
      <Checkbox disabled text="Disabled" />
      <Checkbox error text="With Error" />
      <Checkbox error text="With Error" subtitle="Subtitle" />
    </List>
  ))
