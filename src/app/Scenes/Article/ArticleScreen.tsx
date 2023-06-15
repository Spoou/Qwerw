import {
  Flex,
  Join,
  Screen,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
} from "@artsy/palette-mobile"
import { ArticleScreenQuery } from "__generated__/ArticleScreenQuery.graphql"
import { ArticleBody } from "app/Scenes/Article/Components/ArticleBody"
import { ArticleRelatedArticlesRail } from "app/Scenes/Article/Components/ArticleRelatedArticlesRail"
import { ArticleShareButton } from "app/Scenes/Article/Components/ArticleShareButton"
import { ArticleWebViewScreen } from "app/Scenes/Article/Components/ArticleWebViewScreen"
import { goBack } from "app/system/navigation/navigate"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface ArticleScreenProps {
  articleID: string
}

export const ArticleScreen: React.FC<ArticleScreenProps> = (props) => {
  return (
    <Suspense fallback={<Placeholder />}>
      <Article {...props} />
    </Suspense>
  )
}

const Article: React.FC<ArticleScreenProps> = (props) => {
  const data = useLazyLoadQuery<ArticleScreenQuery>(articleScreenQuery, {
    slug: props.articleID,
  })

  if (!data.article) {
    return null
  }

  const NATIVE_LAYOUTS = ["STANDARD", "FEATURE"]

  const redirectToWebview = !NATIVE_LAYOUTS.includes(data.article.layout)

  if (redirectToWebview) {
    return <ArticleWebViewScreen article={data.article} />
  }

  const Header = data.article.layout === "FEATURE" ? Screen.FloatingHeader : Screen.AnimatedHeader

  return (
    <Screen>
      <Header
        title={data.article.title ?? ""}
        rightElements={<ArticleShareButton article={data.article} />}
        onBack={goBack}
        top={0}
      />

      <Screen.Body fullwidth>
        <Screen.ScrollView>
          <ArticleBody article={data.article} />

          {data.article.relatedArticles.length > 0 && (
            <>
              <ArticleRelatedArticlesRail relatedArticles={data.article} my={2} />
            </>
          )}
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}

export const articleScreenQuery = graphql`
  query ArticleScreenQuery($slug: String!) {
    article(id: $slug) {
      ...ArticleShareButton_article
      ...ArticleWebViewScreen_article
      ...ArticleBody_article
      ...ArticleRelatedArticlesRail_article

      href
      layout
      title
      relatedArticles {
        internalID
      }
    }
  }
`

const Placeholder: React.FC = () => {
  return (
    <Screen testID="ArticleScreenPlaceholder">
      <Screen.Header rightElements={<ArticleShareButton article={null as any} />} onBack={goBack} />

      <Screen.Body fullwidth>
        <Skeleton>
          <Flex px={2}>
            <Join separator={<Spacer y={0.5} />}>
              <SkeletonText variant="xs">Art Vertical</SkeletonText>
              <SkeletonText variant="lg-display">Some Placeholder Title that wraps</SkeletonText>
              <SkeletonText variant="sm-display">Some Author</SkeletonText>
              <SkeletonText variant="xs" mt={1}>
                September 1st, 2021
              </SkeletonText>
            </Join>

            <Spacer y={2} />

            <SkeletonBox width="100%" height={400} />
          </Flex>
        </Skeleton>
      </Screen.Body>
    </Screen>
  )
}
