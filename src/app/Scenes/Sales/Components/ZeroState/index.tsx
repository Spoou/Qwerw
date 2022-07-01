import { Flex, Separator, Text } from "palette"
import React from "react"
import { View } from "react-native"

export class ZeroState extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }} testID="Sales-Zero-State-Container">
        <Text variant="md" textAlign="center" mb={1} mt={2}>
          Auctions
        </Text>
        <Separator />
        <Flex justifyContent="center" flexGrow={1}>
          <Text variant="sm" weight="medium" textAlign="center">
            There are no upcoming auctions scheduled
          </Text>
          <Text variant="sm" textAlign="center" color="black60">
            Check back soon for new auctions on Artsy.
          </Text>
        </Flex>
      </View>
    )
  }
}
