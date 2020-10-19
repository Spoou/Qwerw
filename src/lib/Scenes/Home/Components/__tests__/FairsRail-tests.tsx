import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { cloneDeep } from "lodash"
import React from "react"
import "react-native"

import { FairsRail_fairsModule } from "__generated__/FairsRail_fairsModule.graphql"
import { extractText } from "lib/tests/extractText"
import { FairsRailFragmentContainer } from "../FairsRail"

import { CardRailCard } from "lib/Components/Home/CardRailCard"
import { navigate } from "lib/navigation/navigate"
import { useTracking } from "react-tracking"
import HomeAnalytics from "../../homeAnalytics"

const trackEvent = jest.fn()
const mockScrollRef = jest.fn()
const artworkNode = {
  node: {
    image: { url: "https://example.com/image.jpg" },
  },
}
const fairsModule: Omit<FairsRail_fairsModule, " $refType"> = {
  results: [
    {
      id: "the-fair",
      internalID: "the-fair-internal-id",
      name: "The Fair",
      slug: "the-fair",
      exhibitionPeriod: "Monday–Friday",
      location: {
        city: null,
        country: null,
      },
      profile: { slug: "https://neopets.com" },
      image: { url: "https://example.com/hero.jpg" },
      followedArtistArtworks: {
        edges: [artworkNode, artworkNode, artworkNode],
      },
      otherArtworks: {
        edges: [artworkNode, artworkNode, artworkNode],
      },
    },
    {
      id: "the-profileless-fair",
      internalID: "the-fair-internal-id",
      slug: "the-profileless-fair",
      name: "The Profileless Fair: You Should Not See Me in Snapshots",
      exhibitionPeriod: "Monday–Friday",
      location: {
        city: null,
        country: null,
      },
      profile: null,
      image: { url: "https://example.com/hero.jpg" },
      followedArtistArtworks: {
        edges: [artworkNode, artworkNode],
      },
      otherArtworks: {
        edges: [artworkNode, artworkNode],
      },
    },
  ],
}

it("renders without throwing an error", () => {
  renderWithWrappers(<FairsRailFragmentContainer fairsModule={fairsModule as any} scrollRef={mockScrollRef} />)
})

it("renders without throwing an error when missing artworks", () => {
  const fairsCopy = cloneDeep(fairsModule)
  fairsCopy.results.forEach((result) => {
    // @ts-ignore
    result.followedArtistArtworks.edges = []
    // @ts-ignore
    result.otherArtworks.edges = []
  })
  expect(() =>
    renderWithWrappers(<FairsRailFragmentContainer fairsModule={fairsCopy as any} scrollRef={mockScrollRef} />)
  ).not.toThrow()
})

describe("location", () => {
  it("handles when the city is specified", () => {
    const fairsCopy = cloneDeep(fairsModule)
    // @ts-ignore
    fairsCopy.results[0].location.city = "New Yawk"
    const tree = renderWithWrappers(
      <FairsRailFragmentContainer fairsModule={fairsCopy as any} scrollRef={mockScrollRef} />
    )
    expect(extractText(tree.root.findAllByProps({ "data-test-id": "card-subtitle" })[0])).toMatchInlineSnapshot(
      `"Monday–Friday  •  New Yawk"`
    )
  })

  it("handles falls back to country when city is unspecified", () => {
    const fairsCopy = cloneDeep(fairsModule)
    // @ts-ignore
    fairsCopy.results[0].location.country = "Canada"
    const tree = renderWithWrappers(
      <FairsRailFragmentContainer fairsModule={fairsCopy as any} scrollRef={mockScrollRef} />
    )
    expect(extractText(tree.root.findAllByProps({ "data-test-id": "card-subtitle" })[0])).toMatchInlineSnapshot(
      `"Monday–Friday  •  Canada"`
    )
  })
})

describe("navigation", () => {
  it("navigates to the fair url", () => {
    const tree = renderWithWrappers(
      <FairsRailFragmentContainer fairsModule={fairsModule as any} scrollRef={mockScrollRef} />
    )
    const cards = tree.root.findAllByType(CardRailCard)
    cards[0].props.onPress()
    expect(navigate).toHaveBeenCalledWith("/fair/the-fair")
  })
})

describe("analytics", () => {
  beforeEach(() => {
    ;(useTracking as jest.Mock).mockImplementation(() => {
      return {
        trackEvent,
      }
    })
  })

  it("tracks fair thumbnail taps", () => {
    const fairsCopy = cloneDeep(fairsModule)
    const tree = renderWithWrappers(
      <FairsRailFragmentContainer fairsModule={fairsCopy as any} scrollRef={mockScrollRef} />
    )
    const cards = tree.root.findAllByType(CardRailCard)
    cards[0].props.onPress()
    expect(trackEvent).toHaveBeenCalledWith(HomeAnalytics.fairThumbnailTapEvent("the-fair-internal-id", "the-fair", 0))
  })
})
