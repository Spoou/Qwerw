import { Input2 } from "@artsy/palette-mobile"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { useFormikContext } from "formik"
import { Dimensions } from "./Dimensions"

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
    const view = renderWithWrappersLEGACY(<Dimensions />)
    // eslint-disable-next-line testing-library/await-async-queries
    const inputs = view.root.findAllByType(Input2)
    expect(inputs[0].props.value).toBe("20")
    expect(inputs[1].props.value).toBe("30")
    expect(inputs[2].props.value).toBe("40")
  })
})
