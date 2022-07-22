import "react-native"
import { graphql, QueryRenderer } from "react-relay"

import { RecentlySoldTestsQuery } from "__generated__/RecentlySoldTestsQuery.graphql"
import { ArtworkRailCard } from "app/Components/ArtworkRail/ArtworkRailCard"
import { extractText } from "app/tests/extractText"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import renderWithLoadProgress from "app/utils/renderWithLoadProgress"
import { act } from "react-test-renderer"
import { RecentlySoldFragmentContainer } from "./RecentlySold"

describe("RecentlySold", () => {
  const TestRenderer = () => (
    <QueryRenderer<RecentlySoldTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query RecentlySoldTestsQuery {
          targetSupply {
            ...RecentlySold_targetSupply
          }
        }
      `}
      render={renderWithLoadProgress(RecentlySoldFragmentContainer)}
      variables={{}}
    />
  )

  it("renders sale message if artwork has realized price", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    const artwork = {
      realizedPrice: "$1,200",
    }
    const targetSupply = makeTargetSupply([artwork])

    resolveMostRecentRelayOperation({
      TargetSupply: () => targetSupply,
    })

    expect(extractText(tree.root)).toContain("Sold for $1,200")
  })

  it("does not render any sale message if artwork has no realized price", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    const artwork = {
      realizedPrice: null,
    }
    const targetSupply = makeTargetSupply([artwork])

    resolveMostRecentRelayOperation({
      TargetSupply: () => targetSupply,
    })

    expect(extractText(tree.root)).not.toContain("Sold for")
  })

  it("renders an artwork for each artist", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    const targetSupply = makeTargetSupply([
      {
        artistNames: "artist #1",
      },
      {
        artistNames: "artist #2",
      },
      {
        artistNames: "artist #3",
      },
      {
        artistNames: "artist #4",
      },
      {
        artistNames: "artist #5",
      },
    ])

    resolveMostRecentRelayOperation({
      TargetSupply: () => targetSupply,
    })

    const text = extractText(tree.root)
    expect(text).toContain("artist #1")
    expect(text).toContain("artist #2")
    expect(text).toContain("artist #3")
    expect(text).toContain("artist #4")
    expect(text).toContain("artist #5")
  })

  it("tracks an event for tapping an artwork", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)

    const artwork = {
      internalID: "artwork-id",
      slug: "artwork-slug",
    }
    const targetSupply = makeTargetSupply([artwork])
    resolveMostRecentRelayOperation({
      TargetSupply: () => targetSupply,
    })

    const artworkWrapper = tree.root.findAllByType(ArtworkRailCard)[0]
    act(() => artworkWrapper.props.onPress())

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        context_module: "artworkRecentlySoldGrid",
        context_screen_owner_type: "sell",
        destination_screen_owner_id: "artwork-id",
        destination_screen_owner_slug: "artwork-slug",
        destination_screen_owner_type: "artwork",
        type: "thumbnail",
      })
    )
  })
})

function makeTargetSupply(
  artworks: Array<{
    artistNames?: string
    realizedPrice?: string | null
    slug?: string
    internalID?: string
  }>
) {
  const items = artworks.map((artwork) => {
    return {
      artworksConnection: {
        edges: [
          {
            node: artwork,
          },
        ],
      },
    }
  })

  return {
    microfunnel: items,
  }
}
