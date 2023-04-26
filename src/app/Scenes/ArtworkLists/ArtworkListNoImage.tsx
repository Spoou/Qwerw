import { FlexProps, NoImageIcon } from "@artsy/palette-mobile"
import { ArtworkListImageBorder } from "app/Scenes/ArtworkLists/ArtworkListImageBorder"
import { FC } from "react"

const NO_ICON_SIZE = 18

export const ArtworkListNoImage: FC<FlexProps> = (props) => {
  return (
    <ArtworkListImageBorder {...props}>
      <NoImageIcon width={NO_ICON_SIZE} height={NO_ICON_SIZE} fill="black60" />
    </ArtworkListImageBorder>
  )
}
