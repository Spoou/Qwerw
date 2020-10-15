import { Fair2ExhibitorRailTestsQuery } from "__generated__/Fair2ExhibitorRailTestsQuery.graphql"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { useTracking } from "react-tracking"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Fair2ExhibitorRailFragmentContainer } from "../Components/Fair2ExhibitorRail"

jest.unmock("react-relay")

describe("FairExhibitors", () => {
  const trackEvent = useTracking().trackEvent
  const getWrapper = (mockResolvers = {}) => {
    const env = createMockEnvironment()

    const tree = renderWithWrappers(
      <QueryRenderer<Fair2ExhibitorRailTestsQuery>
        environment={env}
        query={graphql`
          query Fair2ExhibitorRailTestsQuery($showID: String!) @relay_test_operation {
            show(id: $showID) {
              ...Fair2ExhibitorRail_show
            }
          }
        `}
        variables={{ showID: "gagosian-at-art-basel-hong-kong-2020" }}
        render={({ props, error }) => {
          if (error) {
            console.log(error)
            return null
          }

          if (!props || !props.show) {
            return null
          }

          return <Fair2ExhibitorRailFragmentContainer show={props.show} />
        }}
      />
    )

    env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation, mockResolvers))

    return tree
  }

  it("renders an exhibitor rail", () => {
    const wrapper = getWrapper({
      Show: () => ({
        partner: {
          name: "First Partner Has Artworks",
        },
      }),
    })
    expect(extractText(wrapper.root)).toContain("First Partner Has Artworks")
  })

  it("tracks taps on artworks in the rail", () => {
    const wrapper = getWrapper({
      Show: () => ({
        fair: {
          internalID: "abc123",
          slug: "some-fair",
        },
        artworks: {
          edges: [
            {
              node: {
                internalID: "artwork1234",
                slug: "cool-artwork-1",
              },
            },
          ],
        },
      }),
    })
    const artwork = wrapper.root.findAllByType(ArtworkTileRailCard)[0]
    act(() => artwork.props.onPress())
    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "galleryBoothRail",
      context_screen_owner_id: "abc123",
      context_screen_owner_slug: "some-fair",
      context_screen_owner_type: "fair",
      destination_screen_owner_id: "artwork1234",
      destination_screen_owner_slug: "cool-artwork-1",
      destination_screen_owner_type: "artwork",
      horizontal_slide_position: 0,
      type: "thumbnail",
    })
  })

  it("tracks taps on the show", () => {
    const wrapper = getWrapper({
      Show: () => ({
        internalID: "xxx-2",
        slug: "example-2",
        fair: {
          internalID: "abc123",
          slug: "some-fair",
        },
      }),
    })
    const show = wrapper.root.findAllByType(SectionTitle)[0]
    act(() => show.props.onPress())
    expect(trackEvent).toHaveBeenCalledWith({
      action: "tappedArtworkGroup",
      context_module: "galleryBoothRail",
      context_screen_owner_id: "abc123",
      context_screen_owner_slug: "some-fair",
      context_screen_owner_type: "fair",
      destination_screen_owner_id: "xxx-2",
      destination_screen_owner_slug: "example-2",
      destination_screen_owner_type: "show",
      type: "viewAll",
    })
  })
})
