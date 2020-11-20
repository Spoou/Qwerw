jest.mock("../../../../../utils/googleMaps", () => ({ getLocationPredictions: jest.fn() }))
import { Input } from "lib/Components/Input/Input"
import { extractText } from "lib/tests/extractText"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { getLocationPredictions, SimpleLocation } from "lib/utils/googleMaps"
import { Touchable } from "palette"
import React from "react"
import { ReactTestRenderer } from "react-test-renderer"
import { LocationAutocomplete, LocationPredictions } from "../LocationAutocomplete"
import { press, typeInInput } from "./helpers"

const mockOnChange = jest.fn()
const getWrapper = (initialLocation: SimpleLocation | null = null) =>
  renderWithWrappers(<LocationAutocomplete initialLocation={initialLocation} onChange={mockOnChange} />)

const locationQueryResult = [
  { id: "a", name: "Busytown, USA" },
  { id: "b", name: "Hello, USA" },
]

describe("<LocationAutocomplete/>", () => {
  let wrapper: ReactTestRenderer

  it("pre-fills the input with an initialLocation prop", async () => {
    wrapper = getWrapper({ id: "1234", name: "Anytown, USA" })
    expect(wrapper.root.findByType(Input).props.value).toEqual("Anytown, USA")
  })

  describe("no preselected location", () => {
    beforeEach(() => {
      ;(getLocationPredictions as jest.Mock).mockResolvedValue(locationQueryResult)
      wrapper = getWrapper()
    })

    it("queries google when the user types 3 or more characters", async () => {
      await typeInInput(wrapper.root, "h")

      expect(getLocationPredictions).not.toHaveBeenCalled()
      expect(wrapper.root.findAllByProps({ "data-test-id": "dropdown" }).length).toEqual(0)

      await typeInInput(wrapper.root, "he")

      expect(getLocationPredictions).not.toHaveBeenCalled()
      expect(wrapper.root.findAllByProps({ "data-test-id": "dropdown" }).length).toEqual(0)

      await typeInInput(wrapper.root, "hel")

      expect(getLocationPredictions).toHaveBeenCalled()
      expect(wrapper.root.findAllByProps({ "data-test-id": "dropdown" }).length).not.toEqual(0)
      const text = extractText(wrapper.root)
      expect(text).toContain("Busytown, USA")
      expect(text).toContain("Hello, USA")
    })
  })

  it("calls the onChange prop and clears the predictions when the user selects a location", async () => {
    await typeInInput(wrapper.root, "hel")
    await press(wrapper.root, { text: "Busytown, USA", componentType: Touchable })

    expect(mockOnChange).toHaveBeenCalledWith({ id: "a", name: "Busytown, USA" })
    expect(wrapper.root.findByType(Input).props.value).toMatch("Busytown, USA")
    expect(wrapper.root.findAllByProps({ "data-test-id": "dropdown" }).length).toEqual(0)
  })

  it.skip("restores the selected location when the user selects a location, taps back into the input, then exits it again", async () => {
    // not sure this is actually a product requirement
    expect(false).toBeTruthy()
  })

  it("hides the predictions when the user un-focuses the input", async () => {
    await typeInInput(wrapper.root, "Hel")
    wrapper.root.findByType(LocationPredictions).props.onOutsidePress()
    await flushPromiseQueue()

    expect(wrapper.root.findAllByProps({ "data-test-id": "dropdown" }).length).toEqual(0)
  })

  it("Highlights matched text in the autocomplete", async () => {
    ;(getLocationPredictions as jest.Mock).mockResolvedValue([{ id: "x", name: "Hello, World" }])
    await typeInInput(wrapper.root, "hell World")

    expect(extractText(wrapper.root)).toContain("Hello, World")
    expect(wrapper.root.findAllByProps({ fontWeight: "bold" }).map((t) => extractText(t))).toEqual(
      expect.arrayContaining(["Hell", "World"])
    )
  })
})
