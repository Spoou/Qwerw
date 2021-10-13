import { action } from "@storybook/addon-actions"
import { storiesOf } from "@storybook/react-native"
import { ArtworkIcon, AuctionIcon, CheckIcon, CloseIcon } from "palette"
import React from "react"
import { withTheme } from "storybook/decorators"
import { List } from "storybook/helpers"
import { Pill } from "./Pill"

storiesOf("Pill", module)
  .addDecorator(withTheme)
  .add("Artist", () => (
    <List>
      <Pill size="sm" rounded imageUrl="https://ychef.files.bbci.co.uk/976x549/p0400cts.jpg">
        Artist Name Pill
      </Pill>
    </List>
  ))
  .add("Filter", () => (
    <List>
      <Pill size="xs" rounded>
        Filter Rounded
      </Pill>
      <Pill size="xs" Icon={CheckIcon} iconPosition="left">
        Checked
      </Pill>
      <Pill size="xs" Icon={CloseIcon} iconPosition="right">
        Crossed
      </Pill>
    </List>
  ))
  .add("Text", () => (
    <List>
      <Pill>Not Selected</Pill>
      <Pill selected>[NEW]Selected</Pill>
      <Pill rounded>Not Selected</Pill>
      <Pill rounded selected>
        Selected
      </Pill>
    </List>
  ))
  .add("Navigation Button", () => (
    <List>
      <Pill Icon={ArtworkIcon} onPress={() => action("pill tapped")}>
        Artworks
      </Pill>
      <Pill Icon={AuctionIcon} onPress={() => action("pill tapped")}>
        Auctions
      </Pill>
    </List>
  ))
  .add("Miscellaneous", () => (
    <List>
      <Pill onPress={() => action("pill tapped")}>[NEW]Pressable</Pill>
      <Pill disabled onPress={() => action("pill tapped")}>
        Pressable (disabled)
      </Pill>
    </List>
  ))
