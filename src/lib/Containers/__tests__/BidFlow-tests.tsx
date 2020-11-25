import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { BidFlowFragmentContainer } from "../BidFlow"

jest.mock("tipsi-stripe", () => ({ setOptions: jest.fn() }))

jest.mock("../../Components/Bidding/Context/TimeOffsetProvider.tsx", () => ({
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  TimeOffsetProvider: ({ children }) => children,
}))

const Me = {
  has_qualified_credit_cards: true,
}

const SaleArtwork = {
  increments: [
    {
      display: "$35,000",
      cents: 3500000,
    },
    {
      display: "$40,000",
      cents: 4000000,
    },
    {
      display: "$45,000",
      cents: 4500000,
    },
    {
      display: "$50,000",
      cents: 5000000,
    },
    {
      display: "$55,000",
      cents: 5500000,
    },
  ],
}

it("renders without throwing an error", () => {
  renderWithWrappers(<BidFlowFragmentContainer me={Me as any} sale_artwork={SaleArtwork as any} />)
})
