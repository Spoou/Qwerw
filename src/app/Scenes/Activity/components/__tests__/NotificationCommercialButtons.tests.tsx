import { screen } from "@testing-library/react-native"
import { NotificationCommercialButtons_Test_Query } from "__generated__/NotificationCommercialButtons_Test_Query.graphql"
import { CommercialButtons } from "app/Scenes/Activity/components/NotificationCommercialButtons"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

jest.mock("react-relay/hooks", () => ({
  useLazyLoadQuery: jest.fn(),
}))

describe("CommercialButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const partnerOffer = {
    id: "partnerOfferID",
    internalID: "partnerOfferID",
    isAvailable: true,
    endAt: "2022-01-01T00:00:00Z",
    targetHref: "https://www.artsy.net",
  }

  const TestRenderer = () => {
    const data = useLazyLoadQuery<NotificationCommercialButtons_Test_Query>(
      graphql`
        query NotificationCommercialButtons_Test_Query @relay_test_operation {
          artwork(id: "artworkID") {
            ...NotificationCommercialButtons_artwork
          }
        }
      `,
      {}
    )

    if (data.artwork) {
      return (
        <CommercialButtons
          artwork={data.artwork}
          artworkID="artwork-id"
          partnerOffer={partnerOffer}
        />
      )
    }

    return null
  }

  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <Suspense fallback={null}>
        <TestRenderer />
      </Suspense>
    ),
  })

  it("renders buttons correctly ", async () => {
    renderWithRelay({
      Artwork: () => ({
        internalID: "artwork-id",
      }),
    })

    await flushPromiseQueue()

    expect(screen.getByText("Make an Offer")).toBeTruthy()
    expect(screen.getByText("Contact Gallery")).toBeTruthy()
  })
})
