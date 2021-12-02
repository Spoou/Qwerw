import { useMeasuredView } from "lib/utils/useMeasuredView"
import { useSpace } from "palette"
import React, { useEffect, useMemo, useState } from "react"
import Animated from "react-native-reanimated"
import { CollapsableHeaderContext } from "./CollapsableHeaderContext"

export const CollapsableHeaderContextContainer: React.FC<{}> = (props) => {
  const { children } = props
  const space = useSpace()
  const headerHeight = space(6)
  const [jsx, setJSX] = useState<React.ReactNode>(null)
  const scrollOffsetY = useMemo(() => new Animated.Value(0), [])
  const { jsx: stickyHeaderContent, nativeHeight: stickyHeaderContentHeight } = useMeasuredView(jsx)
  const totalHeaderHeight = Animated.add(headerHeight * 2, stickyHeaderContentHeight)

  useEffect(() => {
    console.log("[debug] stickyHeaderContent")
  }, [stickyHeaderContent])

  return (
    <CollapsableHeaderContext.Provider
      value={{
        scrollOffsetY,
        stickyHeaderContent,
        stickyHeaderContentHeight,
        totalHeaderHeight,
        headerHeight,
        setJSX,
      }}
    >
      {children}
    </CollapsableHeaderContext.Provider>
  )
}
