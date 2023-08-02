import { Flex, Popover, Text } from "@artsy/palette-mobile"
import { ProgressiveOnboardingSaveArtwork_Query } from "__generated__/ProgressiveOnboardingSaveArtwork_Query.graphql"
import { GlobalStore } from "app/store/GlobalStore"
import { ElementInView } from "app/utils/ElementInView"
import { useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

export const ProgressiveOnboardingSaveArtwork: React.FC = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isInView, setIsInView] = useState(false)
  const { dismiss } = GlobalStore.actions.progressiveOnboarding
  const { isDismissed: _isDismissed } = GlobalStore.useAppState(
    (state) => state.progressiveOnboarding
  )
  const data = useLazyLoadQuery<ProgressiveOnboardingSaveArtwork_Query>(query, {})

  const savedArtworks = data?.me.counts.savedArtworks
  const isDismissed = _isDismissed("save-artwork").status
  const isDisplayable = !isDismissed && savedArtworks === 0

  const handleDismiss = () => {
    setIsVisible(false)
    dismiss("save-artwork")
  }

  if (!isDisplayable) {
    if (isInView) {
      return <>{children}</>
    }

    return <ElementInView onVisible={() => setIsInView(true)}>{children}</ElementInView>
  }

  return (
    <Popover
      visible={isVisible}
      onDismiss={handleDismiss}
      onPressOutside={handleDismiss}
      title={
        <Text weight="medium" color="white100">
          Like what you see?
        </Text>
      }
      content={<Text color="white100">Hit the heart to save an artwork.</Text>}
    >
      <Flex>{children}</Flex>
    </Popover>
  )
}

const query = graphql`
  query ProgressiveOnboardingSaveArtwork_Query {
    me @required(action: NONE) {
      counts @required(action: NONE) {
        savedArtworks
      }
    }
  }
`
