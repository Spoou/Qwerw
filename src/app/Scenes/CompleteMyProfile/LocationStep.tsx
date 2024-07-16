import { Text, Screen, Spacer, Flex } from "@artsy/palette-mobile"
import { LocationAutocomplete, buildLocationDisplay } from "app/Components/LocationAutocomplete"
import { CompleteMyProfileStore } from "app/Scenes/CompleteMyProfile/CompleteMyProfileProvider"
import { Footer } from "app/Scenes/CompleteMyProfile/Footer"
import { useCompleteProfile } from "app/Scenes/CompleteMyProfile/hooks/useCompleteProfile"
import { LocationWithDetails } from "app/utils/googleMaps"
import { FC } from "react"
import { KeyboardAvoidingView } from "react-native"

export const LocationStep: FC = () => {
  const { goNext } = useCompleteProfile()

  const location = CompleteMyProfileStore.useStoreState((state) => state.progressState.location)
  const setProgressState = CompleteMyProfileStore.useStoreActions(
    (actions) => actions.setProgressState
  )

  const handleOnChange = ({
    city,
    country,
    postalCode,
    state,
    stateCode,
    coordinates,
  }: LocationWithDetails) => {
    setProgressState({
      type: "location",
      value: {
        city: city ?? "",
        country: country ?? "",
        postalCode: postalCode ?? "",
        state: state ?? "",
        stateCode: stateCode ?? "",
        coordinates: coordinates?.map((c) => parseInt(c, 10)),
      },
    })
  }

  const handleOnClear = () => {
    setProgressState({ type: "location", value: undefined })
  }

  return (
    <Screen safeArea={false}>
      <Screen.Body pt={2}>
        <KeyboardAvoidingView behavior="padding">
          <Flex justifyContent="space-between" height="100%">
            <Flex>
              <Text variant="lg-display">Add your primary location</Text>

              <Spacer y={1} />

              <Text color="black60">
                Receive recommendations for local galleries, shows, and offers on artworks.
              </Text>

              <Spacer y={2} />

              <LocationAutocomplete
                allowCustomLocation
                aria-label="Enter your primary location"
                autoFocus
                title="Primary location"
                placeholder="Primary location"
                displayLocation={buildLocationDisplay(location)}
                onChange={handleOnChange}
                enableClearButton
                onClear={handleOnClear}
              />
            </Flex>

            <Footer isFormDirty={!!location} onGoNext={goNext} />
          </Flex>
        </KeyboardAvoidingView>
      </Screen.Body>
    </Screen>
  )
}
