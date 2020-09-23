import { formatMedium } from "../formatArtworkMedium"

describe("formatArtworkMedium", () => {
  it("formats medium correctly", () => {
    expect(formatMedium("PAINTING")).toBe("Painting")
    expect(formatMedium("some other medium")).toBe("Some other medium")
  })
})
