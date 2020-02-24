import { Theme } from "@artsy/palette"
import { FeaturedArtistsTestsQueryRawResponse } from "__generated__/FeaturedArtistsTestsQuery.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { mockTracking } from "lib/tests/mockTracking"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"
import { FeaturedArtistCollectionFixture } from "../__fixtures__/CollectionFixture"
import { CollectionFeaturedArtistsContainer as FeaturedArtists, ViewAll } from "../FeaturedArtists"
jest.unmock("react-relay")
jest.unmock("react-tracking")
jest.mock("lib/NativeModules/Events", () => ({ postEvent: jest.fn() }))
import Events from "lib/NativeModules/Events"

jest.mock("lib/NativeModules/SwitchBoard", () => ({ presentNavigationViewController: jest.fn() }))

const SwitchBoardMock = SwitchBoard as any
const { anything } = expect

describe("FeaturedArtists", () => {
  const render = (collection: FeaturedArtistsTestsQueryRawResponse["marketingCollection"]) =>
    renderRelayTree({
      Component: mockTracking(({ marketingCollection }) => (
        <Theme>
          <FeaturedArtists collection={marketingCollection} />
        </Theme>
      )),
      query: graphql`
        query FeaturedArtistsTestsQuery @raw_response_type {
          marketingCollection(slug: "emerging-photographers") {
            ...FeaturedArtists_collection
          }
        }
      `,
      mockData: {
        marketingCollection: collection,
      },
    })

  it("renders properly", async () => {
    const tree = await render(FeaturedArtistCollectionFixture)
    expect(tree.html()).toMatchSnapshot()
  })

  it("renders an EntityHeader for each featured artist", async () => {
    const tree = await render(FeaturedArtistCollectionFixture)

    const entityHeaders = tree.find("EntityHeader")
    expect(entityHeaders.length).toEqual(3)

    const output = tree.html()
    expect(output).toContain("Pablo Picasso")
    expect(output).toContain("Andy Warhol")
    expect(output).toContain("Joan Miro")
    expect(output).toContain("View all")
  })

  it("does not render an EntityHeader for excluded artists", async () => {
    const tree = await render({
      ...FeaturedArtistCollectionFixture,
      featuredArtistExclusionIds: ["34534-andy-warhols-id", "2342-pablo-picassos-id"],
    })

    const entityHeaders = tree.find("EntityHeader")
    expect(entityHeaders.length).toEqual(3)

    const output = tree.html()
    expect(output).toContain("Joan Miro")
    expect(output).not.toContain("Andy Warhol")
    expect(output).not.toContain("Pablo Picasso")
    expect(output).toContain("Jean-Michel Basquiat")
    expect(output).toContain("Kenny Scharf")
  })

  describe("when artist ids are explicitly requested", () => {
    it("does not render an EntityHeader for any non-requested artists", async () => {
      const tree = await render({
        ...FeaturedArtistCollectionFixture,
        query: { id: "some-id", artistIDs: ["34534-andy-warhols-id"] },
      })

      const entityHeaders = tree.find("EntityHeader")
      expect(entityHeaders.length).toEqual(1)

      const output = tree.html()
      expect(output).toContain("Andy Warhol")
      expect(output).not.toContain("Joan Miro")
      expect(output).not.toContain("Pablo Picasso")
    })
  })

  describe("View all", () => {
    beforeEach(() => {
      SwitchBoardMock.presentNavigationViewController.mockReset()
    })

    it("shows more artists when 'View more' is tapped", async () => {
      const tree = await render(FeaturedArtistCollectionFixture)
      const output = tree.html()
      expect(output).toContain("View all")
      expect(output).not.toContain("Jean-Michel Basquiat")
      expect(output).not.toContain("Kenny Scharf")

      const viewAll = tree.find(ViewAll)
      viewAll.simulate("click")

      expect(SwitchBoardMock.presentNavigationViewController).toHaveBeenCalledWith(
        anything(),
        "/collection/some-collection/artists"
      )
    })

    it("tracks an event when 'View more' is tapped", async () => {
      const tree = await render(FeaturedArtistCollectionFixture)
      const viewAll = tree.find(ViewAll)

      viewAll.simulate("click")

      expect(Events.postEvent).toHaveBeenCalledWith({
        action_type: "tap",
        action_name: "viewMore",
        context_module: "FeaturedArtists",
        context_screen: "Collection",
        flow: "FeaturedArtists",
      })
    })
  })
})
