import { tappedConsign, TappedConsignArgs } from "@artsy/cohesion"
import { ConsignmentsHome_targetSupply } from "__generated__/ConsignmentsHome_targetSupply.graphql"
import { ConsignmentsHomeQuery } from "__generated__/ConsignmentsHomeQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { AppStore } from "lib/store/AppStore"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Join, Separator } from "palette"
import React, { useRef } from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment"
import { ArtistListFragmentContainer as ArtistList } from "./Components/ArtistList"
import { Footer } from "./Components/Footer"
import { Header } from "./Components/Header"
import { HowItWorks } from "./Components/HowItWorks"
import { RecentlySoldFragmentContainer as RecentlySold } from "./Components/RecentlySold"

interface Props {
  targetSupply: ConsignmentsHome_targetSupply
  isLoading?: boolean
  isArrivingFromMyCollection?: boolean
}

export const ConsignmentsHome: React.FC<Props> = ({ targetSupply, isLoading, isArrivingFromMyCollection }) => {
  const navRef = useRef<ScrollView>(null)
  const tracking = useTracking()
  const navActions = AppStore.actions.myCollection.navigation

  const handleConsignPress = (tappedConsignArgs: TappedConsignArgs) => {
    if (isArrivingFromMyCollection) {
      navActions.navigateToConsignSubmission()
    } else if (navRef.current) {
      tracking.trackEvent(tappedConsign(tappedConsignArgs))
      const route = "/collections/my-collection/artworks/new/submissions/new"
      SwitchBoard.presentModalViewController(navRef.current, route)
    }
  }

  return (
    <>
      <ScrollView ref={navRef}>
        {!!isArrivingFromMyCollection && (
          <FancyModalHeader onLeftButtonPress={() => navActions.goBack()} hideBottomDivider />
        )}
        <Join separator={<Separator my={3} />}>
          <Header onConsignPress={handleConsignPress} />
          <RecentlySold targetSupply={targetSupply} isLoading={isLoading} />
          <HowItWorks />
          <ArtistList targetSupply={targetSupply} isLoading={isLoading} />
          <Footer onConsignPress={handleConsignPress} />
        </Join>
      </ScrollView>
    </>
  )
}

const ConsignmentsHomeContainer = createFragmentContainer(ConsignmentsHome, {
  targetSupply: graphql`
    fragment ConsignmentsHome_targetSupply on TargetSupply {
      ...RecentlySold_targetSupply
      ...ArtistList_targetSupply
    }
  `,
})

interface ConsignmentsHomeQueryRendererProps {
  environment?: RelayModernEnvironment
  isArrivingFromMyCollection?: boolean
}

export const ConsignmentsHomeQueryRenderer: React.FC<ConsignmentsHomeQueryRendererProps> = ({
  environment,
  isArrivingFromMyCollection,
}) => {
  return (
    <QueryRenderer<ConsignmentsHomeQuery>
      environment={environment || defaultEnvironment}
      variables={{}}
      query={graphql`
        query ConsignmentsHomeQuery {
          targetSupply {
            ...ConsignmentsHome_targetSupply
          }
        }
      `}
      render={renderWithPlaceholder({
        initialProps: { isArrivingFromMyCollection },
        Container: ConsignmentsHomeContainer,
        renderPlaceholder: () => (
          <ConsignmentsHome
            isArrivingFromMyCollection={isArrivingFromMyCollection}
            isLoading={true}
            targetSupply={null as any}
          />
        ),
      })}
    />
  )
}
