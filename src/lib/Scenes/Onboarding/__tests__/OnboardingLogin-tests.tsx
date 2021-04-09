import { Input } from "lib/Components/Input/Input"
import React from "react"
import { Touchable } from "../../../../palette/elements/Touchable/Touchable"
import { renderWithWrappers } from "../../../tests/renderWithWrappers"
import { OnboardingLoginForm } from "../OnboardingLogin"

const navigateMock = jest.fn()

const navigationPropsMock = {
  navigate: navigateMock,
  goBack: jest.fn(),
}

const mockHandleSubmit = jest.fn()
const mockValidateForm = jest.fn()

jest.mock("formik", () => ({
  useFormikContext: () => {
    return {
      handleSubmit: mockHandleSubmit,
      values: { mail: "", password: "" },
      handleChange: jest.fn(() => jest.fn()),
      validateForm: mockValidateForm,
      errors: {},
      isValid: true,
      dirty: false,
      isSubmitting: false,
    }
  },
}))

describe("OnboardingLogin", () => {
  const TestProvider = () => {
    return <OnboardingLoginForm navigation={navigationPropsMock as any} route={null as any} />
  }

  describe("Forget Button", () => {
    it("navigates to forgot password screen", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const forgotPasswordButton = tree.root.findAllByType(Touchable)[0]
      forgotPasswordButton.props.onPress()
      expect(navigateMock).toHaveBeenCalledWith("OnboardingForgotPassword")
    })
  })

  describe("Log in button", () => {
    it("renders disabled on screen mount", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const loginButton = tree.root.findAllByProps({ testID: "loginButton" })[0]
      expect(loginButton.props.disabled).toEqual(true)
    })
    it("renders disabled when the user set only the email address", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const emailInput = tree.root.findAllByType(Input)[0]
      emailInput.props.onChangeText("test@artsymail.com")
      const loginButton = tree.root.findAllByProps({ testID: "loginButton" })[0]
      expect(loginButton.props.disabled).toEqual(true)
    })
    it("renders disabled when the user sets only the password input", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const passwordInput = tree.root.findAllByType(Input)[1]
      passwordInput.props.onChangeText("password")
      const loginButton = tree.root.findAllByProps({ testID: "loginButton" })[0]
      expect(loginButton.props.disabled).toEqual(true)
    })

    it("renders enabled when a valid email and password are there", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const emailInput = tree.root.findAllByType(Input)[0]
      const passwordInput = tree.root.findAllByType(Input)[1]

      emailInput.props.onChangeText("example@mail.com")
      passwordInput.props.onChangeText("password")

      const loginButton = tree.root.findAllByProps({ testID: "loginButton" })[0]
      expect(loginButton.props.disabled).toEqual(true)
    })
  })

  describe("Form", () => {
    it("validates email on blur and onSubmitEditing", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const emailInput = tree.root.findAllByType(Input)[0]

      emailInput.props.onChangeText("invalidEmail 1")
      emailInput.props.onBlur()
      expect(mockValidateForm).toHaveBeenCalled()

      emailInput.props.onChangeText("invalidEmail 2")
      emailInput.props.onSubmitEditing()
      expect(mockValidateForm).toHaveBeenCalled()
    })

    it("validates password on blur and onSubmitEditing", () => {
      const tree = renderWithWrappers(<TestProvider />)
      const passwordInput = tree.root.findAllByType(Input)[1]

      passwordInput.props.onChangeText("password 1")
      passwordInput.props.onBlur()
      expect(mockValidateForm).toHaveBeenCalled()

      passwordInput.props.onChangeText("password 2")
      passwordInput.props.onSubmitEditing()
      expect(mockValidateForm).toHaveBeenCalled()
    })
  })
})
