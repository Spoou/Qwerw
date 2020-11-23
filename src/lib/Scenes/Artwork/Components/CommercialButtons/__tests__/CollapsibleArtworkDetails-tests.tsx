import { CollapsibleArtworkDetailsTestsQuery } from "__generated__/CollapsibleArtworkDetailsTestsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ArtworkDetailsRow } from "lib/Scenes/Artwork/Components/ArtworkDetailsRow"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { CollapsibleArtworkDetailsFragmentContainer } from "../CollapsibleArtworkDetails"

jest.unmock("react-relay")

describe("CollapsibleArtworkDetails", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<CollapsibleArtworkDetailsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query CollapsibleArtworkDetailsTestsQuery @relay_test_operation {
          artwork(id: "some-slug") {
            ...CollapsibleArtworkDetails_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <CollapsibleArtworkDetailsFragmentContainer artwork={props.artwork} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const resolveData = (passedProps = {}) => {
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, passedProps)
    )
  }

  it("renders the data if available", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    expect(wrapper.root.findAllByType(OpaqueImageView)).toHaveLength(1)
    expect(wrapper.root.findAllByType(Text)).toHaveLength(2)
    expect(wrapper.root.findAllByType(ArtworkDetailsRow)).toHaveLength(0)
  })

  it("renders artist names", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        artistNames: "Vladimir Petrov, Kristina Kost",
      }),
    })
    expect(extractText(wrapper.root)).toContain("Vladimir Petrov, Kristina Kost")
  })

  it("expands component on press", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    expect(wrapper.root.findAllByType(Text)).toHaveLength(2)
    wrapper.root.findByType(TouchableOpacity).props.onPress()
    expect(wrapper.root.findAllByType(ArtworkDetailsRow)).toHaveLength(11)
  })

  it("doesn't render what it doesn't have", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        signatureInfo: {
          details: null,
        },
      }),
    })
    wrapper.root.findByType(TouchableOpacity).props.onPress()
    expect(wrapper.root.findAllByType(ArtworkDetailsRow)).toHaveLength(10)
  })
})
