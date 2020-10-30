import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { color, Flex, Sans, space, Spacer } from "palette"
import React from "react"
import LinearGradient from "react-native-linear-gradient"
import { Box, BoxProps } from "../Box"
import { CardTag, CardTagProps } from "./CardTag"

export interface MediumCardProps extends BoxProps {
  image: string
  title: string
  subtitle?: string
  tag?: CardTagProps
}

/**
 * `MediumCard` is a card with one image one tall image, and text for title and subtitle
 * at the bottom.
 */
export const MediumCard: React.FC<MediumCardProps> = ({ image, title, subtitle, tag, ...rest }) => {
  return (
    <Box width={280} height={370} flexDirection="row" borderRadius={4} overflow="hidden" {...rest}>
      <Flex flex={2} background={color("black10")}>
        <OpaqueImageView imageURL={image} style={{ flex: 1 }} />
      </Flex>
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.15,
        }}
      />
      <Flex
        style={{
          position: "absolute",
          bottom: 0,
          left: 15,
          right: space(6),
        }}
      >
        <Sans size="5t" color={color("white100")}>
          {title}
        </Sans>
        {!!subtitle && (
          <Sans size="3t" color={color("white100")}>
            {subtitle}
          </Sans>
        )}
        <Spacer mt={15} />
      </Flex>
      {!!tag && <CardTag {...tag} style={{ position: "absolute", top: 15, left: 15 }} />}
    </Box>
  )
}
