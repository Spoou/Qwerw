import { navigate } from "lib/navigation/navigate"
import { GlobalStore } from "lib/store/GlobalStore"
import { useCallback, useEffect, useRef } from "react"
import { Linking } from "react-native"
import { useTracking } from "react-tracking"

export function useDeepLinks() {
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const launchURL = useRef<string | null>(null)

  const { trackEvent } = useTracking()

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url)
      }
    })
  }, [])

  useEffect(() => {
    Linking.addEventListener("url", ({ url }) => handleDeepLink(url))
    return () => {
      Linking.removeAllListeners("url")
    }
  }, [])

  const handleDeepLink = useCallback(
    (url: string) => {
      trackEvent(tracks.deepLink(url))

      // If the state is hydrated and the user is logged in
      // We navigate them to the the deep link
      if (isHydrated && isLoggedIn) {
        navigate(url)
      }

      // Otherwise, we save the deep link url
      // to redirect them to the login screen once they log in
      launchURL.current = url
    },
    [isHydrated, isLoggedIn]
  )

  useEffect(() => {
    if (isLoggedIn && launchURL.current) {
      trackEvent(tracks.deepLink(launchURL.current))
      // Navigate to the saved launch url
      navigate(launchURL.current)
      // Reset the launchURL
      launchURL.current = null
    }
  }, [isLoggedIn, launchURL.current])
}

const tracks = {
  deepLink: (url: string) => ({
    name: "Deep link opened",
    link: url,
    referrer: "unknown",
  }),
}
