import { Checkbox } from "lib/Components/Bidding/Components/Checkbox"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { __globalStoreTestUtils__ } from "../../../../store/GlobalStore"
import { flushPromiseQueue } from "../../../../tests/flushPromiseQueue"
import { OnboardingCreateAccount } from "../OnboardingCreateAccount"

const goBackMock = jest.fn()
const replaceMock = jest.fn()

const navigationMock = {
  goBack: goBackMock,
  replace: replaceMock,
}

const mockFetch = jest.fn()

;(global as any).fetch = mockFetch

function mockFetchResponseOnce(response: Partial<Response>) {
  mockFetch.mockResolvedValueOnce(response)
}
function mockFetchJsonOnce(json: object, status: number = 200) {
  mockFetch.mockResolvedValueOnce({
    status,
    json: () => Promise.resolve(json),
  })
}

describe("OnboardingCreateAccount", () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it("form validation works properly", async () => {
    const tree = renderWithWrappers(<OnboardingCreateAccount navigation={navigationMock as any} route={null as any} />)

    const signUpButton = tree.root.findByProps({ testID: "signUpButton" })

    signUpButton.props.onPress()

    const emailInput = tree.root.findByProps({ testID: "emailInput" })

    expect(emailInput.props.placeholder).toEqual("Email address")

    emailInput.props.onChangeText("invalidEmail")

    signUpButton.props.onPress()

    await flushPromiseQueue()
    expect(emailInput.props.placeholder).toEqual("Email address")
    expect(emailInput.props.error).toEqual("Please provide a valid email address")

    emailInput.props.onChangeText("valid@email.com")

    expect(signUpButton.props.disabled).toEqual(false)
    expect(signUpButton.props.error).toEqual(undefined)

    mockFetchJsonOnce({
      xapp_token: "my-special-token",
      expires_in: "never",
    })

    mockFetchResponseOnce({ status: 404 })
    signUpButton.props.onPress()

    await flushPromiseQueue()

    const passwordInput = tree.root.findByProps({ testID: "passwordInput" })
    expect(passwordInput.props.placeholder).toEqual("Password")

    passwordInput.props.onChangeText("invalidEmail")
    signUpButton.props.onPress()
    await flushPromiseQueue()

    expect(passwordInput.props.error).toEqual("You password should contain at least one digit")

    passwordInput.props.onChangeText("validEmail1")
    signUpButton.props.onPress()
    await flushPromiseQueue()

    const nameInput = tree.root.findByProps({ testID: "nameInput" })
    nameInput.props.onChangeText("Full Name")
    expect(nameInput.props.placeholder).toEqual("First and Last Name")

    expect(signUpButton.props.disabled).toEqual(true)

    const termsCheckBox = tree.root.findAllByType(Checkbox)[0]
    termsCheckBox.props.onPress()

    await flushPromiseQueue()

    expect(signUpButton.props.disabled).toEqual(false)

    mockFetchResponseOnce({ status: 201 })
    mockFetchJsonOnce({
      xapp_token: "my-special-token",
      expires_in: "never",
    })
    mockFetchJsonOnce(
      {
        access_token: "my-access-token",
        expires_in: "a billion years",
      },
      201
    )
    mockFetchJsonOnce({
      id: "my-user-id",
    })
    const isLoggedIn = !!__globalStoreTestUtils__?.getCurrentState().auth.userAccessToken
    expect(isLoggedIn).toEqual(false)

    signUpButton.props.onPress()

    setTimeout(() => {
      expect(isLoggedIn).toEqual(true)
    }, 2000)
  })

  it("shows go to login button when the email is already used", async () => {
    const tree = renderWithWrappers(<OnboardingCreateAccount navigation={navigationMock as any} route={null as any} />)

    const signUpButton = tree.root.findByProps({ testID: "signUpButton" })

    const emailInput = tree.root.findByProps({ testID: "emailInput" })

    emailInput.props.onChangeText("used-email@example.com")

    mockFetchJsonOnce({
      xapp_token: "my-special-token",
      expires_in: "never",
    })

    mockFetchResponseOnce({ status: 200 })
    signUpButton.props.onPress()

    setTimeout(() => {
      expect(emailInput.props.error).toEqual("We found an account with this email")
      const loginButton = tree.root.findByProps({ testID: "loginButton" })
      loginButton.props.onPress()
      expect(replaceMock).toHaveBeenCalledWith("OnboardingLogin", {
        withFadeAnimation: true,
        email: "used-email@example.com",
      })
    }, 2000)
  })
})
