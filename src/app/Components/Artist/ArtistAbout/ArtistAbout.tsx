import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Tabs } from "@artsy/palette-mobile"
import { ArtistAboutQuery } from "__generated__/ArtistAboutQuery.graphql"
import { ArtistAbout_artist$key } from "__generated__/ArtistAbout_artist.graphql"
import Articles from "app/Components/Artist/Articles/Articles"
import { ArtistCollectionsRailFragmentContainer } from "app/Components/Artist/ArtistArtworks/ArtistCollectionsRail"
import { ArtistNotableWorksRailFragmentContainer } from "app/Components/Artist/ArtistArtworks/ArtistNotableWorksRail"
import { ArtistConsignButtonFragmentContainer as ArtistConsignButton } from "app/Components/Artist/ArtistConsignButton"
import Biography from "app/Components/Artist/Biography"
import RelatedArtists from "app/Components/RelatedArtists/RelatedArtists"
import { Stack } from "app/Components/Stack"
import { ArtistSeriesMoreSeriesFragmentContainer } from "app/Scenes/ArtistSeries/ArtistSeriesMoreSeries"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ActivityIndicator } from "react-native"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"
import { ArtistAboutShowsFragmentContainer } from "./ArtistAboutShows"

interface Props {
  artist: ArtistAbout_artist$key
}

export const ArtistAbout: React.FC<Props> = ({ artist: artistProp }) => {
  const artist = useFragment(artistAboutFragment, artistProp)

  const articles = extractNodes(artist.articles)
  const relatedArtists = extractNodes(artist.related?.artists)

  return (
    <Tabs.ScrollView>
      <Stack spacing={4} my={2}>
        {!!artist.hasMetadata && <Biography artist={artist as any} />}
        <ArtistSeriesMoreSeriesFragmentContainer
          contextScreenOwnerId={artist.internalID}
          contextScreenOwnerSlug={artist.slug}
          contextScreenOwnerType={OwnerType.artist}
          contextModule={ContextModule.artistSeriesRail}
          artist={artist}
          artistSeriesHeader="Top Artist Series"
          mt={2}
        />
        {artist.notableWorks?.edges?.length === 3 && (
          <ArtistNotableWorksRailFragmentContainer artist={artist} />
        )}
        {!!artist.iconicCollections && artist.iconicCollections.length > 1 && (
          <ArtistCollectionsRailFragmentContainer
            collections={artist.iconicCollections}
            artist={artist}
          />
        )}
        <ArtistConsignButton artist={artist} />
        <ArtistAboutShowsFragmentContainer artist={artist} />
        {!!articles.length && <Articles articles={articles} />}
        {!!relatedArtists.length && <RelatedArtists artists={relatedArtists} />}
      </Stack>
    </Tabs.ScrollView>
  )
}

const artistAboutFragment = graphql`
  fragment ArtistAbout_artist on Artist {
    hasMetadata
    internalID
    slug
    ...Biography_artist
    ...ArtistSeriesMoreSeries_artist
    ...ArtistNotableWorksRail_artist
    # this should match the query in ArtistNotableWorksRail
    notableWorks: filterArtworksConnection(first: 3, input: { sort: "-weighted_iconicity" }) {
      edges {
        node {
          id
        }
      }
    }
    ...ArtistCollectionsRail_artist
    iconicCollections: marketingCollections(isFeaturedArtistContent: true, size: 16) {
      ...ArtistCollectionsRail_collections
    }
    ...ArtistConsignButton_artist
    ...ArtistAboutShows_artist
    related {
      artists: artistsConnection(first: 16) {
        edges {
          node {
            ...RelatedArtists_artists
          }
        }
      }
    }
    articles: articlesConnection(first: 10, inEditorialFeed: true) {
      edges {
        node {
          ...Articles_articles
        }
      }
    }
  }
`

const artistAboutQuery = graphql`
  query ArtistAboutQuery($artistID: String!) {
    artist(id: $artistID) {
      ...ArtistAbout_artist
    }
  }
`

export const ArtistAboutQueryRenderer = withSuspense(
  ({ artistID }: { artistID: string }) => {
    const data = useLazyLoadQuery<ArtistAboutQuery>(artistAboutQuery, { artistID })
    if (!data.artist) {
      return null
    }

    return <ArtistAbout artist={data.artist} />
  },
  () => (
    <Flex flex={1} justifyContent="center" alignItems="center">
      <ActivityIndicator />
    </Flex>
  )
)
