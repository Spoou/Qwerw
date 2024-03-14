import {
  Box,
  Button,
  Flex,
  SkeletonText,
  Spacer,
  Text,
  useScreenDimensions,
  useTheme,
} from "@artsy/palette-mobile"
import { AlertArtworksGridQuery } from "__generated__/AlertArtworksGridQuery.graphql"
import GenericGrid, { GenericGridPlaceholder } from "app/Components/ArtworkGrids/GenericGrid"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { pluralize } from "app/utils/pluralize"
import { FC } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface AlertArtworksGridProps {
  alertId: string
}

const NUMBER_OF_ARTWORKS_TO_SHOW = 10

export const AlertArtworksGrid: FC<AlertArtworksGridProps> = ({ alertId }) => {
  const screen = useScreenDimensions()
  const { space } = useTheme()

  const data = useLazyLoadQuery<AlertArtworksGridQuery>(alertArtworksGridQuery, {
    alertId: alertId,
    first: NUMBER_OF_ARTWORKS_TO_SHOW,
  })
  const artworks = extractNodes(data.me?.alert?.artworksConnection)
  const artworksCount = data.me?.alert?.artworksConnection?.counts?.total ?? 0
  const artistIDs = data.me?.alert?.artistIDs ?? []
  const areMoreMatchesAvailable =
    artworksCount > NUMBER_OF_ARTWORKS_TO_SHOW && artistIDs.length === 1

  const numWorks = `${artworksCount} ${pluralize("work", artworksCount)}`

  const handleManageAlert = () => {
    requestAnimationFrame(() => {
      navigate(`settings/alerts/${alertId}/edit`)
    })
  }

  const handleSeeAllMatchingWorks = () => {
    requestAnimationFrame(() => {
      navigate(`/artist/${artistIDs?.[0]}`, {
        passProps: {
          search_criteria_id: alertId,
        },
      })
    })
  }

  return (
    <Flex>
      {artworksCount > 1 && (
        <Flex>
          <Text variant="sm">
            {numWorks} currently on Artsy match your criteria. See our top picks for you:
          </Text>
          <Spacer y={1} />
          <GenericGrid
            width={screen.width - space(2)}
            artworks={artworks}
            hideSaveIcon
            onPress={(slug: string) => {
              requestAnimationFrame(() => {
                navigate?.(`artwork/${slug}`)
              })
            }}
          />
        </Flex>
      )}
      {artworksCount === 0 && (
        <Box bg="black10" p={2}>
          <Text color="black100">No matches</Text>
          <Text color="black60">
            There aren't any works available that meet the criteria at this time.
          </Text>
        </Box>
      )}

      <Spacer y={2} />

      <Button onPress={handleManageAlert} block mb={1} variant="outline">
        {artworksCount === 0 ? "Manage Alert" : "Edit Alert"}
      </Button>

      {!!areMoreMatchesAvailable && (
        <Flex>
          <Spacer y={0.5} />
          <Button onPress={handleSeeAllMatchingWorks} block mb={1}>
            See all Matching Works
          </Button>
        </Flex>
      )}

      <Spacer y={2} />
    </Flex>
  )
}

const alertArtworksGridQuery = graphql`
  query AlertArtworksGridQuery($alertId: String!, $first: Int!) {
    me {
      alert(id: $alertId) {
        artistIDs
        artworksConnection(first: $first) {
          counts {
            total
          }
          edges {
            node {
              slug
              ...GenericGrid_artworks
            }
          }
        }
      }
    }
  }
`

export const AlertArtworksGridPlaceholder: FC = () => {
  const screen = useScreenDimensions()
  const { space } = useTheme()

  return (
    <Flex testID="alert-artworks-grid-placeholder">
      <SkeletonText>
        300 works currently on Artsy match your criteria. See our top picks for you:
      </SkeletonText>
      <Spacer y={1} />
      <GenericGridPlaceholder width={screen.width - space(4)} />
    </Flex>
  )
}
