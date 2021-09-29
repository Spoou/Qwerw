import { TroveTestsQuery } from "__generated__/TroveTestsQuery.graphql"
import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Image, TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { TroveFragmentContainer } from "../Trove"

jest.unmock("react-relay")

describe("Trove", () => {
  let environment = createMockEnvironment()

  beforeEach(() => {
    environment = createMockEnvironment()
  })

  const TestRenderer = () => (
    <QueryRenderer<TroveTestsQuery>
      query={graphql`
        query TroveTestsQuery {
          homePage {
            ...Trove_trove
          }
        }
      `}
      render={({ props }) => (props?.homePage ? <TroveFragmentContainer trove={props.homePage} /> : null)}
      variables={{}}
      environment={environment}
    />
  )

  it("renders the trove", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    environment.mock.resolveMostRecentOperation((op) =>
      MockPayloadGenerator.generate(op, {
        HomePageHeroUnit() {
          return {
            title: "Trove",
            subtitle: "Browse available artworks by emerging artists.",
            creditLine: "",
          }
        },
      })
    )

    expect(tree.root.findAllByType(Image)).toHaveLength(1)
    expect(extractText(tree.root)).toMatchInlineSnapshot(`"TroveBrowse available artworks by emerging artists."`)
  })

  it("is tappable", () => {
    const tree = renderWithWrappers(<TestRenderer />)
    environment.mock.resolveMostRecentOperation((op) =>
      MockPayloadGenerator.generate(op, {
        HomePageHeroUnit() {
          return {
            title: "Trove",
            href: "/gene/trove",
          }
        },
      })
    )

    expect(navigate).not.toHaveBeenCalled()
    tree.root.findByType(TouchableOpacity).props.onPress()
    expect(navigate).toHaveBeenCalledWith("/gene/trove")
  })
})
