import { Screen, Separator } from "@artsy/palette-mobile"
import { PartnerInitialQuery } from "__generated__/PartnerInitialQuery.graphql"
import { PartnerQuery } from "__generated__/PartnerQuery.graphql"
import { Partner_partner$data } from "__generated__/Partner_partner.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { HeaderTabsGridPlaceholder } from "app/Components/HeaderTabGridPlaceholder"
import { RetryErrorBoundaryLegacy } from "app/Components/RetryErrorBoundary"
import { TabsContainer } from "app/Components/Tabs/TabsContainer"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { useClientQuery } from "app/utils/useClientQuery"
import React from "react"
import { Tabs } from "react-native-collapsible-tab-view"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { PartnerArtworkFragmentContainer as PartnerArtwork } from "./Components/PartnerArtwork"
import { PartnerHeaderContainer as PartnerHeader } from "./Components/PartnerHeader"
import { PartnerOverviewFragmentContainer as PartnerOverview } from "./Components/PartnerOverview"
import { PartnerShowsFragmentContainer as PartnerShows } from "./Components/PartnerShows"
import { PartnerSubscriberBannerFragmentContainer as PartnerSubscriberBanner } from "./Components/PartnerSubscriberBanner"

interface PartnerProps {
  partner: Partner_partner$data
  initialTab?: string
  relay: RelayRefetchProp
}

const Partner: React.FC<PartnerProps> = (props) => {
  const { partner, initialTab } = props
  const { partnerType, displayFullPartnerPage } = partner

  if (!displayFullPartnerPage && partnerType !== "Brand") {
    return (
      <ProvideScreenTracking
        info={{
          context_screen: Schema.PageNames.PartnerPage,
          context_screen_owner_slug: props.partner.slug,
          context_screen_owner_id: props.partner.internalID,
          context_screen_owner_type: Schema.OwnerEntityTypes.Partner,
        }}
      >
        <PartnerHeader partner={partner} />
        <Separator my={2} />
        <PartnerSubscriberBanner partner={partner} />
      </ProvideScreenTracking>
    )
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.PartnerPage,
        context_screen_owner_slug: props.partner.slug,
        context_screen_owner_id: props.partner.internalID,
        context_screen_owner_type: Schema.OwnerEntityTypes.Partner,
      }}
    >
      <Screen>
        <Screen.Body fullwidth>
          <Screen.Header />
          <TabsContainer
            lazy
            initialTabName={initialTab}
            renderHeader={() => <PartnerHeader partner={partner} />}
          >
            <Tabs.Tab name="Overview" label="Overview">
              <Tabs.Lazy>
                <PartnerOverview partner={partner} />
              </Tabs.Lazy>
            </Tabs.Tab>
            <Tabs.Tab name="Artworks" label="Artworks">
              <Tabs.Lazy>
                <ArtworkFiltersStoreProvider>
                  <PartnerArtwork partner={partner} />
                </ArtworkFiltersStoreProvider>
              </Tabs.Lazy>
            </Tabs.Tab>
            <Tabs.Tab name="Shows" label="Shows">
              <Tabs.Lazy>
                <PartnerShows partner={partner} />
              </Tabs.Lazy>
            </Tabs.Tab>
          </TabsContainer>
        </Screen.Body>
      </Screen>
    </ProvideScreenTracking>
  )
}

export const PartnerContainer = createRefetchContainer(
  Partner,
  {
    partner: graphql`
      fragment Partner_partner on Partner
      @argumentDefinitions(displayArtistsSection: { type: "Boolean", defaultValue: true }) {
        id
        internalID
        slug
        partnerType
        displayFullPartnerPage
        ...PartnerArtwork_partner @arguments(input: { sort: "-partner_updated_at" })
        ...PartnerOverview_partner @arguments(displayArtistsSection: $displayArtistsSection)
        ...PartnerShows_partner
        ...PartnerHeader_partner
        ...PartnerSubscriberBanner_partner
      }
    `,
  },
  graphql`
    query PartnerRefetchQuery($id: ID!) {
      node(id: $id) {
        ...Partner_partner
      }
    }
  `
)

export const PartnerQueryRenderer: React.FC<{
  partnerID: string
  isVisible: boolean
}> = ({ partnerID, ...others }) => {
  const { loading, data } = useClientQuery<PartnerInitialQuery>({
    environment: getRelayEnvironment(),
    query: graphql`
      query PartnerInitialQuery($partnerID: String!) {
        partner(id: $partnerID) {
          displayArtistsSection
        }
      }
    `,
    variables: { partnerID },
  })

  if (loading) {
    return <HeaderTabsGridPlaceholder />
  }

  return (
    <RetryErrorBoundaryLegacy
      render={({ isRetry }) => {
        return (
          <QueryRenderer<PartnerQuery>
            environment={getRelayEnvironment()}
            query={graphql`
              query PartnerQuery($partnerID: String!, $displayArtistsSection: Boolean!) {
                partner(id: $partnerID) {
                  ...Partner_partner @arguments(displayArtistsSection: $displayArtistsSection)
                }
              }
            `}
            variables={{
              partnerID,
              displayArtistsSection: data?.partner?.displayArtistsSection ?? true,
            }}
            cacheConfig={{
              // Bypass Relay cache on retries.
              ...(isRetry && { force: true }),
            }}
            render={renderWithPlaceholder({
              Container: PartnerContainer,
              initialProps: others,
              renderPlaceholder: () => <HeaderTabsGridPlaceholder />,
            })}
          />
        )
      }}
    />
  )
}
