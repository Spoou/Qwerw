import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import WebView from "react-native-webview"
import { ArtsyWebView } from "../ArtsyWebView"
import InternalWebView from "../InternalWebView"

describe("ArtsyWebView", () => {
  it("Shows react-native-webview if the AROptionsUseReactNativeWebView is set to true", () => {
    __globalStoreTestUtils__?.injectEmissionOptions({ AROptionsUseReactNativeWebView: true })
    const tree = renderWithWrappers(<ArtsyWebView url="random-url" />)

    expect(tree.root.findAllByType(WebView).length).toEqual(1)
    expect(tree.root.findAllByType(InternalWebView).length).toEqual(0)
  })

  it("Shows InternalWebView the AROptionsUseReactNativeWebView is set to false", () => {
    __globalStoreTestUtils__?.injectEmissionOptions({ AROptionsUseReactNativeWebView: false })
    const tree = renderWithWrappers(<ArtsyWebView url="random-url" />)

    expect(tree.root.findAllByType(InternalWebView).length).toEqual(1)
    expect(tree.root.findAllByType(WebView).length).toEqual(0)
  })
})
