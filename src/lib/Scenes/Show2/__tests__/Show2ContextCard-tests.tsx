import { Show2ContextCardTestsQuery } from "__generated__/Show2ContextCardTestsQuery.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { Show2ContextCard, Show2ContextCardFragmentContainer } from "../Components/Show2ContextCard"

jest.unmock("react-relay")

describe("Show2ContextCard", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<Show2ContextCardTestsQuery>
      environment={env}
      query={graphql`
        query Show2ContextCardTestsQuery($showID: String!) @relay_test_operation {
          show(id: $showID) {
            ...Show2ContextCard_show
          }
        }
      `}
      variables={{ showID: "the-big-show" }}
      render={({ props, error }) => {
        if (props?.show) {
          return <Show2ContextCardFragmentContainer show={props.show} />
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

  it("renders without throwing an error", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(Show2ContextCard)).toHaveLength(1)
  })

  describe("when the show is a fair booth", () => {
    it("renders contextual info about the fair", () => {
      const wrapper = getWrapper({
        Show: () => ({
          isFairBooth: true,
          fair: {
            name: "IFPDA Print Fair 2020",
            exhibitionPeriod: "Jan 1 - Jan 31",
            profile: {
              icon: { imageUrl: "http://test.artsy.net/fair-logo.jpg" },
            },
            image: {
              imageUrl: "http://test.artsy.net/fair-main.jpg",
            },
          },
        }),
      })

      const text = extractText(wrapper.root)
      expect(text).toMatch("Part of IFPDA Print Fair 2020")
      expect(text).toMatch("Jan 1 - Jan 31")

      const renderedImages = wrapper.root.findAllByType(OpaqueImageView).map((img) => img.props.imageURL)
      expect(renderedImages).toContain("http://test.artsy.net/fair-logo.jpg")
      expect(renderedImages).toContain("http://test.artsy.net/fair-main.jpg")
    })

    it("navigates to the fair", () => {
      const wrapper = getWrapper({
        Show: () => ({
          isFairBooth: true,
          fair: {
            slug: "ifpda-2020",
          },
        }),
      })

      const title = wrapper.root.findByType(SectionTitle)
      title.props.onPress()
      expect(navigate).toHaveBeenCalledWith("fair/ifpda-2020")
    })
  })

  describe("when show is not a fair booth", () => {
    it("renders contextual info about the partner", () => {
      const wrapper = getWrapper({
        Show: () => ({
          isFairBooth: false,
          partner: {
            name: "Pace Prints",
            cities: ["New York", "London"],
            artworksConnection: {
              edges: [
                { node: { image: { url: "http://test.artsy.net/artwork-1.jpg" } } },
                { node: { image: { url: "http://test.artsy.net/artwork-2.jpg" } } },
                { node: { image: { url: "http://test.artsy.net/artwork-3.jpg" } } },
              ],
            },
          },
        }),
      })

      const text = extractText(wrapper.root)
      expect(text).toMatch("Presented by Pace Prints")
      expect(text).toMatch("New York, London")

      const renderedImages = wrapper.root.findAllByType(OpaqueImageView).map((img) => img.props.imageURL)
      expect(renderedImages).toContain("http://test.artsy.net/artwork-1.jpg")
      expect(renderedImages).toContain("http://test.artsy.net/artwork-2.jpg")
      expect(renderedImages).toContain("http://test.artsy.net/artwork-3.jpg")
    })

    it("navigates to the partner profile", () => {
      const wrapper = getWrapper({
        Show: () => ({
          isFairBooth: false,
          partner: {
            profile: {
              slug: "pace-prints",
            },
          },
        }),
      })

      const title = wrapper.root.findByType(SectionTitle)
      title.props.onPress()
      expect(navigate).toHaveBeenCalledWith("pace-prints")
    })
  })
})
