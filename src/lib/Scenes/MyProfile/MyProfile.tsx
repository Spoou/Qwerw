import { OwnerType } from "@artsy/cohesion"
import { MyProfile_me } from "__generated__/MyProfile_me.graphql"
import { MyProfileQuery } from "__generated__/MyProfileQuery.graphql"
import { MenuItem } from "lib/Components/MenuItem"
import { presentEmailComposer } from "lib/NativeModules/presentEmailComposer"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { useFeatureFlag } from "lib/store/GlobalStore"
import { extractNodes } from "lib/utils/extractNodes"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "lib/utils/track"
import { screen } from "lib/utils/track/helpers"
import { times } from "lodash"
import { Flex, Join, Sans, Separator, Spacer } from "palette"
import React, { useCallback, useRef, useState } from "react"
import { FlatList, RefreshControl, ScrollView } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { SmallTileRailContainer } from "../Home/Components/SmallTileRail"
import { useEnableMyCollection } from "../MyCollection/MyCollection"
import { MyCollectionAndSavedWorks, Tab } from "./MyCollectionAndSavedWorks"
import { confirmLogout, SectionHeading } from "./MyProfileSettings"

export const MyProfile: React.FC<{ me: MyProfile_me; relay: RelayRefetchProp }> = ({ me, relay }) => {
  const shouldDisplayMyCollection = useEnableMyCollection()
  if (shouldDisplayMyCollection) {
    return <MyCollectionAndSavedWorks me={me} initialTab={Tab.collection} />
  }
  return <OldMyProfile me={me} relay={relay} />
}

/*
 * TODO: Marked For Deletion. Remove when MyCollections is released
 */
export const OldMyProfile: React.FC<{ me: MyProfile_me; relay: RelayRefetchProp }> = ({ me, relay }) => {
  const showOrderHistory = useFeatureFlag("AREnableOrderHistoryOption")
  const showSavedAddresses = useFeatureFlag("AREnableSavedAddresses")
  const showSavedSearchV2 = useFeatureFlag("AREnableSavedSearchV2")
  const listRef = useRef<FlatList<any>>(null)
  const recentlySavedArtworks = extractNodes(me?.followsAndSaves?.artworksConnection)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    relay.refetch(() => {
      setIsRefreshing(false)
      listRef.current?.scrollToOffset({ offset: 0, animated: false })
    })
  }, [])

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
      <Sans size="8" mx="2" mt="3">
        {me?.name}
      </Sans>
      <Separator my={2} />
      <SectionHeading title="Favorites" />
      {!!showSavedSearchV2 && (
        <MenuItem title="Saved Alerts" onPress={() => navigate("my-profile/saved-search-alerts")} />
      )}
      <MenuItem title="Saves and follows" onPress={() => navigate("favorites")} />
      {!!recentlySavedArtworks.length && (
        <SmallTileRailContainer artworks={recentlySavedArtworks} listRef={listRef} contextModule={null as any} />
      )}
      <Separator mt={3} mb={2} />
      <SectionHeading title="Account Settings" />
      <MenuItem title="Account" onPress={() => navigate("my-account")} />
      {!!showOrderHistory && <MenuItem title="Order History" onPress={() => navigate("/orders")} />}
      <MenuItem title="Payment" onPress={() => navigate("my-profile/payment")} />

      <MenuItem title="Push notifications" onPress={() => navigate("my-profile/push-notifications")} />

      {!!showSavedAddresses && (
        <MenuItem title="Saved Addresses" onPress={() => navigate("my-profile/saved-addresses")} />
      )}
      <MenuItem
        title="Send feedback"
        onPress={() => presentEmailComposer("support@artsy.net", "Feedback from the Artsy app")}
      />
      <MenuItem title="Personal data request" onPress={() => navigate("privacy-request")} />
      <MenuItem title="About" onPress={() => navigate("about")} />
      <MenuItem title="Log out" onPress={confirmLogout} chevron={null} />
      <Spacer mb={1} />
    </ScrollView>
  )
}

export const MyProfilePlaceholder: React.FC<{}> = () => (
  <Flex pt="3" px="2">
    <Join separator={<Separator my={2} />}>
      <PlaceholderText width={100 + Math.random() * 100} marginTop={15} />
      <Flex>
        <PlaceholderText width={100 + Math.random() * 100} />
        <PlaceholderText width={100 + Math.random() * 100} marginTop={15} />
        <Flex flexDirection="row" py={2}>
          {times(3).map((index: number) => (
            <Flex key={index} marginRight={1}>
              <PlaceholderBox height={120} width={120} />
              <PlaceholderText marginTop={20} key={index} width={40 + Math.random() * 80} />
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Flex>
        <PlaceholderText width={100 + Math.random() * 100} />
        {times(3).map((index: number) => (
          <Flex key={index} py={1}>
            <PlaceholderText width={200 + Math.random() * 100} />
          </Flex>
        ))}
      </Flex>
    </Join>
  </Flex>
)

export const MyProfileContainer = createRefetchContainer(
  MyProfile,
  {
    me: graphql`
      fragment MyProfile_me on Me {
        name
        createdAt
        followsAndSaves {
          artworksConnection(first: 10, private: true) {
            edges {
              node {
                id
                ...SmallTileRail_artworks
              }
            }
          }
        }
      }
    `,
  },
  graphql`
    query MyProfileRefetchQuery {
      me {
        ...MyProfile_me
      }
    }
  `
)

export const MyProfileQueryRenderer: React.FC<{}> = ({}) => (
  <ProvideScreenTrackingWithCohesionSchema info={screen({ context_screen_owner_type: OwnerType.profile })}>
    <QueryRenderer<MyProfileQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyProfileQuery {
          me @optionalField {
            ...MyProfile_me
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MyProfileContainer,
        renderPlaceholder: () => <MyProfilePlaceholder />,
      })}
      variables={{}}
    />
  </ProvideScreenTrackingWithCohesionSchema>
)
