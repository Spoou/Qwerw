import { ShowViewingRoomTestsQuery } from "__generated__/ShowViewingRoomTestsQuery.graphql"
import { extractText } from "app/tests/extractText"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { ShowViewingRoomFragmentContainer } from "./Components/ShowViewingRoom"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"

describe("ShowViewingRoom", () => {
  const TestRenderer = () => (
    <QueryRenderer<ShowViewingRoomTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query ShowViewingRoomTestsQuery($showID: String!) @relay_test_operation {
          show(id: $showID) {
            ...ShowViewingRoom_show
          }
        }
      `}
      variables={{ showID: "the-big-show" }}
      render={({ props, error }) => {
        if (props?.show) {
          return <ShowViewingRoomFragmentContainer show={props.show} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = (resolvers = {}) => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation(resolvers)
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
      ViewingRoom: () => ({
        internalID: "example-viewing-room-id",
        slug: "example-viewing-room-slug",
      }),
    })

    act(() => {
      wrapper.root.findAllByType(TouchableOpacity)[0].props.onPress()
    })

    expect(mockTrackEvent).toHaveBeenCalledWith({
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
