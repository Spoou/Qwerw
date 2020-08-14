import { ArrowRightIcon, Flex, Sans } from "@artsy/palette"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { ArtistSeriesConnectionEdge } from "lib/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import React, { Component, useRef } from "react"
import { TouchableOpacity } from "react-native"

interface ArtistSeriesListItemProps {
  listItem: ArtistSeriesConnectionEdge
}

export const ArtistSeriesListItem: React.FC<ArtistSeriesListItemProps> = ({ listItem }) => {
  const navRef = useRef<Component>(null)

  const artworksCountMessage = listItem?.node?.artworksCountMessage

  return (
    <TouchableOpacity
      onPress={() => {
        SwitchBoard.presentNavigationViewController(navRef.current!, `/artist-series/${listItem?.node?.slug}`)
      }}
    >
      <Flex ref={navRef} flexDirection="row" mb={1} justifyContent="space-between">
        <Flex flexDirection="row" justifyContent="space-between" width="100%">
          <Flex flexDirection="row">
            <OpaqueImageView
              imageURL={listItem?.node?.image?.url ?? ""}
              height={70}
              width={70}
              style={{ borderRadius: 2, overflow: "hidden" }}
            />
            <Flex ml={1} justifyContent="center">
              <Sans size="3t" data-test-id="title">
                {listItem?.node?.title}
              </Sans>
              {!!artworksCountMessage && (
                <Sans size="3" color="black60" data-test-id="count">
                  {artworksCountMessage}
                </Sans>
              )}
            </Flex>
          </Flex>
          <Flex alignSelf="center">
            <ArrowRightIcon />
          </Flex>
        </Flex>
      </Flex>
    </TouchableOpacity>
  )
}
