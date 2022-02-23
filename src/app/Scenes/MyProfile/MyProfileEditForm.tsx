import { useActionSheet } from "@expo/react-native-action-sheet"
import { useNavigation } from "@react-navigation/native"
import { EditableLocation } from "__generated__/ConfirmBidUpdateUserMutation.graphql"
import { MyProfileEditForm_me$key } from "__generated__/MyProfileEditForm_me.graphql"
import { MyProfileEditFormQuery } from "__generated__/MyProfileEditFormQuery.graphql"
import { ArtsyKeyboardAvoidingView } from "app/Components/ArtsyKeyboardAvoidingView"
import { Image } from "app/Components/Bidding/Elements/Image"
import {
  buildLocationDisplay,
  DetailedLocationAutocomplete,
} from "app/Components/DetailedLocationAutocomplete"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import LoadingModal from "app/Components/Modals/LoadingModal"
import { navigate } from "app/navigation/navigate"
import { useFeatureFlag } from "app/store/GlobalStore"
import { getConvertedImageUrlFromS3 } from "app/utils/getConvertedImageUrlFromS3"
import { useHasBeenTrue } from "app/utils/hooks"
import { PlaceholderBox, PlaceholderText, ProvidePlaceholderContext } from "app/utils/placeholders"
import { showPhotoActionSheet } from "app/utils/requestPhotos"
import { sendEmail } from "app/utils/sendEmail"
import { useFormik } from "formik"
import { compact, isArray } from "lodash"
import {
  Avatar,
  Box,
  Button,
  CheckCircleFillIcon,
  CheckCircleIcon,
  Flex,
  Input,
  Join,
  Spacer,
  Text,
  Touchable,
  useColor,
} from "palette"
<<<<<<< HEAD:src/app/Scenes/MyProfile/MyProfileEditForm.tsx
import React, { Suspense, useCallback, useContext, useEffect, useRef, useState } from "react"
import { PixelRatio, ScrollView, TextInput } from "react-native"
=======
import React, { Suspense, useContext, useEffect, useRef, useState } from "react"
import { ScrollView, TextInput } from "react-native"
>>>>>>> 65410620f (PR comments update):src/lib/Scenes/MyProfile/MyProfileEditForm.tsx
import { useLazyLoadQuery, useRefetchableFragment } from "react-relay"
import { graphql } from "relay-runtime"
import * as Yup from "yup"
import { updateMyUserProfile } from "../MyAccount/updateMyUserProfile"
import { MyProfileContext } from "./MyProfileProvider"
import { useHandleEmailVerification, useHandleIDVerification } from "./useHandleVerification"

const PRIMARY_LOCATION_OFFSET = 240
const ICON_SIZE = 22

interface EditMyProfileValuesSchema {
  photo: string
  name: string
  displayLocation: { display: string | null }
  location: EditableLocation | null
  profession: string
  otherRelevantPositions: string
  bio: string
}

const editMyProfileSchema = Yup.object().shape({
  photo: Yup.string(),
  name: Yup.string().required("Name is required"),
  bio: Yup.string(),
})

