import { useEmissionOption } from "lib/store/GlobalStore"
import { PlaceholderGrid, PlaceholderText } from "lib/utils/placeholders"
import { Flex, Separator, Spacer, Theme } from "palette"
import React from "react"

export const HeaderTabsGridPlaceholder: React.FC = () => {
  const showInsights = useEmissionOption("AROptionsNewInsightsPage")

  return (
    <Theme>
      <Flex>
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center" px="2">
          <Flex>
            <Spacer mb={75} />
            {/* Entity name */}
            <PlaceholderText width={180} />
            <Spacer mb={1} />
            {/* subtitle text */}
            <PlaceholderText width={100} />
            {/* more subtitle text */}
            <PlaceholderText width={150} />
          </Flex>
          <PlaceholderText width={70} alignSelf="flex-end" />
        </Flex>
        <Spacer mb={3} />
        {/* tabs */}
        <Flex justifyContent="space-around" flexDirection="row" px={2}>
          <PlaceholderText width={40} />
          <PlaceholderText width={50} />
          <PlaceholderText width={40} />
          {showInsights ? <PlaceholderText width={40} /> : null}
        </Flex>
        <Spacer mb={1} />
        <Separator />
        <Spacer mb={3} />
        {/* masonry grid */}
        <PlaceholderGrid />
      </Flex>
    </Theme>
  )
}
