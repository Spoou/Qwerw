import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { getLocationDetails, LocationWithDetails, SimpleLocation } from "lib/utils/googleMaps"
import { Flex } from "palette"
import React, { useState } from "react"
import { ScrollView } from "react-native"

import { LocationAutocomplete } from "./LocationAutocomplete"

interface ShippingModalProps {
  toggleVisibility: () => void
  modalIsVisible: boolean
  setLocation: (locationDetails: LocationWithDetails) => void
  location: LocationWithDetails | null
}

export const ShippingModal: React.FC<ShippingModalProps> = (props) => {
  const { location, toggleVisibility, modalIsVisible, setLocation } = props

  const [locationInput, setLocationInput] = useState<SimpleLocation | null>(null)

  return (
    <FancyModal visible={modalIsVisible} onDismiss={() => toggleVisibility()}>
      <FancyModalHeader
        leftButtonText="Cancel"
        onLeftButtonPress={() => {
          toggleVisibility()
        }}
        rightButtonText="Apply"
        onRightButtonPress={async () => {
          const locationDetails = await getLocationDetails(locationInput as SimpleLocation)

          setLocation(locationDetails)
          toggleVisibility()
        }}
        rightButtonDisabled={!locationInput}
      >
        Add Location
      </FancyModalHeader>
      <ScrollView keyboardShouldPersistTaps="always">
        <Flex m={2} flex={1}>
          <LocationAutocomplete onChange={setLocationInput} initialLocation={location} />
        </Flex>
      </ScrollView>
    </FancyModal>
  )
}