export const MyProfileEditForm: React.FC = () => {
  const data = useLazyLoadQuery<MyProfileEditFormQuery>(MyProfileEditFormScreenQuery, {})

  const [me, refetch] = useRefetchableFragment<MyProfileEditFormQuery, MyProfileEditForm_me$key>(
    meFragment,
    data.me
  )

  const color = useColor()
  const navigation = useNavigation()

  const scrollViewRef = useRef<ScrollView>(null)

  const { showActionSheetWithOptions } = useActionSheet()

  const nameInputRef = useRef<Input>(null)
  const bioInputRef = useRef<TextInput>(null)
  const relevantPositionsInputRef = useRef<Input>(null)
  const locationInputRef = useRef<Input>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [didUpdatePhoto, setDidUpdatePhoto] = useState(false)

  const { emailVerificationState, showVerificationBannerForEmail, handleEmailVerification } =
    useHandleEmailVerification()
  const { iDVerificationState, showVerificationBannerForID, handleIDVerification } =
    useHandleIDVerification()

  const enableCollectorProfile = useFeatureFlag("AREnableCollectorProfile")

  const { localImage, setLocalImage } = useContext(MyProfileContext)

  const uploadProfilePhoto = async (photo: string) => {
    try {
      // We want to show the local image initially for better UX since Gemini takes a while to process
      setLocalImage(photo)
      const iconUrl = await getConvertedImageUrlFromS3(photo)
      await updateMyUserProfile({ iconUrl })
    } catch (error) {
      console.error("Failed to upload profile picture", error)
    }
  }

  const updateUserInfo = async ({
    name,
    location,
    profession,
    otherRelevantPositions,
    bio,
  }: Partial<EditMyProfileValuesSchema>) => {
    const payload = {
      name,
      ...(location ? { location } : {}),
      profession,
      otherRelevantPositions,
      bio,
    }

    try {
      await updateMyUserProfile(payload)
    } catch (error) {
      console.error(`Failed to update ${Object.keys(payload).join(", ")}`, error)
    }
  }

  const { handleSubmit, handleChange, setFieldValue, dirty, values, errors, validateForm } =
    useFormik<EditMyProfileValuesSchema>({
      enableReinitialize: true,
      validateOnChange: true,
      validateOnBlur: true,
      initialValues: {
        name: me?.name ?? "",
        displayLocation: { display: buildLocationDisplay(me?.location || null) },
        location: null,
        profession: me?.profession ?? "",
        otherRelevantPositions: me?.otherRelevantPositions ?? "",
        bio: me?.bio ?? "",
        photo: localImage || me?.icon?.url || "",
      },
      initialErrors: {},
      onSubmit: async ({ photo, ...otherValues }) => {
        try {
          setLoading(true)
          await Promise.all(
            compact([
              await updateUserInfo(otherValues),
              didUpdatePhoto && (await uploadProfilePhoto(photo)),
            ])
          )
        } catch (error) {
          console.error("Failed to update user profile ", error)
        } finally {
          setLoading(false)
        }
        navigation.goBack()
      },
      validationSchema: editMyProfileSchema,
    })

  // We want to keep the "Save" button enabled as soon as the user edits an input
  const touched = useHasBeenTrue(dirty)

  const chooseImageHandler = () => {
    showPhotoActionSheet(showActionSheetWithOptions, true, false)
      .then((images) => {
        if (isArray(images) && images.length >= 1) {
          setDidUpdatePhoto(true)
          ;(handleChange("photo") as (value: string) => void)(images[0].path)
        }
      })
      .catch((e) =>
        console.error("Error when uploading an image from the device", JSON.stringify(e))
      )
  }

  useEffect(() => {
    const refetchProfileIdentificationInterval = setInterval(() => {
      // When the user applies the email verification and the modal is visible
      if (emailVerificationState || iDVerificationState) {
        refetch({ enableCollectorProfile })
      }
    }, 3000)

    return () => {
      clearInterval(refetchProfileIdentificationInterval)
    }
  }, [emailVerificationState, iDVerificationState])

  const onLeftButtonPressHandler = () => {
    setDidUpdatePhoto(false)
    navigation.goBack()
  }

  return (
    <>
      <FancyModalHeader
        onLeftButtonPress={onLeftButtonPressHandler}
        rightButtonText="Skip"
        hideBottomDivider
      >
        Edit Profile
      </FancyModalHeader>
      <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <Join separator={<Spacer py={1} />}>
          <Flex flexDirection="row" alignItems="center" px={2} mt={2}>
            <Touchable onPress={chooseImageHandler}>
              <Box
                height="99"
                width="99"
                mr={2}
                borderRadius="50"
                backgroundColor={color("black10")}
                justifyContent="center"
                alignItems="center"
              >
                {!!values.photo ? (
                  <Avatar src={values.photo} size="md" />
                ) : (
                  <Image source={require("../../../../images/profile_placeholder_avatar.webp")} />
                )}
              </Box>
            </Touchable>
            <Touchable haptic onPress={chooseImageHandler}>
              <Text style={{ textDecorationLine: "underline" }}>Choose an Image</Text>
            </Touchable>
          </Flex>
          <Flex m={2}>
            <Join separator={<Spacer py={2} />}>
              <Input
                ref={nameInputRef}
                title="Full Name"
                onChangeText={handleChange("name")}
                onBlur={() => validateForm()}
                error={errors.name}
                returnKeyType="next"
                defaultValue={values.name}
                onSubmitEditing={() => {
                  locationInputRef.current?.focus()
                }}
              />

              {!!enableCollectorProfile && (
                <DetailedLocationAutocomplete
                  locationInputRef={locationInputRef}
                  title="Primary Location"
                  placeholder="City Name"
                  returnKeyType="next"
                  initialLocation={values.displayLocation?.display!}
                  onFocus={() =>
                    requestAnimationFrame(() =>
                      scrollViewRef.current?.scrollTo({ y: PRIMARY_LOCATION_OFFSET })
                    )
                  }
                  onChange={({ city, country, postalCode, state, stateCode }) => {
                    setFieldValue("location", {
                      city: city ?? "",
                      country: country ?? "",
                      postalCode: postalCode ?? "",
                      state: state ?? "",
                      stateCode: stateCode ?? "",
                    })
                  }}
                />
              )}

              {!!enableCollectorProfile && (
                <Input
                  title="Profession"
                  onChangeText={handleChange("profession")}
                  onBlur={() => validateForm()}
                  error={errors.name}
                  returnKeyType="next"
                  defaultValue={values.profession}
                  placeholder="Select Your Profession"
                  onSubmitEditing={() => {
                    relevantPositionsInputRef.current?.focus()
                  }}
                />
              )}

              {!!enableCollectorProfile && (
                <Input
                  ref={relevantPositionsInputRef}
                  title="Other Relevant Positions"
                  onChangeText={handleChange("otherRelevantPositions")}
                  onBlur={() => validateForm()}
                  error={errors.name}
                  returnKeyType="next"
                  defaultValue={values.otherRelevantPositions}
                  placeholder="Institution Name and Position"
                  onSubmitEditing={() => {
                    bioInputRef.current?.focus()
                  }}
                />
              )}

              <Input
                ref={bioInputRef}
                title="About"
                onChangeText={(text) => {
                  handleChange("bio")(text.trim())
                }}
                onBlur={() => validateForm()}
                error={errors.bio}
                maxLength={150}
                multiline
                showLimit
                defaultValue={values.bio}
                placeholder="You can add a short bio to tell more about yourself and your collection. It can be anything like the artists you collect, the genres you're interested in , etc."
              />

              {!!enableCollectorProfile && (
                <ProfileVerifications
                  isIDVerified={!!me?.identityVerified}
                  canRequestEmailConfirmation={!!me?.canRequestEmailConfirmation}
                  emailConfirmed={!!me?.emailConfirmed}
                  handleEmailVerification={handleEmailVerification!}
                  handleIDVerification={handleIDVerification!}
                />
              )}

              <Button flex={1} disabled={!touched} onPress={handleSubmit} mb={2}>
                Save
              </Button>
            </Join>
          </Flex>
        </Join>
      </ScrollView>
      {!!showVerificationBannerForEmail && (
        <EmailVerificationBanner
          emailVerificationState={emailVerificationState!}
          resultText={`Email sent to ${me?.email ?? ""}`}
        />
      )}
      {!!showVerificationBannerForID && (
        <IDVerificationBanner
          iDVerificationState={iDVerificationState!}
          resultText={`ID verification link sent to ${me?.email ?? ""}.`}
        />
      )}
      <LoadingModal isVisible={loading} />
    </>
  )
}

