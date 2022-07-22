import { ArtistSeriesFullArtistSeriesListTestsQuery } from "__generated__/ArtistSeriesFullArtistSeriesListTestsQuery.graphql"
import { ArtistSeriesFullArtistSeriesListFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesFullArtistSeriesList"
import { ArtistSeriesListItem } from "app/Scenes/ArtistSeries/ArtistSeriesListItem"
import { extractText } from "app/tests/extractText"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { Touchable } from "palette"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"

describe("Full Artist Series List", () => {
  const TestRenderer = () => (
    <QueryRenderer<ArtistSeriesFullArtistSeriesListTestsQuery>
      environment={env}
      query={graphql`
        query ArtistSeriesFullArtistSeriesListTestsQuery @raw_response_type {
          artist(id: "a-great-artist") {
            ...ArtistSeriesFullArtistSeriesList_artist
          }
        }
      `}
      variables={{ artistID: "a-great-artist" }}
      render={({ props, error }) => {
        if (props?.artist) {
          return <ArtistSeriesFullArtistSeriesListFragmentContainer artist={props.artist} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const getWrapper = () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          ...ArtistSeriesFullArtistSeriesListFixture,
        },
      })
    })
    return tree
  }

  it("renders the Full Artist Series Page Header", () => {
    const wrapper = getWrapper()
    expect(extractText(wrapper.root)).toContain("Artist Series")
  })

  it("renders the all of an artist's associated Artist Series", () => {
    const wrapper = getWrapper()
    expect(wrapper.root.findAllByType(ArtistSeriesListItem)).toHaveLength(6)
  })

  it("tracks clicks on an artist series", () => {
    const wrapper = getWrapper()
    const seriesButton = wrapper.root.findAllByType(ArtistSeriesListItem)[0].findByType(Touchable)
    seriesButton.props.onPress()
    expect(mockTrackEvent.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "action": "tappedArtistSeriesGroup",
          "context_module": "artistSeriesRail",
          "context_screen_owner_id": undefined,
          "context_screen_owner_slug": undefined,
          "context_screen_owner_type": "allArtistSeries",
          "curation_boost": true,
          "destination_screen_owner_id": "da821a13-92fc-49c2-bbd5-bebb790f7020",
          "destination_screen_owner_slug": "yayoi-kusama-plums",
          "destination_screen_owner_type": "artistSeries",
          "horizontal_slide_position": 0,
          "type": "thumbnail",
        },
      ]
    `)
  })
})

const ArtistSeriesFullArtistSeriesListFixture: ArtistSeriesFullArtistSeriesListTestsQuery["rawResponse"] =
  {
    artist: {
      id: "yayoi-kusama",
      artistSeriesConnection: {
        edges: [
          {
            node: {
              featured: true,
              slug: "yayoi-kusama-plums",
              internalID: "da821a13-92fc-49c2-bbd5-bebb790f7020",
              title: "plums",
              artworksCountMessage: "40 available",
              image: {
                url: "https://d32dm0rphc51dk.cloudfront.net/bLKO-OQg8UOzKuKcKxXeWQ/main.jpg",
              },
            },
          },
          {
            node: {
              featured: false,
              slug: "yayoi-kusama-apricots",
              internalID: "ecfa5731-9d64-4bc2-9f9f-c427a9126064",
              title: "apricots",
              artworksCountMessage: "35 available",
              image: {
                url: "https://d32dm0rphc51dk.cloudfront.net/Oymspr9llGzRC-lTZA8htA/main.jpg",
              },
            },
          },
          {
            node: {
              featured: false,
              slug: "yayoi-kusama-pumpkins",
              internalID: "58597ef5-3390-406b-b6d2-d4e308125d0d",
              title: "Pumpkins",
              artworksCountMessage: "25 available",
              image: {
                url: "https://d32dm0rphc51dk.cloudfront.net/dL3hz4h6f_tMHQjVHsdO4w/medium.jpg",
              },
            },
          },
          {
            node: {
              featured: false,
              slug: "yayoi-kusama-apples",
              internalID: "5856ee51-35eb-4b75-bb12-15a1cd7e012e",
              title: "apples",
              artworksCountMessage: "15 available",
              image: {
                url: "https://d32dm0rphc51dk.cloudfront.net/Nv63KiPQo91g2-W2V3lgAw/main.jpg",
              },
            },
          },
          {
            node: {
              featured: false,
              slug: "yayoi-kusama-grapefruit",
              internalID: "5856ee51-35eb-4b75-bb12-15a1816a9",
              title: "grapefruit",
              artworksCountMessage: "10 available",
              image: {
                url: "https://d32dm0rphc51dk.cloudfront.net/Nv63KiPQo91g2-W2V3lgAw/main.jpg",
              },
            },
          },
          {
            node: {
              featured: false,
              slug: "yayoi-kusama-dragonfruit",
              internalID: "5856ee51-35eb-4b75-bb12-15a1cd18161",
              title: "dragonfruit",
              artworksCountMessage: "8 available",
              image: {
                url: "https://d32dm0rphc51dk.cloudfront.net/Nv63KiPQo91g2-W2V3lgAw/main.jpg",
              },
            },
          },
        ],
      },
    },
  }
