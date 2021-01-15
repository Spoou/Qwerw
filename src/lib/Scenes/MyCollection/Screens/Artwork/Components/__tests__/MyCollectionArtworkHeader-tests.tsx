import { tappedCollectedArtworkImages } from "@artsy/cohesion"
import { MyCollectionArtworkHeaderTestsQuery } from "__generated__/MyCollectionArtworkHeaderTestsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { ArtworkIcon } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment } from "relay-test-utils"
import { MyCollectionArtworkHeaderRefetchContainer } from "../MyCollectionArtworkHeader"

jest.unmock("react-relay")

describe("MyCollectionArtworkHeader", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkHeaderTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkHeaderTestsQuery @relay_test_operation {
          artwork(id: "some-slug") {
            ...MyCollectionArtworkHeader_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <MyCollectionArtworkHeaderRefetchContainer artwork={props.artwork} />
        }
        return null
      }}
    />
  )

  const trackEvent = jest.fn()

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()

    const mockTracking = useTracking as jest.Mock
    mockTracking.mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(mockEnvironment, mockResolvers)
    return tree
  }

  it("renders without throwing an error", () => {
    const wrapper = getWrapper({
      Artwork: () => ({
        artistNames: "some artist name",
        date: "Jan 20th",
        image: {
          url: "some/url",
        },
        title: "some title",
      }),
    })

    const text = extractText(wrapper.root)
    expect(text).toContain("some artist name")
    expect(text).toContain("some title, Jan 20th")
    expect(wrapper.root.findAllByType(OpaqueImageView)).toBeDefined()
  })

  it("navigates to images page when image is pressed", () => {
    const wrapper = getWrapper({
      Artwork: () => ({
        internalID: "1234",
      }),
    })
    wrapper.root.findAllByType(TouchableOpacity)[0].props.onPress()
    expect(navigate).toHaveBeenCalledWith("/my-collection/artwork-images/1234")
  })

  it("fires the analytics tracking event when image is pressed", () => {
    const wrapper = getWrapper({
      Artwork: () => ({
        internalID: "someInternalId",
        slug: "someSlug",
      }),
    })
    wrapper.root.findAllByType(TouchableOpacity)[0].props.onPress()
    expect(trackEvent).toHaveBeenCalledTimes(1)
    expect(trackEvent).toHaveBeenCalledWith(
      tappedCollectedArtworkImages({ contextOwnerId: "someInternalId", contextOwnerSlug: "someSlug" })
    )
  })

  it("shows a processing state when image data is incomplete", () => {
    const wrapper = getWrapper({
      Artwork: () => ({
        artistNames: "some artist name",
        date: "Jan 20th",
        images: [
          {
            url: "some/url",
            height: null,
            isDefault: true,
          },
        ],
        title: "some title",
      }),
    })
    expect(wrapper.root.findAllByType(OpaqueImageView)).toHaveLength(0)
    expect(wrapper.root.findByType(ArtworkIcon)).toBeDefined()
    expect(extractText(wrapper.root)).toContain("Processing photo")
  })
})
