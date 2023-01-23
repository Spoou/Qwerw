import { navigate } from "app/system/navigation/navigate"
import { extractText } from "app/utils/tests/extractText"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { Image, TouchableOpacity } from "react-native"
import { CityGuideCTA } from "./CityGuideCTA"

describe("Search page empty state", () => {
  it(`renders correctly`, async () => {
    const tree = renderWithWrappersLEGACY(<CityGuideCTA />)
    expect(extractText(tree.root)).toContain("Explore Art on View")
    expect(tree.root.findAllByType(Image)).toHaveLength(2)
  })

  it(`navigates to cityGuide link`, () => {
    const tree = renderWithWrappersLEGACY(<CityGuideCTA />)
    tree.root.findByType(TouchableOpacity).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/local-discovery")
  })
})
