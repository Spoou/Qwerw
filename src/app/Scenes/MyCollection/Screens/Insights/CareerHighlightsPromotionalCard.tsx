import { Button, Flex, Text } from "palette"
import { Image } from "react-native"
import { useScreenDimensions } from "shared/hooks"

export const CareerHighlightsPromotionalCard: React.FC = () => {
  const { width } = useScreenDimensions()

  return (
    <Flex flexGrow={1} width={width}>
      <Flex mx={2} position="relative">
        <Text mt={4} variant="xl">
          Discover Career{"\n"}Highlights for Your{"\n"}Artists
        </Text>
        <Text mt={2} variant="md" color="black60">
          Add artworks to reveal career highlights for your artists.
        </Text>
        <Button mt={4} block>
          Upload Artwork
        </Button>
      </Flex>

      <Flex flex={1} justifyContent="flex-end">
        <Image
          style={{ width: "100%" }}
          source={require("images/careerHighlightsPromotionalCardImage.webp")}
        />
      </Flex>
    </Flex>
  )
}
