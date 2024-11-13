import { SearchModalScreen } from "app/Scenes/SearchModal/SearchModal"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("SeachModal", () => {
  it("renders the search label properly", () => {
    renderWithWrappers(<SearchModalScreen />)

    expect(/Search artists, artworks, etc/).toBeTruthy()
  })
})
