import { fireEvent } from "@testing-library/react-native"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import { SavedSearchButtonV2, SavedSearchButtonV2Props } from "./SavedSearchButtonV2"

describe("CustomPriceInput", () => {
  const TestWrapper = (props: Partial<SavedSearchButtonV2Props>) => {
    return <SavedSearchButtonV2 onPress={jest.fn} {...props} />
  }

  it("renders without error", () => {
    renderWithWrappersTL(<TestWrapper />)
  })

  it('should call "onPress" handler when it is pressed', () => {
    const onPressMock = jest.fn()
    const { getByText } = renderWithWrappersTL(<TestWrapper onPress={onPressMock} />)

    fireEvent.press(getByText("Create Alert"))

    expect(onPressMock).toBeCalled()
  })
})
