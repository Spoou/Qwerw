import { ViewingRoomViewWorksButtonTestsQuery } from "__generated__/ViewingRoomViewWorksButtonTestsQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { tracks, ViewingRoomViewWorksButtonContainer } from "../ViewingRoomViewWorksButton"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

describe("ViewingRoomViewWorksButton", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<ViewingRoomViewWorksButtonTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query ViewingRoomViewWorksButtonTestsQuery {
          viewingRoom(id: "unused") {
            ...ViewingRoomViewWorksButton_viewingRoom
          }
        }
      `}
      render={renderWithLoadProgress(ViewingRoomViewWorksButtonContainer)}
      variables={{}}
    />
  )
  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("navigates to artworks page + calls tracking on button press", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironment.mock.resolveMostRecentOperation((operation) => {
      const result = MockPayloadGenerator.generate(operation, {
        ViewingRoom: () => ({
          artworksForCount: { totalCount: 42 },
          slug: "gallery-name-viewing-room-name",
          internalID: "2955ab33-c205-44ea-93d2-514cd7ee2bcd",
        }),
      })
      return result
    })

    tree.root.findByType(TouchableWithoutFeedback).props.onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/viewing-room/gallery-name-viewing-room-name/artworks"
    )

    expect(useTracking().trackEvent).toHaveBeenCalledWith(
      tracks.tappedViewWorksButton("2955ab33-c205-44ea-93d2-514cd7ee2bcd", "gallery-name-viewing-room-name")
    )
  })
})
