import { LotsByArtistsYouFollow_me } from "__generated__/LotsByArtistsYouFollow_me.graphql"
import { LotsByArtistsYouFollowQuery } from "__generated__/LotsByArtistsYouFollowQuery.graphql"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderGrid, ProvidePlaceholderContext } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Box, Message, Spacer } from "palette"
import React from "react"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"

const SCREEN_TITLE = "Auction Lots for You"
interface LotsByArtistsYouFollowProps {
  me: LotsByArtistsYouFollow_me
  relay: RelayPaginationProp
}

export const LotsByArtistsYouFollow: React.FC<LotsByArtistsYouFollowProps> = ({ me, relay }) => {
  return (
    <PageWithSimpleHeader title={SCREEN_TITLE}>
      <Box>
        {!!me?.lotsByFollowedArtistsConnection?.edges?.length ? (
          <InfiniteScrollArtworksGridContainer
            loadMore={relay.loadMore}
            hasMore={relay.hasMore}
            connection={me.lotsByFollowedArtistsConnection}
            shouldAddPadding
            HeaderComponent={<Spacer mt={2} />}
            useParentAwareScrollView={false}
            showLoadingSpinner
          />
        ) : (
          <Message m={2}>Nothing yet. Please check back later.</Message>
        )}
      </Box>
    </PageWithSimpleHeader>
  )
}

export const LoteByArtistsYouFollowScreenQuery = graphql`
  query LotsByArtistsYouFollowQuery($count: Int!, $cursor: String) {
    me {
      ...LotsByArtistsYouFollow_me @arguments(count: $count, cursor: $cursor)
    }
  }
`

export const LotsByArtistsYouFollowFragmentContainer = createPaginationContainer(
  LotsByArtistsYouFollow,
  {
    me: graphql`
      fragment LotsByArtistsYouFollow_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        lotsByFollowedArtistsConnection(first: $count, after: $cursor, liveSale: true, isAuction: true)
          @connection(key: "LotsByArtistsYouFollow_lotsByFollowedArtistsConnection") {
          edges {
            cursor
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps: ({ me }) => me && me.lotsByFollowedArtistsConnection,
    getVariables: (_props, { count, cursor }) => ({ count, cursor }),
    query: LoteByArtistsYouFollowScreenQuery,
  }
)

export const LotsByArtistsYouFollowQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<LotsByArtistsYouFollowQuery>
      environment={defaultEnvironment}
      query={LoteByArtistsYouFollowScreenQuery}
      variables={{
        count: 10,
      }}
      render={renderWithPlaceholder({
        Container: LotsByArtistsYouFollowFragmentContainer,
        renderPlaceholder: Placeholder,
        renderFallback: () => null,
      })}
    />
  )
}

const Placeholder = () => {
  return (
    <ProvidePlaceholderContext>
      <PageWithSimpleHeader title={SCREEN_TITLE}>
        <Spacer mt={2} />
        <PlaceholderGrid />
      </PageWithSimpleHeader>
    </ProvidePlaceholderContext>
  )
}
