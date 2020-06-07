import { Color, Flex, Sans, SansProps, Serif, SerifProps } from "@artsy/palette"
import { plainTextFromTree } from "lib/utils/plainTextFromTree"
import { defaultRules, renderMarkdown } from "lib/utils/renderMarkdown"
import { Schema } from "lib/utils/track"
import _ from "lodash"
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
  sans?: boolean
}

export const ReadMore = React.memo(
  ({ content, maxChars, presentLinksModally, color, trackingFlow, contextModule, sans }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const tracking = useTracking()
    const basicRules = defaultRules(presentLinksModally)
    const TextComponent: React.ComponentType<SansProps | SerifProps> = (!!sans ? Sans : Serif) as any
    const rules = {
      ...basicRules,
      paragraph: {
        ...basicRules.paragraph,
        // @ts-ignore STRICTNESS_MIGRATION
        react: (node, output, state) => {
          return (
            <TextComponent size="3" color={color || "black100"} key={state.key}>
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

  // @ts-ignore STRICTNESS_MIGRATION
  function traverse(node: React.ReactNode) {
    if (offset === maxChars) {
      return null
    }

    if (Array.isArray(node)) {
      const result = []
      for (const child of node) {
        // @ts-ignore STRICTNESS_MIGRATION
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
      if (node.type === Sans || node.type === Serif) {
        textDepth += 1
      }
      const children = React.Children.toArray((node.props as any).children)
      // @ts-ignore STRICTNESS_MIGRATION
      const truncatedChildren = traverse(children)

      if (node.type === Sans || node.type === Serif) {
        if (textDepth === 1 && maxChars === offset) {
          truncatedChildren.push(
            <>
              {"... "}
              <LinkText onPress={onExpand}>
                <Sans size="3" weight="medium">
                  Read&nbsp;more
                </Sans>
              </LinkText>
            </>
          )
        }
        textDepth -= 1
      }

      // @ts-ignore STRICTNESS_MIGRATION
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
