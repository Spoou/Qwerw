import { OwnerType } from "@artsy/cohesion"
import { fireEvent, waitFor } from "@testing-library/react-native"
import { ATTRIBUTION_CLASS_OPTIONS } from "app/Components/ArtworkFilter/Filters/AttributionClassOptions"
import {
  SavedSearchModel,
  SavedSearchStoreProvider,
  savedSearchModel,
} from "app/Scenes/SavedSearchAlert/SavedSearchStore"
import { AddFiltersScreenRarity } from "app/Scenes/SavedSearchAlert/screens/AddFiltersScreenRarity"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

const black100Hex = "#000000"

describe("AddFiltersScreenRarity", () => {
  it("shows all available rarity options unselected", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <AddFiltersScreenRarity />
      </SavedSearchStoreProvider>
    )

    ATTRIBUTION_CLASS_OPTIONS.forEach((option) => {
      expect(getByText(option.displayText)).toBeDefined()
      expect(getByText(option.displayText)).toHaveStyle({
        color: black100Hex,
      })
    })
  })

  it("shows the right selected state with the right colors", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <AddFiltersScreenRarity />
      </SavedSearchStoreProvider>
    )

    expect(getByText("Unique")).not.toHaveStyle({ color: black100Hex })
    expect(getByText("Limited Edition")).toHaveStyle({ color: black100Hex })
    expect(getByText("Open Edition")).toHaveStyle({ color: black100Hex })
    expect(getByText("Unknown Edition")).toHaveStyle({ color: black100Hex })
  })

  it("Updates selected filters on press", () => {
    const { getByText } = renderWithWrappers(
      <SavedSearchStoreProvider runtimeModel={initialData}>
        <AddFiltersScreenRarity />
      </SavedSearchStoreProvider>
    )

    expect(getByText("Unique")).toHaveStyle({ color: black100Hex })

    fireEvent(getByText("Unique"), "onPress")

    waitFor(() => {
      expect(getByText("Unique")).not.toHaveStyle({ color: black100Hex })
    })
  })
})

const initialData: SavedSearchModel = {
  ...savedSearchModel,
  attributes: {
    attributionClass: ["open edition"],
    atAuction: true,
  },
  entity: {
    artists: [{ id: "artistID", name: "Banksy" }],
    owner: {
      type: OwnerType.artist,
      id: "ownerId",
      slug: "ownerSlug",
    },
  },
}