import { MyCollectionArtworkListTestsQuery } from "__generated__/MyCollectionArtworkListTestsQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { AppStore } from "lib/store/AppStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { MyCollectionArtworkListContainer } from "../MyCollectionArtworkList"
import { MyCollectionArtworkListItemFragmentContainer } from "../MyCollectionArtworkListItem"

jest.unmock("react-relay")

describe("MyCollectionArtworkList", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionArtworkListTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionArtworkListTestsQuery @relay_test_operation {
          me {
            ...MyCollectionArtworkList_me
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.me) {
          return <MyCollectionArtworkListContainer me={props.me} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation, mockResolvers)
      )
    })
    return tree
  }

  const getZeroStateWrapper = () =>
    getWrapper({
      Me: () => ({
        myCollectionConnection: {
          edges: [],
        },
      }),
    })

  it("renders without throwing an error", () => {
    const tree = getWrapper()
    expect(tree.root.findByType(FancyModalHeader)).toBeDefined()
    expect(tree.root.findByType(FlatList)).toBeDefined()
    expect(tree.root.findByType(MyCollectionArtworkListItemFragmentContainer)).toBeDefined()
  })

  it("shows zerostate when collection is empty", () => {
    const tree = getZeroStateWrapper()
    expect(extractText(tree.root)).toContain("Add a work from your collection to access price and market insights")
  })

  it("calls proper actions on press", () => {
    const spy = jest.fn()
    const navSpy = jest.fn()
    AppStore.actions.myCollection.artwork.setMeGlobalId = spy as any
    AppStore.actions.myCollection.navigation.navigateToAddArtwork = navSpy as any
    const tree = getWrapper()
    tree.root.findByType(FancyModalHeader).props.onRightButtonPress()
    expect(spy).toHaveBeenCalledWith("<Me-mock-id-1>")
    expect(navSpy).toHaveBeenCalled()
  })

  it("calls proper actions on zero state button press", () => {
    const spy = jest.fn()
    const navSpy = jest.fn()
    AppStore.actions.myCollection.artwork.setMeGlobalId = spy as any
    AppStore.actions.myCollection.navigation.navigateToAddArtwork = navSpy as any
    const tree = getZeroStateWrapper()
    tree.root.findByType(Button).props.onPress()
    expect(spy).toHaveBeenCalledWith("<Me-mock-id-1>")
    expect(navSpy).toHaveBeenCalled()
  })
})