const meFragment = graphql`
  fragment MyProfileEditForm_me on Me @refetchable(queryName: "MyProfileEditForm_meRefetch") {
    name
    profession
    otherRelevantPositions
    bio
    location {
      display
      city
      state
      country
    }
    icon {
      url(version: "thumbnail")
    }
    email
    emailConfirmed
    identityVerified
    canRequestEmailConfirmation
  }
`

const MyProfileEditFormScreenQuery = graphql`
  query MyProfileEditFormQuery {
    me {
      ...MyProfileEditForm_me
    }
  }
`

export const MyProfileEditFormScreen: React.FC = () => {
  return (
    <ArtsyKeyboardAvoidingView>
      <Suspense fallback={<LoadingSkeleton />}>
        <MyProfileEditForm />
      </Suspense>
    </ArtsyKeyboardAvoidingView>
  )
}

const LoadingSkeleton = () => {
  const enableCollectorProfile = useFeatureFlag("AREnableCollectorProfile")
  return (
    <ProvidePlaceholderContext>
      <Flex alignItems="center" mt={2}>
        <Text variant="md" mr={0.5}>
          Edit Profile
        </Text>
      </Flex>
      <Spacer mb={4} />
      <Flex flexDirection="row" pl={2} alignItems="center">
        <PlaceholderBox width={99} height={99} borderRadius={50} />
        <PlaceholderText width={100} height={20} marginTop={5} marginLeft={20} />
      </Flex>
      {[...Array(enableCollectorProfile ? 4 : 1)].map((_x, i) => (
        <Flex mt={30} key={i}>
          <Flex mx={20}>
            <PlaceholderText width={100} height={20} marginTop={5} />
            <PlaceholderBox height={50} marginTop={5} />
          </Flex>
        </Flex>
      ))}
      <Flex mt={30}>
        <Flex mx={20}>
          <PlaceholderText width={100} height={20} marginTop={5} />
          <PlaceholderBox height={100} marginTop={5} />
        </Flex>
      </Flex>
      <Spacer mb={2} />
      <PlaceholderBox height={50} marginTop={5} borderRadius={50} marginHorizontal={20} />
    </ProvidePlaceholderContext>
  )
}

