import { useAnimatedValue } from "lib/Components/StickyTabPage/reanimatedHelpers"
import { useUpdadeShouldHideBackButton } from "lib/utils/hideBackButtonOnScroll"
import { useAutoCollapsingMeasuredView } from "lib/utils/useAutoCollapsingMeasuredView"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useRef } from "react"
import { View } from "react-native"
import Animated from "react-native-reanimated"

interface StickyHeaderPageProps {
  headerContent: JSX.Element
  stickyHeaderContent: JSX.Element
  footerContent?: JSX.Element
}

export const StickyHeaderPage: React.FC<StickyHeaderPageProps> = (props) => {
  const { headerContent, stickyHeaderContent, footerContent, children } = props

  const footerOffsetY = useRef<Animated.Value<number>>(new Animated.Value(-1))
  const { jsx: staticHeader, nativeHeight: headerHeight } = useAutoCollapsingMeasuredView(headerContent)
  const { jsx: stickyHeader, nativeHeight: stickyHeaderHeight } = useAutoCollapsingMeasuredView(stickyHeaderContent)
  const scrollOffsetY = useAnimatedValue(0)
  const { width: screenWidth } = useScreenDimensions()
  const updateShouldHideBackButton = useUpdadeShouldHideBackButton()

  const shouldHideBackButton = Animated.greaterOrEq(scrollOffsetY, 10)

  const headerHeightRendered = Animated.cond(Animated.neq(headerHeight, new Animated.Value(-1)), headerHeight, 0)
  const stickyHeaderOffsetY = Animated.max(Animated.sub(headerHeightRendered, scrollOffsetY), 0)

  const stickyHeaderHeightRendered = Animated.cond(
    Animated.neq(stickyHeaderHeight, new Animated.Value(-1)),
    stickyHeaderHeight,
    0
  )
  const scrollOffsetYAndStickyHeaderHeight = Animated.add(scrollOffsetY, stickyHeaderHeightRendered)
  // If we have the starting position of the footer and the user scrolled to it
  const nearToTheFooter = Animated.and(
    Animated.greaterThan(footerOffsetY.current, 0),
    Animated.greaterThan(scrollOffsetYAndStickyHeaderHeight, footerOffsetY.current)
  )

  const translateY = Animated.cond(
    nearToTheFooter,
    // For example, the starting point of the footer component is 300 by Y, and the user has already scrolled 310.
    // So we move the sticky header up by 10 on translateY until it is fully hidden
    Animated.max(
      Animated.multiply(-1, stickyHeaderHeightRendered),
      Animated.sub(footerOffsetY.current, scrollOffsetYAndStickyHeaderHeight)
    ),
    stickyHeaderOffsetY
  )

  Animated.useCode(
    () =>
      Animated.onChange(
        shouldHideBackButton,
        Animated.call([shouldHideBackButton], ([shouldHide]) => {
          updateShouldHideBackButton(!!shouldHide)
        })
      ),
    []
  )

  return (
    <View style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      <Animated.ScrollView
        scrollEventThrottle={0.0000000001}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: scrollOffsetY },
              },
            },
          ],
          {
            useNativeDriver: true,
          }
        )}
      >
        {staticHeader}
        <Animated.View style={{ width: screenWidth, height: stickyHeaderHeightRendered }} />
        {children}
        {!!footerContent && (
          <View onLayout={(event) => (footerOffsetY.current = new Animated.Value(event.nativeEvent.layout.y))}>
            {footerContent}
          </View>
        )}
      </Animated.ScrollView>
      <Animated.View
        style={{
          position: "absolute",
          transform: [{ translateY }],
          width: screenWidth,
        }}
      >
        {stickyHeader}
      </Animated.View>
    </View>
  )
}
