import { OwnerType } from "@artsy/cohesion"
import { EditSavedSearchAlert_artist } from "__generated__/EditSavedSearchAlert_artist.graphql"
import { EditSavedSearchAlert_artworksConnection } from "__generated__/EditSavedSearchAlert_artworksConnection.graphql"
import { EditSavedSearchAlertQuery } from "__generated__/EditSavedSearchAlertQuery.graphql"
import { SavedSearchAlertQueryResponse } from "__generated__/SavedSearchAlertQuery.graphql"
import { emitSavedSearchRefetchEvent } from "lib/Components/Artist/ArtistArtworks/SavedSearchButton"
import { ArtsyKeyboardAvoidingView } from "lib/Components/ArtsyKeyboardAvoidingView"
import { Aggregations } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { convertSavedSearchCriteriaToFilterParams } from "lib/Components/ArtworkFilter/SavedSearch/convertersToFilterParams"
import { SearchCriteriaAttributes } from "lib/Components/ArtworkFilter/SavedSearch/types"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { goBack } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { useTheme } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { EditSavedSearchFormPlaceholder } from "./Components/EditSavedSearchAlertPlaceholder"
import { SavedSearchAlertQueryRenderer } from "./SavedSearchAlert"
import { SavedSearchAlertForm } from "./SavedSearchAlertForm"

interface EditSavedSearchAlertBaseProps {
  savedSearchAlertId: string
}

interface EditSavedSearchAlertProps {
  me: SavedSearchAlertQueryResponse["me"]
  artist: EditSavedSearchAlert_artist
  savedSearchAlertId: string
  artworksConnection: EditSavedSearchAlert_artworksConnection
}

export const EditSavedSearchAlert: React.FC<EditSavedSearchAlertProps> = (props) => {
  const { me, artist, artworksConnection, savedSearchAlertId } = props
  const { space } = useTheme()
  const aggregations = (artworksConnection.aggregations ?? []) as Aggregations
  const { userAlertSettings, ...savedSearchCriteria } = me?.savedSearch ?? {}
  const filters = convertSavedSearchCriteriaToFilterParams(
    savedSearchCriteria as SearchCriteriaAttributes,
    aggregations
  )

  const onComplete = () => {
    goBack()
    emitSavedSearchRefetchEvent()
  }

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.SavedSearchEdit,
        context_screen_owner_id: savedSearchAlertId,
        context_screen_owner_type: OwnerType.savedSearch,
      }}
    >
      <ArtsyKeyboardAvoidingView>
        <PageWithSimpleHeader title="Edit your Alert">
          <ScrollView
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: space(2) }}
          >
            <SavedSearchAlertForm
              initialValues={{
                name: userAlertSettings?.name ?? "",
                enableEmailNotifications: true,
                enablePushNotifications: true,
              }}
              artistId={artist.internalID}
              artistName={artist.name!}
              filters={filters}
              aggregations={aggregations}
              savedSearchAlertId={savedSearchAlertId}
              onComplete={onComplete}
              onDeleteComplete={onComplete}
            />
          </ScrollView>
        </PageWithSimpleHeader>
      </ArtsyKeyboardAvoidingView>
    </ProvideScreenTracking>
  )
}

export const EditSavedSearchAlertFragmentContainer = createFragmentContainer(EditSavedSearchAlert, {
  artist: graphql`
    fragment EditSavedSearchAlert_artist on Artist {
      internalID
      name
    }
  `,
  artworksConnection: graphql`
    fragment EditSavedSearchAlert_artworksConnection on FilterArtworksConnection {
      aggregations {
        slice
        counts {
          count
          name
          value
        }
      }
    }
  `,
})

export const EditSavedSearchAlertQueryRenderer: React.FC<EditSavedSearchAlertBaseProps> = (props) => {
  const { savedSearchAlertId } = props

  return (
    <SavedSearchAlertQueryRenderer
      savedSearchAlertId={savedSearchAlertId}
      render={renderWithPlaceholder({
        render: (relayProps: SavedSearchAlertQueryResponse) => (
          <QueryRenderer<EditSavedSearchAlertQuery>
            environment={defaultEnvironment}
            query={graphql`
              query EditSavedSearchAlertQuery($artistID: String!) {
                artist(id: $artistID) {
                  ...EditSavedSearchAlert_artist
                }
                artworksConnection(
                  first: 0
                  artistID: $artistID
                  aggregations: [ARTIST, LOCATION_CITY, MATERIALS_TERMS, MEDIUM, PARTNER, COLOR]
                ) {
                  ...EditSavedSearchAlert_artworksConnection
                }
              }
            `}
            variables={{ artistID: relayProps.me?.savedSearch?.artistID! }}
            render={renderWithPlaceholder({
              Container: EditSavedSearchAlertFragmentContainer,
              renderPlaceholder: () => <EditSavedSearchFormPlaceholder />,
              initialProps: { savedSearchAlertId, ...relayProps },
            })}
          />
        ),
        renderPlaceholder: () => <EditSavedSearchFormPlaceholder />,
      })}
    />
  )
}
