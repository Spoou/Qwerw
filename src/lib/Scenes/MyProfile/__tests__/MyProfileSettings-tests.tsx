import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Platform } from "react-native"
import { MyProfileSettings } from "../MyProfileSettings"

jest.mock("../LoggedInUserInfo")
jest.unmock("react-relay")

describe(MyProfileSettings, () => {
  const getWrapper = () => {
    const tree = renderWithWrappers(<MyProfileSettings />)
    return tree
  }

  it("renders without throwing an error", () => {
    getWrapper()
  })

  it("renders push notifications on iOS", () => {
    Platform.OS = "ios"
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Push Notifications")
  })

  it("renders push notifications on Android", () => {
    Platform.OS = "android"
    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Push Notifications")
  })

  it("renders Saved Alerts only when the AREnableSavedSearchV2 flag is enable", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearchV2: true })

    const tree = getWrapper()
    expect(extractText(tree.root)).toContain("Saved Alerts")
  })
})
