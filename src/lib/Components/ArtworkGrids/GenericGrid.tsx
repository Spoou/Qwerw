import Spinner from "lib/Components/Spinner"
import React from "react"
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import Artwork, { ArtworkGridItemPlaceholder } from "./ArtworkGridItem"

import { GenericGrid_artworks } from "__generated__/GenericGrid_artworks.graphql"
import { RandomNumberGenerator } from "lib/utils/placeholders"
import { times } from "lodash"
import { Theme } from "palette"
import { Stack } from "../Stack"

interface Props {
  artworks: GenericGrid_artworks
  sectionDirection?: "column" // FIXME: We don’t actually support more options atm
  sectionMargin?: number
  itemMargin?: number
  isLoading?: boolean
  trackingFlow?: string
  contextModule?: string
  trackTap?: (artworkSlug: string, itemIndex?: number) => void
  // Give explicit width to avoid resizing after mount
  width?: number
}

interface State {
  sectionDimension: number
  sectionCount: number
}

export class GenericArtworksGrid extends React.Component<Props, State> {
  static defaultProps = {
    sectionDirection: "column" as "column",
    sectionMargin: 20,
    itemMargin: 20,
  }

  state = this.props.width
    ? this.layoutState(this.props.width)
    : {
        sectionDimension: 0,
        sectionCount: 0,
      }

  width = 0

  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  layoutState(width): State {
    const isPad = width > 600
    const isPadHorizontal = width > 900

    const sectionCount = isPad ? (isPadHorizontal ? 4 : 3) : 2
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const sectionMargins = this.props.sectionMargin * (sectionCount - 1)
    const sectionDimension = (width - sectionMargins) / sectionCount

    return {
      sectionCount,
      sectionDimension,
    }
  }

  onLayout = (event: LayoutChangeEvent) => {
    if (this.props.width) {
      // noop because we were given an explicit width
      return
    }
    const layout = event.nativeEvent.layout
    if (layout.width !== this.width) {
      // this means we've rotated or are on our initial load
      this.width = layout.width
      this.setState(this.layoutState(layout.width))
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // if there's a change in columns, we'll need to re-render
    if (this.props.artworks === nextProps.artworks && this.state.sectionCount === nextState.sectionCount) {
      return false
    }
    return true
  }

  sectionedArtworks() {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const sectionedArtworks = []
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    const sectionRatioSums = []
    for (let i = 0; i < this.state.sectionCount; i++) {
      sectionedArtworks.push([])
      sectionRatioSums.push(0)
    }

    this.props.artworks.forEach((artwork) => {
      if (artwork.image) {
        let lowestRatioSum = Number.MAX_VALUE
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        let sectionIndex: number = null

        for (let j = 0; j < sectionRatioSums.length; j++) {
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          const ratioSum = sectionRatioSums[j]
          if (ratioSum < lowestRatioSum) {
            sectionIndex = j
            lowestRatioSum = ratioSum
          }
        }

        if (sectionIndex != null) {
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          const section = sectionedArtworks[sectionIndex]
          section.push(artwork)

          // total section aspect ratio
          const aspectRatio = artwork.image.aspect_ratio || 1
          // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
          sectionRatioSums[sectionIndex] += 1 / aspectRatio
        }
      }
    })

    return sectionedArtworks
  }

  renderSections() {
    const spacerStyle = {
      height: this.props.itemMargin,
    }
    const sectionedArtworks = this.sectionedArtworks()
    const sections = []
    const { contextModule, trackingFlow, trackTap } = this.props

    for (let column = 0; column < this.state.sectionCount; column++) {
      const artworkComponents = []
      const artworks = sectionedArtworks[column]
      for (let row = 0; row < artworks.length; row++) {
        const artwork = artworks[row]
        const itemIndex = row * this.state.sectionCount + column
        artworkComponents.push(
          <Artwork
            artwork={artwork}
            // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
            key={artwork.id + column + row}
            trackingFlow={trackingFlow}
            contextModule={contextModule}
            itemIndex={itemIndex}
            trackTap={trackTap}
          />
        )
        if (row < artworks.length - 1) {
          artworkComponents.push(<View style={spacerStyle} key={"spacer-" + row} accessibilityLabel="Spacer View" />)
        }
      }

      const sectionSpecificStyle = {
        width: this.state.sectionDimension,
        marginRight: column === this.state.sectionCount - 1 ? 0 : this.props.sectionMargin,
      }
      sections.push(
        <View style={[styles.section, sectionSpecificStyle]} key={column} accessibilityLabel={"Section " + column}>
          {artworkComponents}
        </View>
      )
    }
    return sections
  }

  render() {
    const artworks = this.state.sectionDimension ? this.renderSections() : null
    return (
      <Theme>
        <View onLayout={this.onLayout}>
          <View style={styles.container} accessibilityLabel="Artworks Content View">
            {artworks}
          </View>
          {this.props.isLoading ? <Spinner style={styles.spinner} /> : null}
        </View>
      </Theme>
    )
  }
}

interface Styles {
  container: ViewStyle
  section: ViewStyle
  spinner: ViewStyle
}

const styles = StyleSheet.create<Styles>({
  container: {
    flexDirection: "row",
  },
  section: {
    flexDirection: "column",
  },
  spinner: {
    marginTop: 20,
  },
})

const GenericGrid = createFragmentContainer(GenericArtworksGrid, {
  artworks: graphql`
    fragment GenericGrid_artworks on Artwork @relay(plural: true) {
      id
      image {
        aspect_ratio: aspectRatio
      }
      ...ArtworkGridItem_artwork
    }
  `,
})

export default GenericGrid

export const GenericGridPlaceholder: React.FC<{ width: number }> = ({ width }) => {
  const isPad = width > 600
  const isPadHorizontal = width > 900

  const numColumns = isPad ? (isPadHorizontal ? 4 : 3) : 2
  const rng = new RandomNumberGenerator(3432)

  return (
    <Stack horizontal>
      {times(numColumns).map((i) => (
        <Stack key={i} spacing={3} width={(width + 20) / numColumns - 20}>
          {times(isPad ? 10 : 5).map((j) => (
            <ArtworkGridItemPlaceholder key={j} seed={rng.next()} />
          ))}
        </Stack>
      ))}
    </Stack>
  )
}
