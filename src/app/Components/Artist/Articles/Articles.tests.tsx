import { screen, fireEvent } from "@testing-library/react-native"
import { ArticlesTestsQuery } from "__generated__/ArticlesTestsQuery.graphql"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { Articles } from "./Articles"

describe("Articles", () => {
  const { renderWithRelay } = setupTestWrapper<ArticlesTestsQuery>({
    Component: ({ artist, articlesConnection }) => {
      const articles = extractNodes(articlesConnection)
      return <Articles artist={artist!} articles={articles} />
    },
    query: graphql`
      query ArticlesTestsQuery @relay_test_operation {
        artist(id: "andy-warhol") {
          ...Articles_artist
        }

        articlesConnection(first: 5, inEditorialFeed: true) {
          edges {
            node {
              ...Articles_articles
            }
          }
        }
      }
    `,
  })

  it("renders", () => {
    renderWithRelay()

    expect(screen.getByText(`Artsy Editorial Featuring <mock-value-for-field-"name">`)).toBeTruthy()
    expect(screen.getByText(`<mock-value-for-field-"vertical">`)).toBeTruthy()
    expect(screen.getByText(`<mock-value-for-field-"thumbnailTitle">`)).toBeTruthy()
    expect(screen.getByText(`By <mock-value-for-field-"byline">`)).toBeTruthy()
  })

  it("navigates to a specific article via webview", () => {
    renderWithRelay()

    fireEvent.press(screen.getByText(`<mock-value-for-field-"thumbnailTitle">`))
    expect(navigate).toHaveBeenCalledWith(`<mock-value-for-field-\"href\">`)
  })

  it("navigates to a specific article natively", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({
      AREnableNativeArticleView: true,
    })
    renderWithRelay()

    fireEvent.press(screen.getByText(`<mock-value-for-field-"thumbnailTitle">`))
    expect(navigate).toHaveBeenCalledWith(`/article2/<Article-mock-id-3>`)
  })

  it("navigates to all articles", () => {
    renderWithRelay()

    fireEvent.press(screen.getByText("View All"))
    expect(navigate).toHaveBeenCalledWith("artist/<Artist-mock-id-1>/articles")
  })
})
