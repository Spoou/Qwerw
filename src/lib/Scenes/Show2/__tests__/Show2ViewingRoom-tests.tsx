import { Show2ViewingRoomTestsQuery } from "__generated__/Show2ViewingRoomTestsQuery.graphql"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Show2ViewingRoomFragmentContainer } from "../Components/Show2ViewingRoom"

jest.unmock("react-relay")

describe("Show2ViewingRoom", () => {
  let env: ReturnType<typeof createMockEnvironment>
  const trackEvent = jest.fn()

  beforeEach(() => {
    env = createMockEnvironment()
    ;(useTracking as jest.Mock).mockImplementation(() => ({ trackEvent }))
  })

  afterEach(() => {
    trackEvent.mockClear()
  })

  const TestRenderer = () => (
    <QueryRenderer<Show2ViewingRoomTestsQuery>
      environment={env}
      query={graphql`
        query Show2ViewingRoomTestsQuery($showID: String!) @relay_test_operation {
          show(id: $showID) {
            ...Show2ViewingRoom_show
          }
        }
      `}
      variables={{ showID: "the-big-show" }}
      render={({ props, error }) => {
        if (props?.show) {
          return <Show2ViewingRoomFragmentContainer show={props.show} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))
    })
    return tree
  }

  it("renders the viewing room card", () => {
    const wrapper = getWrapper({
      Partner: () => ({ name: "Example Partner" }),
      ViewingRoom: () => ({ title: "Example Viewing Room" }),
    })

    const text = extractText(wrapper.root)

    expect(text).toContain("Example Partner")
    expect(text).toContain("Example Viewing Room")
  })

  it("tracks taps", () => {
    const wrapper = getWrapper({
      Show: () => ({ internalID: "example-show-id", slug: "example-slug" }),
      ViewingRoom: () => ({ internalID: "example-viewing-room-id", slug: "example-viewing-room-slug" }),
    })

    act(() => {
      wrapper.root.findAllByType(TouchableOpacity)[0].props.onPress()
    })

    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedViewingRoomCard",
      context_module: "associatedViewingRoom",
      context_screen_owner_id: "example-show-id",
      context_screen_owner_slug: "example-slug",
      context_screen_owner_type: "show",
      destination_screen_owner_id: "example-viewing-room-id",
      destination_screen_owner_slug: "example-viewing-room-slug",
      destination_screen_owner_type: "viewingRoom",
      type: "thumbnail",
    })
  })
})
