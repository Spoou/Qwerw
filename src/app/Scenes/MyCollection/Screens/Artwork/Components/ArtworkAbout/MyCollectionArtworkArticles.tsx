import {
  MyCollectionArtworkArticles_article,
  MyCollectionArtworkArticles_article$key,
} from "__generated__/MyCollectionArtworkArticles_article.graphql"
import { ArticleCardContainer } from "app/Components/ArticleCard"
import { Flex, Spacer, Text } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"

interface MyCollectionArtworkArticlesProps {
  articles: MyCollectionArtworkArticles_article$key
  artistNames: string | null
}

export const MyCollectionArtworkArticles: React.FC<MyCollectionArtworkArticlesProps> = (props) => {
  const articles = useFragment<MyCollectionArtworkArticles_article$key>(
    articleFragment,
    props.articles
  )

  return (
    <Flex>
      <Flex flexDirection="row" justifyContent="flex-start">
        <Text variant="md" mb={2}>{`Articles featuring ${props.artistNames || ""}`}</Text>
        {articles.length > 3 && (
          <Text variant="xs" color="blue100" ml={0.5}>
            {articles.length}
          </Text>
        )}
      </Flex>

      <FlatList<MyCollectionArtworkArticles_article[number]>
        horizontal
        ItemSeparatorComponent={() => <Spacer ml="2" />}
        scrollsToTop={false}
        style={{ overflow: "visible" }}
        initialNumToRender={2}
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ArticleCardContainer article={item} />}
      />
    </Flex>
  )
}

const articleFragment = graphql`
  fragment MyCollectionArtworkArticles_article on Article @relay(plural: true) {
    id
    ...ArticleCard_article
  }
`
