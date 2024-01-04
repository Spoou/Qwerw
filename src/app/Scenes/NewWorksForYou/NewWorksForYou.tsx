import { OwnerType } from "@artsy/cohesion"
import {
  BackButton,
  Flex,
  FullWidthIcon,
  GridIcon,
  Skeleton,
  SkeletonBox,
  SkeletonText,
  Spacer,
  useSpace,
} from "@artsy/palette-mobile"
import { PlaceholderGrid } from "app/Components/ArtworkGrids/GenericGrid"
import { NewWorksForYouGridQR } from "app/Scenes/NewWorksForYou/Components/NewWorksForYouGrid"
import { NewWorksForYouListQR } from "app/Scenes/NewWorksForYou/Components/NewWorksForYouList"
import { ViewOption } from "app/Scenes/Search/UserPrefsModel"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { times } from "lodash"
import { MotiPressable } from "moti/interactions"
import { LayoutAnimation } from "react-native"
import { isTablet } from "react-native-device-info"

export const SCREEN_TITLE = "New Works for You"
export const PAGE_SIZE = 100
export const RECOMMENDATION_MODEL_EXPERIMENT_NAME = "eigen-new-works-for-you-recommendations-model"
export const DEFAULT_RECS_MODEL_VERSION = "C"

export interface NewWorksForYouScreenProps {
  maxWorksPerArtist: number
  version: string
}

interface NewWorksForYouQueryRendererProps {
  utm_medium?: string
  maxWorksPerArtist?: number
  version?: string
}
const ICON_SIZE = 26

export const NewWorksForYouQueryRenderer: React.FC<NewWorksForYouQueryRendererProps> = ({
  utm_medium,
  maxWorksPerArtist = 3,
  version: versionProp,
}) => {
  const enableNewWorksForYouFeed = useFeatureFlag("AREnableNewWorksForYouScreenFeed")
  const experiment = useExperimentVariant("onyx_new_works_for_you_feed")
  const space = useSpace()

  const isReferredFromEmail = utm_medium === "email"

  // Use the version specified in the URL or no version if the screen is opened from the email.
  const version =
    isReferredFromEmail && versionProp ? versionProp?.toUpperCase() : DEFAULT_RECS_MODEL_VERSION

  const newWorksForYouViewOption = GlobalStore.useAppState(
    (state) => state.userPrefs.newWorksForYouViewOption
  )

  const setNewWorksForYouViewOption = GlobalStore.actions.userPrefs.setNewWorksForYouViewOption

  if (
    // The feed is not optimised for tablets yet.
    !isTablet() &&
    // Release only when ready for release!
    enableNewWorksForYouFeed &&
    // Release only when the experiment is enabled.
    experiment.enabled &&
    // Show only if the experiment payload is "gridAndList".
    experiment.payload !== "gridOnly"
  ) {
    return (
      <ProvideScreenTrackingWithCohesionSchema
        info={screen({ context_screen_owner_type: OwnerType.newWorksForYou })}
      >
        <Flex>
          {newWorksForYouViewOption === "grid" ? (
            <NewWorksForYouGridQR maxWorksPerArtist={maxWorksPerArtist} version={version} />
          ) : (
            <NewWorksForYouListQR maxWorksPerArtist={maxWorksPerArtist} version={version} />
          )}

          <Flex
            position="absolute"
            justifyContent="space-between"
            flexDirection="row"
            width="100%"
            alignItems="center"
            px={2}
            pt="15px"
          >
            <BackButton onPress={goBack} />

            {!!enableNewWorksForYouFeed && !isTablet() && (
              <MotiPressable
                onPress={() => {
                  setNewWorksForYouViewOption(newWorksForYouViewOption === "list" ? "grid" : "list")
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                }}
              >
                {newWorksForYouViewOption === "grid" ? (
                  <FullWidthIcon height={ICON_SIZE} width={ICON_SIZE} />
                ) : (
                  <GridIcon height={ICON_SIZE} width={ICON_SIZE} />
                )}
              </MotiPressable>
            )}
          </Flex>
        </Flex>
      </ProvideScreenTrackingWithCohesionSchema>
    )
  }

  return (
    <Flex>
      <NewWorksForYouGridQR maxWorksPerArtist={maxWorksPerArtist} version={version} />
      <BackButton
        onPress={goBack}
        style={{ position: "absolute", left: space(2), top: space(2) }}
      />
    </Flex>
  )
}

export const NewWorksForYouPlaceholder: React.FC<{ defaultViewOption?: ViewOption }> = ({
  defaultViewOption,
}) => {
  const newWorksForYouViewOption = GlobalStore.useAppState(
    (state) => state.userPrefs.newWorksForYouViewOption
  )

  const viewOption = defaultViewOption ?? newWorksForYouViewOption

  return (
    <Skeleton>
      <Spacer y={4} />
      <Flex flexDirection="row">
        <Flex my={2} px={2}>
          <SkeletonText variant="lg-display">New Works For You</SkeletonText>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <SkeletonText variant="xs" mt={1}>
              XX Artworks
            </SkeletonText>
          </Flex>
        </Flex>
      </Flex>
      <Spacer y={2} />
      {viewOption === "grid" ? (
        <PlaceholderGrid />
      ) : (
        <Flex width="100%" px={2}>
          {times(4).map((i) => (
            <Flex key={i} mt={1} mb={2}>
              <Flex>
                <SkeletonBox key={i} width="100%" height={400} />
              </Flex>
              <Spacer y={1} />
              <SkeletonText>David Hockey</SkeletonText>
              <Spacer y={0.5} />
              <SkeletonText>Mercy from the Virtues H9-13 </SkeletonText>
              <Spacer y={0.5} />
              <SkeletonText>Berg Contemporary</SkeletonText>
              <Spacer y={0.5} />
              <SkeletonText>£38,000</SkeletonText>
            </Flex>
          ))}
        </Flex>
      )}
    </Skeleton>
  )
}
