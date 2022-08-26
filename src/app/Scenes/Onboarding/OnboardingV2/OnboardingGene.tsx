import { OnboardingGeneQuery } from "__generated__/OnboardingGeneQuery.graphql"
import { FullScreenLoadingImage } from "app/Components/FullScreenLoadingImage"
import { OnboardingResultsGrid } from "app/Scenes/Onboarding/OnboardingV2/Components/OnboardingResultsGrid"
import { Button, Flex, Screen } from "palette"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useBackHandler } from "shared/hooks/useBackHandler"
import { GeneHeader, images } from "./Components/GeneHeader"
import { useOnboardingContext } from "./Hooks/useOnboardingContext"

export type OnboardingGeneId = "artists-on-the-rise" | "trove" | "our-top-auction-lots"

interface OnboardingGeneProps {
  id: OnboardingGeneId
  description: string
}

const OnboardingGene: React.FC<OnboardingGeneProps> = ({ id, description }) => {
  const { onDone } = useOnboardingContext()

  // prevents Android users from going back with hardware button
  useBackHandler(() => true)

  const { gene } = useLazyLoadQuery<OnboardingGeneQuery>(OnboardingGeneScreenQuery, {
    id,
  })

  if (!gene?.artworks) {
    return null
  }

  return (
    <Screen>
      <Screen.Background>
        <GeneHeader geneID={id} description={description} gene={gene!} />
        <Flex px={2}>
          <OnboardingResultsGrid connection={gene?.artworks} />
        </Flex>
        <Flex p={2} background="white" position="absolute" bottom={0}>
          <Button block onPress={onDone} mb={1}>
            Explore More on Artsy
          </Button>
        </Flex>
      </Screen.Background>
    </Screen>
  )
}

export const OnboardingGeneScreen: React.FC<OnboardingGeneProps> = (props) => (
  <Suspense
    fallback={
      <FullScreenLoadingImage
        imgSource={images[props.id]}
        spacerHeight="80px"
        loadingText={"Great choice" + "\n" + "We’re finding a collection for you"}
      />
    }
  >
    <OnboardingGene {...props} />
  </Suspense>
)

const OnboardingGeneScreenQuery = graphql`
  query OnboardingGeneQuery($id: String!) {
    gene(id: $id) {
      ...GeneHeaderFragment_Gene
      internalID
      artworks: filterArtworksConnection(
        first: 100
        page: 1
        sort: "-decayed_merch"
        height: "*-*"
        width: "*-*"
        priceRange: "*-*"
        marketable: true
        offerable: true
        inquireableOnly: true
        forSale: true
      ) {
        ...OnboardingResultsGrid_connection
      }
    }
  }
`
