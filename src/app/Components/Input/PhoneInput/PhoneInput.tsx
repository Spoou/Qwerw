import {
  Flex,
  InputProps,
  Spacer,
  Text,
  Touchable,
  TriangleDown,
  useColor,
} from "@artsy/palette-mobile"
import {
  INTERNALSelectAndInputCombinationBase,
  ValuePayload,
} from "app/Components/Input/INTERNALSelectAndInputCombinationBase"
import { InputRef } from "app/Components/Input/Input"
import { isValidNumber } from "app/Components/Input/PhoneInput/isValidPhoneNumber"
import { SelectOption } from "app/Components/Select"
import { forwardRef, useEffect, useRef, useState } from "react"
import { cleanUserPhoneNumber } from "./cleanUserPhoneNumber"
import { countries, countryIndex } from "./countries"

export const PhoneInput = forwardRef<
  InputRef,
  {
    setValidation?: (value: boolean) => void
    onChange?: (value: string) => void
    onModalFinishedClosing?: () => void
    maxModalHeight?: number
    shouldDisplayLocalError?: boolean
  } & Omit<InputProps, "onChange">
>(
  (
    {
      value,
      setValidation,
      onChange,
      onChangeText,
      onModalFinishedClosing,
      maxModalHeight,
      shouldDisplayLocalError = true,
      ...rest
    },
    ref
  ) => {
    const color = useColor()
    const initialValues = cleanUserPhoneNumber(value ?? "")
    const [countryCode, setCountryCode] = useState<string>(initialValues.countryCode)
    const [phoneNumber, setPhoneNumber] = useState(initialValues.phoneNumber)
    const [validationErrorMessage, setValidationErrorMessage] = useState("")
    const dialCode = countryIndex[countryCode].dialCode
    const countryISO2Code = countryIndex[countryCode].iso2

    const handleValidation = () => {
      const isValid = isValidNumber(phoneNumber, countryISO2Code)
      setValidation?.(isValid)

      if (shouldDisplayLocalError) {
        setValidationErrorMessage(isValid ? "" : "Please enter a valid phone number.")
      }
    }

    const isFirstRun = useRef(true)
    useEffect(() => {
      if (isFirstRun.current) {
        isFirstRun.current = false
        return
      }
      const newValue = phoneNumber ? `+${dialCode} ${phoneNumber}` : ""
      onChangeText?.(newValue)
      onChange?.(newValue)
    }, [phoneNumber, dialCode])

    const onValueChange = (selectAndInputValue: ValuePayload) => {
      const {
        select: { value: code },
        input: { value: phone },
      } = selectAndInputValue

      setCountryCode(code)
      setPhoneNumber(phone || "")
    }

    const selectedCountry = countries.find((c) => c.iso2 === countryISO2Code)

    return (
      <Flex>
        <INTERNALSelectAndInputCombinationBase
          // Props for Input
          {...rest}
          ref={ref}
          value={phoneNumber}
          placeholderTextColor={color("black30")}
          keyboardType="phone-pad"
          onValueChange={onValueChange}
          validate={handleValidation}
          //
          //
          // Props For Select
          optionsForSelect={countryOptions}
          enableSearchForSelect
          valueForSelect={countryCode}
          selectDisplayLabel={
            selectedCountry ? `${selectedCountry.flag}  +${selectedCountry.dialCode}` : ""
          }
          maxModalHeightForSelect={maxModalHeight}
          onModalFinishedClosingForSelect={onModalFinishedClosing}
          onSelectValueForSelect={(newCountryCode) => {
            setCountryCode(newCountryCode)
          }}
          titleForSelect="Country code"
          renderButtonForSelect={({ selectedValue, onPress }) => {
            return (
              <Touchable onPress={onPress}>
                <Flex flex={1} flexDirection="row" style={{ width: "100%", height: "100%" }}>
                  <Flex flexDirection="row" px={1} alignItems="center" backgroundColor="black10">
                    {/* selectedValue should always be present */}
                    <Text variant="sm-display">
                      {countryIndex[selectedValue ?? countryCode].flag}
                    </Text>
                    <Spacer x={0.5} />
                    <TriangleDown width="8" />
                  </Flex>
                  <Flex justifyContent="center" pl={1}>
                    <Text variant="sm" color="black60">
                      +{dialCode}
                    </Text>
                  </Flex>
                </Flex>
              </Touchable>
            )
          }}
          renderItemLabelForSelect={({ label, value }) => {
            return (
              <Flex flexDirection="row" alignItems="center" flexShrink={1}>
                <Text variant="sm-display">{countryIndex[value].flag}</Text>
                <Spacer x={1} />
                <Text variant="sm-display" style={{ width: 45 }}>
                  +{countryIndex[value].dialCode}
                </Text>
                <Spacer x={1} />
                <Text
                  variant="sm-display"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ flexShrink: 1 }}
                >
                  {label}
                </Text>
              </Flex>
            )
          }}
          error={
            shouldDisplayLocalError && validationErrorMessage ? validationErrorMessage : rest.error
          }
          mask={countryCode ? countryIndex[countryCode]?.mask : undefined}
        />
      </Flex>
    )
  }
)

const countryOptions: Array<SelectOption<string>> = countries.map((c) => {
  return {
    label: c.name,
    value: c.iso2,
    searchImportance: c.priority,
    searchTerms: [
      c.dialCode,
      "+" + c.dialCode,
      c.name,
      // individual words of country name
      ...c.name.split(/\W+/g),
      // initials of country name
      c.name
        .split(/\W+/g)
        .map((word) => word[0])
        .join(""),
    ],
  }
})
