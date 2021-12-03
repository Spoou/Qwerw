import { Route } from "@react-navigation/native"
import { useFormikContext } from "formik"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { ArtistAutosuggest } from "../Components/ArtistAutosuggest"
import { Dimensions } from "../Components/Dimensions"
import { MediumPicker } from "../Components/MediumPicker"
import { ArtworkFormMode } from "../MyCollectionArtworkFormModal"
import { MyCollectionArtworkFormMain } from "./MyCollectionArtworkFormMain"

jest.mock("formik")

jest.mock("lib/Components/FancyModal/FancyModalHeader", () => ({
  FancyModalHeader: () => null,
}))

jest.mock("../Components/ArtistAutosuggest", () => ({
  ArtistAutosuggest: () => null,
}))

jest.mock("../Components/MediumPicker", () => ({
  MediumPicker: () => null,
}))

jest.mock("../Components/MediumPicker", () => ({
  MediumPicker: () => null,
}))

jest.mock("../Components/Dimensions", () => ({
  Dimensions: () => null,
}))

const mockShowActionSheetWithOptions = jest.fn()

jest.mock("@expo/react-native-action-sheet", () => ({
  useActionSheet: () => ({ showActionSheetWithOptions: mockShowActionSheetWithOptions }),
}))

jest.mock("lib/utils/requestPhotos", () => ({
  showPhotoActionSheet: jest.fn(() => Promise.resolve({ photos: [] })),
}))

describe("AddEditArtwork", () => {
  const useFormikContextMock = useFormikContext as jest.Mock

  beforeEach(() => {
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: jest.fn(),
      values: {
        photos: [],
      },
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
    __globalStoreTestUtils__?.reset()
  })

  it("renders correct components on Add", () => {
    const mockNav = jest.fn()
    const mockRoute: Route<
      "ArtworkForm",
      {
        mode: ArtworkFormMode
        clearForm(): void
        onDelete?(): void
        onHeaderBackButtonPress(): void
      }
    > = {
      key: "ArtworkForm",
      name: "ArtworkForm",
      params: {
        mode: "add",
        clearForm: jest.fn(),
        onDelete: jest.fn(),
        onHeaderBackButtonPress: jest.fn(),
      },
    }
    const artworkForm = <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    const wrapper = renderWithWrappers(artworkForm)
    const expected = [FancyModalHeader, ArtistAutosuggest, MediumPicker, Dimensions]
    expected.forEach((Component) => {
      expect(wrapper.root.findByType(Component as React.ComponentType)).toBeDefined()
    })

    // not exposed components
    expect(wrapper.root.findByProps({ testID: "CompleteButton" })).toBeDefined()
    expect(wrapper.root.findByProps({ testID: "PhotosButton" })).toBeDefined()
    expect(wrapper.root.findByProps({ testID: "PhotosButton" })).toBeDefined()
  })

  it("renders correct components on Edit", () => {
    const mockNav = jest.fn()
    const mockRoute: Route<
      "ArtworkForm",
      {
        mode: ArtworkFormMode
        clearForm(): void
        onDelete?(): void
        onHeaderBackButtonPress(): void
      }
    > = {
      key: "ArtworkForm",
      name: "ArtworkForm",
      params: {
        mode: "edit",
        clearForm: jest.fn(),
        onDelete: jest.fn(),
        onHeaderBackButtonPress: jest.fn(),
      },
    }
    const artworkForm = <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    const wrapper = renderWithWrappers(artworkForm)
    const completeButton = wrapper.root.findByProps({ testID: "CompleteButton" })
    const deleteButton = wrapper.root.findByProps({ testID: "DeleteButton" })
    expect(completeButton).toBeDefined()
    expect(deleteButton).toBeDefined()
  })

  it("fires clear form on header Clear button click", () => {
    const mockNav = jest.fn()
    const mockClearForm = jest.fn()
    const mockRoute: Route<
      "ArtworkForm",
      {
        mode: ArtworkFormMode
        clearForm(): void
        onDelete?(): void
        onHeaderBackButtonPress(): void
      }
    > = {
      key: "ArtworkForm",
      name: "ArtworkForm",
      params: {
        mode: "edit",
        clearForm: mockClearForm,
        onDelete: jest.fn(),
        onHeaderBackButtonPress: jest.fn(),
      },
    }
    const artworkForm = <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    const wrapper = renderWithWrappers(artworkForm)
    wrapper.root.findByType(FancyModalHeader).props.onRightButtonPress()
    expect(mockClearForm).toHaveBeenCalled()
  })

  it("fires formik's handleSubmit on complete button click", () => {
    const spy = jest.fn()
    useFormikContextMock.mockImplementation(() => ({
      handleSubmit: spy,
      values: {
        photos: [],
      },
    }))
    const mockNav = jest.fn()
    const mockRoute: Route<
      "ArtworkForm",
      {
        mode: ArtworkFormMode
        clearForm(): void
        onDelete?(): void
        onHeaderBackButtonPress(): void
      }
    > = {
      key: "ArtworkForm",
      name: "ArtworkForm",
      params: {
        mode: "edit",
        clearForm: jest.fn(),
        onDelete: jest.fn(),
        onHeaderBackButtonPress: jest.fn(),
      },
    }
    const artworkForm = <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    const wrapper = renderWithWrappers(artworkForm)
    const completeButton = wrapper.root.findByProps({ testID: "CompleteButton" })
    completeButton.props.onPress()
    expect(spy).toHaveBeenCalled()
  })

  it("fires delete artwork action on delete button click", () => {
    const mockDelete = jest.fn()
    const mockNav = jest.fn()
    const mockRoute: Route<
      "ArtworkForm",
      {
        mode: ArtworkFormMode
        clearForm(): void
        onDelete?(): void
        onHeaderBackButtonPress(): void
      }
    > = {
      key: "ArtworkForm",
      name: "ArtworkForm",
      params: {
        mode: "edit",
        clearForm: jest.fn(),
        onDelete: mockDelete,
        onHeaderBackButtonPress: jest.fn(),
      },
    }

    const artworkForm = <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    const wrapper = renderWithWrappers(artworkForm)
    const deleteButton = wrapper.root.findByProps({ testID: "DeleteButton" })
    deleteButton.props.onPress()
    expect(mockShowActionSheetWithOptions).toHaveBeenCalled()
    const callback = mockShowActionSheetWithOptions.mock.calls[0][1]
    callback(0) // confirm deletion
    expect(mockDelete).toHaveBeenCalledWith()
  })

  it("navigates to additional details on click", () => {
    const mockNavigate = jest.fn()
    const mockNav = {
      navigate: mockNavigate,
    }
    const mockRoute: Route<
      "ArtworkForm",
      {
        mode: ArtworkFormMode
        clearForm(): void
        onDelete?(): void
        onHeaderBackButtonPress(): void
      }
    > = {
      key: "ArtworkForm",
      name: "ArtworkForm",
      params: {
        mode: "edit",
        clearForm: jest.fn(),
        onDelete: jest.fn(),
        onHeaderBackButtonPress: jest.fn(),
      },
    }
    const artworkForm = <MyCollectionArtworkFormMain navigation={mockNav as any} route={mockRoute} />
    const wrapper = renderWithWrappers(artworkForm)
    wrapper.root.findByProps({ testID: "AdditionalDetailsButton" }).props.onPress()
    expect(mockNavigate).toHaveBeenCalledWith("AdditionalDetails")
  })
})
