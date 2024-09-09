import { HomeViewSectionScreenQuery$data } from "__generated__/HomeViewSectionScreenQuery.graphql"
import { HomeViewSectionScreenArtworksQueryRenderer } from "app/Scenes/HomeViewSectionScreen/HomeViewSectionScreenArtworks"

import { Text } from "react-native-svg"

type HomeViewSectionScreenContentT = NonNullable<
  HomeViewSectionScreenQuery$data["homeView"]["section"]
>

export const HomeViewSectionScreenContent: React.FC<{ section: HomeViewSectionScreenContentT }> = (
  props
) => {
  const { section } = props

  switch (section.__typename) {
    case "ArtworksRailHomeViewSection":
      return <HomeViewSectionScreenArtworksQueryRenderer sectionID={section.internalID} />

    default:
      if (__DEV__) {
        return <Text>Non supported screen section: {section.__typename}</Text>
      }
      return null
  }
}
