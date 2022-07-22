import { OnboardingPersonalization_highlights$data } from "__generated__/OnboardingPersonalization_highlights.graphql"
import { OnboardingPersonalizationTestsQuery } from "__generated__/OnboardingPersonalizationTestsQuery.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { mockFetchNotificationPermissions } from "app/tests/mockFetchNotificationPermissions"
import { mockNavigate } from "app/tests/navigationMocks"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { PushAuthorizationStatus } from "app/utils/PushNotification"
import { graphql, QueryRenderer } from "react-relay"
import { OnboardingPersonalizationList } from "./OnboardingPersonalization"

describe("OnboardingPersonalizationList", () => {
  const TestRenderer = () => (
    <QueryRenderer<OnboardingPersonalizationTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query OnboardingPersonalizationTestsQuery($excludeArtistIDs: [String])
        @relay_test_operation {
          highlights {
            popularArtists(excludeFollowedArtists: true, excludeArtistIDs: $excludeArtistIDs) {
              internalID
              ...ArtistListItem_artist
            }
          }
        }
      `}
      variables={{ excludeArtistIDs: [] }}
      render={({ props }) => {
        if (props?.highlights) {
          return (
            <OnboardingPersonalizationList
              // no need to redeclare the OnboardingPersonalization_highlights$data fragment here
              highlights={props.highlights as OnboardingPersonalization_highlights$data}
              navigation={{ navigate: mockNavigate } as any}
              route={null as any}
            />
          )
        }
        return null
      }}
    />
  )

  describe("SearchInput", () => {
    it("navigates to the OnboardingPersonalizationModal when the user presses on the search input", () => {
      const tree = renderWithWrappersLEGACY(<TestRenderer />)
      resolveMostRecentRelayOperation()

      const searchInput = tree.root.findByProps({ testID: "searchArtistButton" })
      searchInput.props.onPress()
      expect(mockNavigate).toHaveBeenCalledWith("OnboardingPersonalizationModal")
    })
  })

  describe("Button", () => {
    it("Sets the onboarding state to complete and requests for push notifications permission when it's not yet determined", async () => {
      jest.useFakeTimers()

      mockFetchNotificationPermissions(false).mockImplementationOnce((cb) =>
        cb(null, PushAuthorizationStatus.NotDetermined)
      )

      const tree = renderWithWrappersLEGACY(<TestRenderer />)
      resolveMostRecentRelayOperation()

      const doneButton = tree.root.findByProps({ testID: "doneButton" })
      doneButton.props.onPress()

      jest.runAllTimers()

      expect(__globalStoreTestUtils__?.getCurrentState().auth.onboardingState).toEqual("complete")
      expect(
        LegacyNativeModules.ARTemporaryAPIModule.requestPrepromptNotificationPermissions
      ).toBeCalled()
    })
  })
})
