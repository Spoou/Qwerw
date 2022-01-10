import { CheckCircleIcon, ChevronIcon, Collapse, Flex, Text, Touchable } from "palette"
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react"

interface CollapsableMenuItemProps {
  overtitle?: string
  title: string
  isExpanded?: boolean
  disabled?: boolean
  onExpand?: () => void
}

export interface CollapsibleMenuItem {
  collapse: () => void
  expand: () => void
  completed: () => void
}

export const CollapsibleMenuItem = forwardRef<CollapsibleMenuItem, React.PropsWithChildren<CollapsableMenuItemProps>>(
  ({ children, overtitle, title, isExpanded = false, disabled = false, onExpand }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    useEffect(() => {
      setIsOpen(isExpanded)
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        collapse() {
          setIsOpen(false)
        },
        expand() {
          setIsOpen(true)
        },
        completed() {
          setIsCompleted(true)
        },
      }),
      []
    )

    return (
      <Flex>
        <Touchable
          onPress={() => {
            setIsOpen(!isOpen)
            if (!isOpen) {
              onExpand?.()
            }
          }}
          disabled={disabled}
        >
          {!!overtitle && (
            <Text variant="sm" color={disabled ? "black30" : "black100"}>
              {overtitle}
            </Text>
          )}
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text variant="lg" color={disabled ? "black30" : "black100"} style={{ maxWidth: "90%" }}>
              {title}
            </Text>
            <Flex flexDirection="row" alignItems="center">
              {!!isCompleted && <CheckCircleIcon fill="green100" height={24} width={24} style={{ marginRight: 5 }} />}
              <ChevronIcon direction={isOpen ? "up" : "down"} fill={disabled ? "black30" : "black60"} />
            </Flex>
          </Flex>
        </Touchable>
        <Collapse open={isOpen}>{children}</Collapse>
      </Flex>
    )
  }
)
