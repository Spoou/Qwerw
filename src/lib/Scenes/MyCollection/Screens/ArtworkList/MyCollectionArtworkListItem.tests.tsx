import { tappedCollectedArtwork } from "@artsy/cohesion"
import { MyCollectionArtworkListItemTestsQuery } from "__generated__/MyCollectionArtworkListItemTestsQuery.graphql"
import { navigate } from "lib/navigation/navigate"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { mockTrackEvent } from "lib/tests/globallyMockedStuff"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Image as RNImage } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkListItemFragmentContainer, tests } from "./MyCollectionArtworkListItem"

jest.unmock("react-relay")

describe("MyCollectionArtworkListItem", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkListItemTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkListItemTestsQuery @relay_test_operation {
          artwork(id: "some-slug") {
            ...MyCollectionArtwork_sharedProps @relay(mask: false)
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <MyCollectionArtworkListItemFragmentContainer artwork={props.artwork as any} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const resolveData = () => {
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Artwork: () => ({
          internalID: "artwork-id",
          slug: "artwork-slug",
          artist: {
            internalID: "artist-id",
          },
          medium: "artwork medium",
        }),
      })
    )
  }

  it("renders correct fields", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    expect(wrapper.root.findByType(tests.TouchElement)).toBeDefined()
    expect(wrapper.root.findByProps({ "data-test-id": "Image" })).toBeDefined()
    const text = extractText(wrapper.root)
    expect(text).toContain("artistNames")
    expect(text).toContain("title")
  })

  it("navigates to artwork detail on tap", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    wrapper.root.findByType(tests.TouchElement).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/my-collection/artwork/artwork-slug", {
      passProps: {
        artistInternalID: "artist-id",
        medium: "artwork medium",
      },
    })
  })

  it("tracks analytics event on tap", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    wrapper.root.findByType(tests.TouchElement).props.onPress()

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith(
      tappedCollectedArtwork({
        destinationOwnerId: "artwork-id",
        destinationOwnerSlug: "artwork-slug",
      })
    )
  })

  it("uses last uploaded image as a fallback when no url is present", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    __globalStoreTestUtils__?.injectState({
      myCollection: {
        artwork: {
          sessionState: {
            lastUploadedPhoto: {
              path: "some-local-path",
              width: 90,
              height: 90,
            },
          },
        },
      },
    })
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Artwork: () => ({
          images: [
            {
              url: null,
            },
          ],
        }),
      })
    )
    const image = wrapper.root.findByType(RNImage)
    expect(image.props.source).toEqual({ uri: "some-local-path" })
  })
})
