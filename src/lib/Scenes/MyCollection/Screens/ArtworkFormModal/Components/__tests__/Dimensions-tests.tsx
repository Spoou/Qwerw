import { useFormikContext } from "formik"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Input } from "palette/elements/Input/Input"
import React from "react"
import { Dimensions } from "../Dimensions"

jest.mock("formik")

describe("Dimensions", () => {
  const useFormikContextMock = useFormikContext as jest.Mock

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      values: {
        height: "20",
        width: "30",
        depth: "40",
      },
    }))
  })

  it("displays correct dimensions", () => {
    const wrapper = renderWithWrappers(<Dimensions />)
    const inputs = wrapper.root.findAllByType(Input)
    expect(inputs[0].props.defaultValue).toBe("20")
    expect(inputs[1].props.defaultValue).toBe("30")
    expect(inputs[2].props.defaultValue).toBe("40")
  })
})
