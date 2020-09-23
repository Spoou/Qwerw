import { InquiryButtons_artwork } from "__generated__/InquiryButtons_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import ChevronIcon from "lib/Icons/ChevronIcon"
import { Flex, Separator, Text } from "palette"
import React, { useState } from "react"
import { LayoutAnimation, TouchableOpacity } from "react-native"

const makeRow = (name: string, value: string) => (
  <Flex flexDirection="row" mb={1}>
    <Text style={{ flex: 1 }}>{name}</Text>
    <Text color="black60" style={{ flex: 1, flexGrow: 3 }}>
      {value}
    </Text>
  </Flex>
)

export const CollapsibleArtworkDetails: React.FC<{ artwork: InquiryButtons_artwork }> = ({ artwork }) => {
  const [isExpanded, setExpanded] = useState(false)
  const toggleExpanded = () => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    })
    setExpanded(!isExpanded)
  }
  return artwork ? (
    <>
      <TouchableOpacity onPress={() => toggleExpanded()}>
        <Flex flexDirection="row" padding={2}>
          {!!artwork.image && (
            <OpaqueImageView
              height={40}
              aspectRatio={(artwork.image.width || 1) / (artwork.image.height || 1)}
              imageURL={artwork.image.url}
              width={40}
              style={{ alignSelf: "center" }}
            />
          )}
          <Flex ml={2} flex="1">
            <Text mb={0.25}>{artwork.artist?.name}</Text>
            <Text color="black60" variant="caption">
              {artwork.title}, {artwork.date}
            </Text>
          </Flex>
          <ChevronIcon color="black" expanded={isExpanded} initialDirection="down" />
        </Flex>
      </TouchableOpacity>
      {isExpanded && (
        <Flex mx={2} mb={1}>
          {!!artwork.medium && makeRow("Medium", artwork.medium)}
          {!!artwork.dimensions && makeRow("Size", artwork.dimensions.in + "\n" + artwork.dimensions.cm)}
          {!!artwork.editionOf && makeRow("Availability", artwork.editionOf)}
          {!!artwork.signatureInfo?.details && makeRow("Signature", artwork.signatureInfo.details)}
        </Flex>
      )}
      <Separator />
    </>
  ) : null
}
