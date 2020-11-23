import { plainTextFromTree } from "lib/utils/plainTextFromTree"
import { defaultRules, renderMarkdown } from "lib/utils/renderMarkdown"
import { Schema } from "lib/utils/track"
import _ from "lodash"
import {
  Color,
  Flex,
  Sans,
  SansProps,
  Serif,
  SerifProps,
  Text as PaletteText,
  TextProps as PaletteTextProps,
} from "palette"
import React, { useState } from "react"
import { Text } from "react-native"
import { useTracking } from "react-tracking"
import { ResponsiveValue } from "styled-system"
import { LinkText } from "./Text/LinkText"

interface Props {
  content: string
  maxChars: number
  presentLinksModally?: boolean
  contextModule?: string
  trackingFlow?: string
  color?: ResponsiveValue<Color>
  textStyle?: "serif" | "sans" | "new"
}

export const ReadMore = React.memo(
  ({ content, maxChars, presentLinksModally, color, trackingFlow, contextModule, textStyle = "serif" }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const tracking = useTracking()
    const useNewTextStyles = textStyle === "new"
    const basicRules = defaultRules({ modal: presentLinksModally, useNewTextStyles })
    const TextComponent: React.ComponentType<SansProps | SerifProps | PaletteTextProps> = (textStyle === "new"
      ? PaletteText
      : textStyle === "sans"
      ? Sans
      : Serif) as any
    const textProps: SansProps | SerifProps | PaletteTextProps =
      textStyle === "new" ? { variant: "text" } : { size: "3" }
    const rules = {
      ...basicRules,
      paragraph: {
        ...basicRules.paragraph,
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        react: (node, output, state) => {
          return (
            <TextComponent {...textProps} color={color || "black100"} key={state.key}>
              {!isExpanded && Number(state.key) > 0 ? "⁠ — " : null}
              {output(node.content, state)}
            </TextComponent>
          )
        },
      },
    }

    const root = renderMarkdown(content, rules)
    // Removes the last empty space in the markdown array
    if (Array.isArray(root)) {
      while (root.length && root[root.length - 1] && root[root.length - 1].type === Text) {
        root.pop()
      }
    }

    const plainTextVersion = plainTextFromTree(root)
    const isAlreadyExpanded = isExpanded || plainTextVersion.length <= maxChars

    return isAlreadyExpanded ? (
      root
    ) : (
      <Flex>
        <Text>
          {truncate({
            root,
            maxChars,
            onExpand: () => {
              tracking.trackEvent({
                action_name: Schema.ActionNames.ReadMore,
                action_type: Schema.ActionTypes.Tap,
                context_module: contextModule ? contextModule : null,
                flow: trackingFlow ? trackingFlow : null,
              })
              setIsExpanded(true)
            },
          })}
        </Text>
      </Flex>
    )
  }
)

/**
 * In-order traverses the shallowly-rendered markdown returned from SimpleMarkdown's parser
 * keeping track of how many characters have been seen. When it has seen enough, it stops
 * traversing and adds a 'read more' button to the highest text node at that part of the tree.
 */
function truncate({
  root,
  maxChars,
  onExpand,
}: {
  root: React.ReactNode
  maxChars: number
  onExpand(): void
}): React.ReactNode {
  // keep track of how many characters we have seen
  let offset = 0
  // keep track of how many text nodes deep we are
  let textDepth = 0

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  function traverse(node: React.ReactNode) {
    if (offset === maxChars) {
      return null
    }

    if (Array.isArray(node)) {
      const result = []
      for (const child of node) {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        const truncated = traverse(child)
        if (truncated) {
          result.push(truncated)
        }
        if (offset === maxChars) {
          return result
        }
      }
      return result
    }

    if (React.isValidElement(node)) {
      // TODO: find a way to make the rendering extensible while allowing textDepth to be tracked.
      // Right now we assume that only these two Text nodes will be used.
      if (node.type === Sans || node.type === Serif || node.type === PaletteText) {
        textDepth += 1
      }
      const children = React.Children.toArray((node.props as any).children)
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      const truncatedChildren = traverse(children)

      if (node.type === Sans || node.type === Serif || node.type === PaletteText) {
        if (textDepth === 1 && maxChars === offset) {
          truncatedChildren.push(
            <>
              {"... "}
              <LinkText onPress={onExpand}>
                <PaletteText variant="mediumText">Read&nbsp;more</PaletteText>
              </LinkText>
            </>
          )
        }
        textDepth -= 1
      }

      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      return React.cloneElement(node, null, ...truncatedChildren)
    }

    if (node === null || typeof node === "boolean" || typeof node === "undefined") {
      return ""
    }

    let text = node.toString()
    if (text.length > maxChars - offset) {
      text = text.slice(0, maxChars - offset) as string
    }

    offset += text.length

    return text
  }

  return traverse(root)
}
