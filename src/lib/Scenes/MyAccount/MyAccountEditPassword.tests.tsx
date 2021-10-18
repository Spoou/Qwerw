import React from "react"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { MyAccountFieldEditScreen } from "./Components/MyAccountFieldEditScreen"
import { MyAccountEditPassword } from "./MyAccountEditPassword"

describe(MyAccountEditPassword, () => {
  it("has the right title", () => {
    const tree = renderWithWrappers(<MyAccountEditPassword />)

    expect(tree.root.findByType(MyAccountFieldEditScreen).props.title).toEqual("Password")
  })
})