const renderVerifiedRow = ({
  title,
  subtitle,
  iconSize,
}: {
  title: string
  subtitle: string
  iconSize: number
}) => {
  const color = useColor()
  return (
    <Flex flexDirection="row">
      <Flex mt="3px">
        <CheckCircleFillIcon height={iconSize} width={iconSize} fill="green100" />
      </Flex>
      <Flex ml={1}>
        <Text>{title}</Text>
        <Text color={color("black60")}>{subtitle}</Text>
      </Flex>
    </Flex>
  )
}

const ProfileVerifications = ({
  canRequestEmailConfirmation,
  emailConfirmed,
  handleEmailVerification,
  handleIDVerification,
  isIDVerified,
}: {
  canRequestEmailConfirmation: boolean
  emailConfirmed: boolean
  handleEmailVerification: () => void
  handleIDVerification: () => void
  isIDVerified: boolean
}) => {
  const color = useColor()
  const iconSize = ICON_SIZE * PixelRatio.getFontScale()

  return (
    <Flex testID="profile-verifications" pr={2}>
      {/* ID Verification */}
      {isIDVerified ? (
        renderVerifiedRow({
          title: "ID Verified",
          subtitle: "For details, see FAQs or contact verification@artsy.net",
          iconSize,
        })
      ) : (
        <Flex flexDirection="row">
          <Flex mt="3px">
            <CheckCircleIcon height={iconSize} width={iconSize} fill="black30" />
          </Flex>
          <Flex ml={1}>
            <Text
              onPress={() => {
                handleIDVerification()
              }}
              style={{ textDecorationLine: "underline" }}
            >
              Verify Your ID
            </Text>
            <Text color={color("black60")}>
              For details, see{" "}
              <Text
                style={{ textDecorationLine: "underline" }}
                onPress={() => navigate(`https://www.artsy.net/identity-verification-faq`)}
              >
                FAQs
              </Text>{" "}
              or contact{" "}
              <Text
                style={{ textDecorationLine: "underline" }}
                onPress={() => sendEmail("verification@artsy.net", { subject: "ID Verification" })}
              >
                verification@artsy.net
              </Text>
              .
            </Text>
          </Flex>
        </Flex>
      )}

      <Spacer height={30} />

      {/* Email Verification */}
      {emailConfirmed ? (
        renderVerifiedRow({
          title: "Email Address Verified",
          subtitle: "Description Text explaining Email verification for the Collector.",
          iconSize,
        })
      ) : (
        <Flex flexDirection="row">
          <Flex mt="3px">
            <CheckCircleIcon height={iconSize} width={iconSize} fill="black30" />
          </Flex>
          <Flex ml={1}>
            {canRequestEmailConfirmation ? (
              <Text
                style={{ textDecorationLine: "underline" }}
                onPress={() => {
                  handleEmailVerification()
                }}
                testID="verify-your-email"
              >
                Verify Your Email
              </Text>
            ) : (
              <Text
                style={{ textDecorationLine: "none" }}
                color="black60"
                testID="verify-your-email"
              >
                Verify Your Email
              </Text>
            )}

            {/* This text will be replaced in a separate ticket */}
            <Text color="black60">
              Secure your account and receive updates about your transactions on Artsy.
            </Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}

// This should be replaced by Palette v3 Toast which is not yet implemented
const EmailVerificationBanner = ({
  emailVerificationState,
  resultText,
}: {
  emailVerificationState: boolean | null
  resultText: string
}) => {
  const color = useColor()

  const renderContent = () => {
    return (
      <Flex flexDirection="row" width="100%" justifyContent="space-between" alignItems="center">
        <Text color={color("white100")} numberOfLines={2}>
          {emailVerificationState ? resultText : "Something went wrong, please try again"}
        </Text>
      </Flex>
    )
  }
  return (
    <Flex
      px={2}
      py={1}
      // Avoid system bottom navigation bar
      background={color("black100")}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      testID="email-verification-confirmation-banner"
    >
      {renderContent()}
    </Flex>
  )
}

// This should be replaced by Palette v3 Toast which is not yet implemented
const IDVerificationBanner = ({
  iDVerificationState,
  resultText,
}: {
  iDVerificationState: boolean | null
  resultText: string
}) => {
  const color = useColor()

  const renderContent = () => {
    return (
      <Flex flexDirection="row" width="100%" justifyContent="space-between" alignItems="center">
        <Text color={color("white100")} numberOfLines={2}>
          {iDVerificationState ? resultText : "Something went wrong, please try again"}
        </Text>
      </Flex>
    )
  }
  return (
    <Flex
      px={2}
      py={1}
      // Avoid system bottom navigation bar
      background={color("black100")}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      {renderContent()}
    </Flex>
  )
}
