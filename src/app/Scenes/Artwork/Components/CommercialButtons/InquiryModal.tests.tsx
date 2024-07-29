import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { InquiryModalTestsQuery } from "__generated__/InquiryModalTestsQuery.graphql"
import { InquiryModal } from "app/Scenes/Artwork/Components/CommercialButtons/InquiryModal"
import { AUTOMATED_MESSAGES } from "app/Scenes/Artwork/Components/CommercialButtons/constants"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import {
  ArtworkInquiryContext,
  initialArtworkInquiryState,
  artworkInquiryStateReducer,
} from "app/utils/ArtworkInquiry/ArtworkInquiryStore"
import {
  ArtworkInquiryActions,
  ArtworkInquiryContextState,
  InquiryQuestionIDs,
} from "app/utils/ArtworkInquiry/ArtworkInquiryTypes"
import { daysInCooldownPeriod } from "app/utils/collectorPromptHelpers"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Reducer, useReducer } from "react"
import { graphql } from "react-relay"

describe("inquiry modal", () => {
  it("displays artwork metadata", () => {
    renderWithRelay({
      Artwork: () => mockArtwork,
    })

    expect(screen.getByText("Artist Name")).toBeVisible()
    expect(screen.getByText("Title, Date")).toBeVisible()
    expect(screen.getByLabelText("Image of Title")).toBeVisible()
  })

  it("displays inquiry questions", () => {
    renderWithRelay({
      Artwork: () => mockArtwork,
    })

    expect(screen.getByText("Question")).toBeVisible()
  })

  it("displays a random automated message", () => {
    renderWithRelay()

    expect(AUTOMATED_MESSAGES).toContain(screen.getByLabelText("Add message").props.value)
  })

  it("opens the shipping modal when the 'add your location' field is pressed", async () => {
    renderWithRelay({
      Artwork: () => ({
        ...mockArtwork,
        inquiryQuestions: [
          {
            internalID: InquiryQuestionIDs.Shipping,
            question: "Shipping",
          },
        ],
      }),
    })

    fireEvent.press(screen.getByText("Shipping"))

    await waitFor(() => {
      expect(screen.getByText("Add your location")).toBeVisible()
    })

    fireEvent.press(screen.getByText("Add your location"))

    await waitFor(() => {
      expect(screen.getByText("Add Location")).toBeVisible()
    })
  })

  it("enables the 'send' button when an inquiry question is selected", async () => {
    renderWithRelay({
      Artwork: () => mockArtwork,
    })

    expect(screen.getByText("Send")).toBeDisabled()

    fireEvent.press(screen.getByText("Question"))

    await waitFor(() => {
      expect(screen.getByText("Send")).toBeEnabled()
    })
  })

  it("closes when the 'cancel' button is pressed", async () => {
    renderWithRelay()

    fireEvent.press(screen.getByText("Cancel"))

    await waitFor(() => {
      expect(screen.queryByText("What information are you looking for?")).toBeNull()
    })
  })

  test.todo("tracks an event when the inquiry modal is closed")

  describe("sending the inquiry", () => {
    let mockUseSubmitInquiryRequest: jest.SpyInstance

    test.todo("tracks an event before sending the inquiry")

    describe("when the inquiry is successfully sent", () => {
      beforeAll(() => {
        mockUseSubmitInquiryRequest = jest
          .spyOn(
            require("app/Scenes/Artwork/Components/CommercialButtons/useSubmitInquiryRequest"),
            "useSubmitInquiryRequest"
          )
          .mockImplementation(() => [
            jest.fn(({ onCompleted }) => {
              onCompleted()
            }),
          ])
      })

      afterAll(() => {
        mockUseSubmitInquiryRequest.mockRestore()
      })

      test.todo("tracks an event when the inquiry is successfully sent")

      it("displays a success message ", async () => {
        renderWithRelay({
          Artwork: () => mockArtwork,
        })

        fireEvent.press(screen.getByText("Question"))

        await waitFor(() => {
          expect(screen.getByText("Send")).toBeEnabled()
        })

        fireEvent.press(screen.getByText("Send"))

        await waitFor(() => {
          expect(screen.getByText("Message Sent")).toBeVisible()
        })
      })

      describe("and the profile prompt feature flag is enabled", () => {
        beforeEach(() => {
          __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCollectorProfilePrompts: true })
        })

        it("displays a profile prompt if the user has not completed their profile and never been prompted", async () => {
          renderWithRelay({
            Artwork: () => mockArtwork,
            Me: () => ({
              location: {
                city: null,
              },
              profession: null,
              collectorProfile: {
                lastUpdatePromptAt: null,
              },
            }),
          })

          expect(
            screen.queryByText("Inquiry sent! Tell Partner Name more about yourself.")
          ).toBeNull()

          fireEvent.press(screen.getByText("Question"))

          await waitFor(() => {
            expect(screen.getByText("Send")).toBeEnabled()
          })

          fireEvent.press(screen.getByText("Send"))

          await waitFor(() => {
            expect(
              screen.getByText("Inquiry sent! Tell Partner Name more about yourself.")
            ).toBeVisible()
          })
        })

        it("displays a profile prompt if the user has not completed their profile and has not been prompted since the cooldown period", async () => {
          renderWithRelay({
            Artwork: () => mockArtwork,
            Me: () => ({
              location: {
                city: null,
              },
              profession: null,
              collectorProfile: {
                lastUpdatePromptAt: new Date(
                  Date.now() - (daysInCooldownPeriod + 1) * 24 * 60 * 60 * 1000
                ).toISOString(),
              },
            }),
          })

          expect(
            screen.queryByText("Inquiry sent! Tell Partner Name more about yourself.")
          ).toBeNull()

          fireEvent.press(screen.getByText("Question"))

          await waitFor(() => {
            expect(screen.getByText("Send")).toBeEnabled()
          })

          fireEvent.press(screen.getByText("Send"))

          await waitFor(() => {
            expect(
              screen.getByText("Inquiry sent! Tell Partner Name more about yourself.")
            ).toBeVisible()
          })
        })

        it("does not display a profile prompt if the user has not completed their profile and has been prompted within the cooldown period", async () => {
          renderWithRelay({
            Artwork: () => mockArtwork,
            Me: () => ({
              location: {
                city: null,
              },
              profession: null,
              collectorProfile: {
                lastUpdatePromptAt: new Date(
                  Date.now() - (daysInCooldownPeriod - 10) * 24 * 60 * 60 * 1000
                ).toISOString(),
              },
            }),
          })

          fireEvent.press(screen.getByText("Question"))

          await waitFor(() => {
            expect(screen.getByText("Send")).toBeEnabled()
          })

          fireEvent.press(screen.getByText("Send"))

          await waitFor(() => {
            expect(screen.getByText("Message Sent")).toBeVisible()
          })

          expect(
            screen.queryByText("Inquiry sent! Tell Partner Name more about yourself.")
          ).toBeNull()
        })
      })
    })

    describe("when the inquiry fails to send", () => {
      beforeAll(() => {
        mockUseSubmitInquiryRequest = jest
          .spyOn(
            require("app/Scenes/Artwork/Components/CommercialButtons/useSubmitInquiryRequest"),
            "useSubmitInquiryRequest"
          )
          .mockImplementation(() => [
            jest.fn(({ onError }) => {
              onError()
            }),
          ])
      })

      afterAll(() => {
        mockUseSubmitInquiryRequest.mockRestore()
      })

      test.todo("tracks an event when the inquiry fails to send")

      it("displays an error message", async () => {
        renderWithRelay({
          Artwork: () => mockArtwork,
        })

        fireEvent.press(screen.getByText("Question"))

        await waitFor(() => {
          expect(screen.getByText("Send")).toBeEnabled()
        })

        fireEvent.press(screen.getByText("Send"))

        await waitFor(() => {
          expect(
            screen.getByText("Sorry, we were unable to send this message. Please try again.")
          ).toBeVisible()
        })
      })
    })
  })
})

const mockArtwork = {
  title: "Title",
  date: "Date",
  artistNames: "Artist Name",
  image: {
    url: "https://example.com/image.jpg",
  },
  inquiryQuestions: [
    {
      internalID: "question-id",
      question: "Question",
    },
  ],
  partner: {
    name: "Partner Name",
  },
}

const { renderWithRelay } = setupTestWrapper<InquiryModalTestsQuery>({
  Component: ({ artwork, me }) => (
    <ArtworkInquiryContext.Provider value={useReducerWithInquiryModalVisible()}>
      <InquiryModal artwork={artwork} me={me} />
    </ArtworkInquiryContext.Provider>
  ),
  query: graphql`
    query InquiryModalTestsQuery @relay_test_operation {
      artwork(id: "artwork-id") @required(action: NONE) {
        ...InquiryModal_artwork
      }
      me @required(action: NONE) {
        ...InquiryModal_me
      }
    }
  `,
})

const useReducerWithInquiryModalVisible = () => {
  const [state, dispatch] = useReducer<Reducer<ArtworkInquiryContextState, ArtworkInquiryActions>>(
    artworkInquiryStateReducer,
    { ...initialArtworkInquiryState, inquiryModalVisible: true }
  )

  return {
    state,
    dispatch,
  }
}
