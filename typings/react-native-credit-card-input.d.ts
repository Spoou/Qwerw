declare module "react-native-credit-card-input" {
  export interface CreditCardValues {
    cvc: string
    expiry: string
    number: string
    type: string
  }
  export interface CreditCardInputOnChangeEvent {
    valid: false
    values: CreditCardValues
  }

  export class LiteCreditCardInput extends React.Component<{ onChange(e: CreditCardInputOnChangeEvent): void }> {
    focus(): void
    setValues(values: Partial<CreditCardValues>): void
  }
}
