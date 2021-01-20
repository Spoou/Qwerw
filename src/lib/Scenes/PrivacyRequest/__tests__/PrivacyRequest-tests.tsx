// @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
import { shallow } from "enzyme"
import { LinkText } from "lib/Components/Text/LinkText"
import { ArtsyNativeModules } from "lib/NativeModules/ArtsyNativeModules"
import { navigate } from "lib/navigation/navigate"
import { Button } from "palette"
import React from "react"
import { PrivacyRequest } from "../PrivacyRequest"

describe(PrivacyRequest, () => {
  it("handles privacy policy link taps", () => {
    const tree = shallow(<PrivacyRequest />)

    tree.find(LinkText).at(0).simulate("press")

    expect(navigate).toHaveBeenCalledWith("/privacy", { modal: true })
  })

  it("handles email link taps", () => {
    const tree = shallow(<PrivacyRequest />)

    tree.find(LinkText).at(1).simulate("press")

    expect(ArtsyNativeModules.ARScreenPresenterModule.presentEmailComposer).toHaveBeenCalledWith(
      "privacy@artsy.net",
      "Personal Data Request"
    )
  })

  it("handles CCPA button presses", () => {
    const tree = shallow(<PrivacyRequest />)

    tree.find(Button).simulate("press")

    expect(ArtsyNativeModules.ARScreenPresenterModule.presentEmailComposer).toHaveBeenCalledWith(
      "privacy@artsy.net",
      "Personal Data Request",
      "Hello, I'm contacting you to ask that..."
    )
  })
})
