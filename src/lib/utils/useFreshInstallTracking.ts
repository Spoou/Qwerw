import { getCurrentEmissionState } from "lib/store/GlobalStore"
import { useEffect } from "react"
import { AnalyticsConstants } from "./track/constants"
import { SegmentTrackingProvider } from "./track/SegmentTrackingProvider"

export const useFreshInstallTracking = () => {
  useEffect(() => {
    const launchCount = getCurrentEmissionState().launchCount
    if (launchCount > 1) {
      return
    }
    SegmentTrackingProvider.postEvent({ name: AnalyticsConstants.FreshInstall })
  }, [])
}
