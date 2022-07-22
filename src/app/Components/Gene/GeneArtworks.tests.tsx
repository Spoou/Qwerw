import { fireEvent, waitFor } from "@testing-library/react-native"
import { GeneArtworksTestsQuery } from "__generated__/GeneArtworksTestsQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { GeneArtworksPaginationContainer } from "./GeneArtworks"

describe("GeneArtworks", () => {
  const geneID = "gene-id"

  const TestRenderer = () => {
    return (
      <QueryRenderer<GeneArtworksTestsQuery>
        environment={environment}
        query={graphql`
          query GeneArtworksTestsQuery($geneID: String!, $input: FilterArtworksInput)
          @relay_test_operation {
            gene(id: $geneID) {
              ...GeneArtworks_gene @arguments(input: $input)
            }
          }
        `}
        render={({ props }) => {
          if (props?.gene) {
            return (
              <StickyTabPage
                tabs={[
                  {
                    title: "test",
                    content: <GeneArtworksPaginationContainer gene={props.gene} />,
                  },
                ]}
              />
            )
          }

          return null
        }}
        variables={{
          geneID,
          input: {
            medium: "*",
            priceRange: "*-*",
          },
        }}
      />
    )
  }

  it("renders without throwing an error", () => {
    renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(environment)
  })

  it("renders filter header", async () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(environment)

    await waitFor(() => expect(getByText("Sort & Filter")).toBeTruthy())
  })

  it("renders artworks grid", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
      FilterArtworksConnection() {
        return {
          counts: {
            total: 10,
          },
        }
      },
    })

    // Find by artwork title
    expect(getByText("title-1")).toBeTruthy()
  })

  it("renders empty artworks grid view", async () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
      FilterArtworksConnection() {
        return {
          counts: {
            total: 10,
          },
        }
      },
    })

    // Change sort filter
    await waitFor(() => expect(getByText("Sort & Filter")).toBeTruthy())
    fireEvent.press(getByText("Sort & Filter"))
    fireEvent.press(getByText("Sort By"))
    fireEvent.press(getByText("Recently Added"))
    fireEvent.press(getByText("Show Results"))

    resolveMostRecentRelayOperation({
      FilterArtworksConnection() {
        return {
          counts: {
            total: 0,
          },
        }
      },
    })

    expect(getByText(/No results found/)).toBeTruthy()
  })

  it("renders empty message when artworks is empty", () => {
    const { getByText } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation({
      Gene() {
        return {
          artworks: {
            counts: {
              total: 0,
            },
          },
        }
      },
    })
    const emptyMessage = "There aren’t any works available in the category at this time."

    expect(getByText(emptyMessage)).toBeTruthy()
  })
})
