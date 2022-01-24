import { act, fireEvent } from "@testing-library/react-native"
import { readFileSync } from "fs"
import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { Flex, Serif } from "palette"
import { join } from "path"
import React from "react"
import { defaultRules, renderMarkdown } from "./renderMarkdown"

describe("renderMarkdown", () => {
  it("returns markdown for a simple string", () => {
    expect(renderMarkdown("")).toMatchInlineSnapshot(`
                        Array [
                          <Text />,
                        ]
                `)
  })

  it("returns markdown for multiple paragraphs", () => {
    const componentList = renderMarkdown(
      "This is a first paragraph\n\nThis is a second paragraph"
    ) as any
    expect(componentList.length).toEqual(4)

    const { queryByText } = renderWithWrappersTL(<Flex>{componentList}</Flex>)
    expect(queryByText("This is a first paragraph")).toBeTruthy()
    expect(queryByText("This is a second paragraph")).toBeTruthy()
  })

  it("returns markdown for multiple paragraphs and links", () => {
    const componentList = renderMarkdown(
      "This is a [first](/artist/first) paragraph\n\nThis is a [second](/gene/second) paragraph"
    ) as any
    expect(componentList.length).toEqual(4)

    const { queryByText, queryAllByTestId } = renderWithWrappersTL(<Flex>{componentList}</Flex>)
    expect(queryAllByTestId(/linktext-/)).toHaveLength(2)

    expect(queryByText("This is a first paragraph")).toBeTruthy()

    expect(extractText(queryAllByTestId(/linktext-/)[0])).toEqual("first")

    expect(queryByText("This is a second paragraph")).toBeTruthy()

    expect(extractText(queryAllByTestId(/linktext-/)[1])).toEqual("second")
  })

  it("handles custom rules", () => {
    const basicRules = defaultRules({})
    const customRules = {
      ...basicRules,
      paragraph: {
        ...basicRules.paragraph,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        react: (node, output, state) => {
          return (
            <Serif size="3t" color="black60" key={state.key}>
              {output(node.content, state)}
            </Serif>
          )
        },
      },
    }
    const componentList = renderMarkdown(
      "This is a first paragraph\n\nThis is a second paragraph",
      customRules
    ) as any
    expect(componentList.length).toEqual(4)
    const { queryByText } = renderWithWrappersTL(<Flex>{componentList}</Flex>)
    expect(queryByText("This is a first paragraph")).toBeTruthy()
    expect(queryByText("This is a second paragraph")).toBeTruthy()
  })

  it("opens links modally when specified", () => {
    const basicRules = defaultRules({ modal: true })
    const customRules = {
      ...basicRules,
      paragraph: {
        ...basicRules.paragraph,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        react: (node, output, state) => {
          return (
            <Serif size="3t" color="black60" key={state.key}>
              {output(node.content, state)}
            </Serif>
          )
        },
      },
    }
    const componentList = renderMarkdown(
      "This is a [first](/artist/first) paragraph\n\nThis is a [second](/gene/second) paragraph",
      customRules
    ) as any

    const { queryAllByTestId } = renderWithWrappersTL(<Flex>{componentList}</Flex>)
    expect(queryAllByTestId(/linktext-/)).toHaveLength(2)

    act(() => fireEvent.press(queryAllByTestId(/linktext-/)[0]))

    expect(navigate).toHaveBeenCalledWith("/artist/first", { modal: true })
  })

  it("doesn't open links modally when not specified", () => {
    const basicRules = defaultRules({})
    const customRules = {
      ...basicRules,
      paragraph: {
        ...basicRules.paragraph,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        react: (node, output, state) => {
          return (
            <Serif size="3t" color="black60" key={state.key}>
              {output(node.content, state)}
            </Serif>
          )
        },
      },
    }
    const componentList = renderMarkdown(
      "This is a [first](/artist/first) paragraph\n\nThis is a [second](/gene/second) paragraph",
      customRules
    ) as any

    const { queryAllByTestId } = renderWithWrappersTL(<Flex>{componentList}</Flex>)
    expect(queryAllByTestId(/linktext-/)).toHaveLength(2)

    act(() => fireEvent.press(queryAllByTestId(/linktext-/)[0]))

    expect(navigate).toHaveBeenCalledWith("/artist/first")
  })

  it(`renders all the markdown elements`, async () => {
    const basicRules = defaultRules({})
    const kitchenSink = readFileSync(join(__dirname, "markdown-kitchen-sink.md")).toString()

    const tree = renderMarkdown(kitchenSink, basicRules)

    visitTree(tree, (node) => {
      if (typeof node.type === "string") {
        throw Error(`we should be supporting elements with type '${node.type}'`)
      }
    })
  })
})

function visitTree(tree: unknown, visit: (node: React.ReactElement) => void) {
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  if (React.isValidElement(tree)) {
    visit(tree)
    React.Children.forEach((tree.props as any).children, (child) => visitTree(child, visit))
  } else if (Array.isArray(tree)) {
    tree.map((child) => visitTree(child, visit))
  }
}
