import { OrderDetails_order } from "__generated__/OrderDetails_order.graphql"
import { OrderDetailsQuery } from "__generated__/OrderDetailsQuery.graphql"
import { theme } from "lib/Components/Bidding/Elements/Theme"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { times } from "lodash"
import { Box, Flex, Text } from "palette"
import React from "react"
import { ScrollView, SectionList } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { ArtworkInfoSectionFragmentContainer } from "./ArtworkInfoSection"

export interface OrderDetailsProps {
  order: OrderDetails_order
}
interface SectionListItem {
  key: string
  title: string
  data: readonly JSX.Element[]
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const DATA: SectionListItem[] = [
    {
      key: "Artwork_Info",
      title: "Artwork Info",
      data: [<ArtworkInfoSectionFragmentContainer artwork={order} />],
    },
  ]

  return (
    <PageWithSimpleHeader title="Order Details">
      <ScrollView>
        <Flex flexDirection="column" justifyContent="space-between" px={2}>
          <SectionList
            sections={DATA}
            keyExtractor={(item, index) => item.key + index.toString()}
            renderItem={({ item }) => (
              <Flex flexDirection="column" justifyContent="space-between">
                <Box>{item}</Box>
              </Flex>
            )}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({ section: { title } }) => (
              <Box mt={2}>
                <Text fontSize={15} fontWeight={500} lineHeight={22}>
                  {title}
                </Text>
              </Box>
            )}
            SectionSeparatorComponent={(data) => (
              <Box
                style={{
                  height: !!data.leadingItem && !!data.trailingSection ? 2 : 0,
                  backgroundColor: `${theme.colors.black10}`,
                }}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              ></Box>
            )}
          />
        </Flex>
      </ScrollView>
    </PageWithSimpleHeader>
  )
}

export const OrderDetailsPlaceholder: React.FC<{}> = () => (
  <PageWithSimpleHeader title="Order Details">
    <Flex px={2} py={15}>
      {times(2).map((index: number) => (
        <Flex key={index} py={1}>
          <PlaceholderText width={100 + Math.random() * 100} />
        </Flex>
      ))}
    </Flex>
  </PageWithSimpleHeader>
)

export const OrderDetailsContainer = createFragmentContainer(OrderDetails, {
  order: graphql`
    fragment OrderDetails_order on CommerceOrder {
      internalID
      code
      state
      ...ArtworkInfoSection_artwork
    }
  `,
})

export const OrderDetailsQueryRender: React.FC<{ orderID: string }> = ({ orderID: orderID }) => {
  return (
    <QueryRenderer<OrderDetailsQuery>
      environment={defaultEnvironment}
      query={graphql`
        query OrderDetailsQuery($orderID: ID!) {
          order: commerceOrder(id: $orderID) {
            ...OrderDetails_order
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: OrderDetailsContainer,
        renderPlaceholder: () => <OrderDetailsPlaceholder />,
      })}
      variables={{ orderID }}
      cacheConfig={{ force: true }}
    />
  )
}
