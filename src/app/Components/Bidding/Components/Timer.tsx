import { StateManager as CountdownStateManager } from "app/Components/Countdown"
import { CountdownTimerProps } from "app/Components/Countdown/CountdownTimer"
import { ModernTicker, SimpleTicker } from "app/Components/Countdown/Ticker"
import { useFeatureFlag } from "app/store/GlobalStore"
import moment from "moment-timezone"
import { Flex, Sans, Spacer, Text } from "palette"
import PropTypes from "prop-types"
import React from "react"
import { ArtworkAuctionProgressBar } from "./ArtworkAuctionProgressBar"

// Possible states for an auction:
// - PREVIEW: Auction is open for registration but artworks cannot be bid on. This occurs when the current time is before any auction's startAt.
// - CLOSING: Timed auction has started
// - LIVE_INTEGRATION_UPCOMING: Auction is open for pre-bidding, live portion has not started
// - LIVE_INTEGRATION_ONGOING: Live auction is in progress
// - CLOSED: Auction is over
export enum AuctionTimerState {
  PREVIEW = "PREVIEW",
  LIVE_INTEGRATION_UPCOMING = "LIVE_INTEGRATION_UPCOMING",
  LIVE_INTEGRATION_ONGOING = "LIVE_INTEGRATION_ONGOING",
  CLOSING = "CLOSING",
  CLOSED = "CLOSED",
  EXTENDED = "EXTENDED",
}

interface Props {
  liveStartsAt?: string
  endsAt?: string
  isPreview?: boolean
  isClosed?: boolean
  startsAt?: string
  extendedBiddingEndAt?: string | null
}
function formatDate(date: string) {
  const dateInMoment = moment(date, moment.ISO_8601).tz(moment.tz.guess(true))
  const format = dateInMoment.minutes() === 0 ? "MMM D, h A z" : "MMM D, h:mm A z"

  return dateInMoment.format(format)
}

export function relevantStateData(
  currentState: AuctionTimerState,
  { liveStartsAt, startsAt, endsAt, extendedBiddingEndAt }: Props
) {
  switch (currentState) {
    case AuctionTimerState.PREVIEW: {
      if (!startsAt) {
        console.error("startsAt is required when isPreview is true")
      }
      return {
        date: startsAt,
        label: startsAt ? `Starts ${formatDate(startsAt)}` : "",
        hasStarted: false,
      }
    }
    case AuctionTimerState.LIVE_INTEGRATION_UPCOMING: {
      return { date: liveStartsAt, label: liveStartsAt ? `Live ${formatDate(liveStartsAt)}` : "" }
    }
    case AuctionTimerState.LIVE_INTEGRATION_ONGOING: {
      return { date: null, label: "In progress" }
    }
    case AuctionTimerState.CLOSING: {
      return { date: endsAt, label: endsAt ? `Closes ${formatDate(endsAt)}` : "", hasStarted: true }
    }
    case AuctionTimerState.EXTENDED: {
      const endTime = extendedBiddingEndAt || endsAt
      return {
        date: endTime,
        label: endTime ? `Closes ${formatDate(endTime)}` : "",
        hasStarted: true,
      }
    }
    default: {
      return { date: null, label: "Bidding closed" }
    }
  }
}

export function nextTimerState(currentState: AuctionTimerState, { liveStartsAt }: Props) {
  switch (currentState) {
    case AuctionTimerState.PREVIEW: {
      if (liveStartsAt) {
        return AuctionTimerState.LIVE_INTEGRATION_UPCOMING
      } else {
        return AuctionTimerState.CLOSING
      }
    }
    case AuctionTimerState.CLOSED: {
      return AuctionTimerState.CLOSED
    }
    case AuctionTimerState.LIVE_INTEGRATION_UPCOMING: {
      return AuctionTimerState.LIVE_INTEGRATION_ONGOING
    }
    case AuctionTimerState.LIVE_INTEGRATION_ONGOING: {
      return AuctionTimerState.LIVE_INTEGRATION_ONGOING
    }
    case AuctionTimerState.EXTENDED: {
      return AuctionTimerState.CLOSED
    }
    case AuctionTimerState.CLOSING: {
      return AuctionTimerState.CLOSED
    }
    default: {
      return AuctionTimerState.CLOSED
    }
  }
}

export function currentTimerState({
  isPreview,
  isClosed,
  liveStartsAt,
  extendedBiddingEndAt,
}: Props) {
  if (isPreview) {
    return AuctionTimerState.PREVIEW
  } else if (!!extendedBiddingEndAt && moment().isBefore(extendedBiddingEndAt)) {
    return AuctionTimerState.EXTENDED
  } else if (isClosed) {
    return AuctionTimerState.CLOSED
  } else if (liveStartsAt) {
    const isLiveOpen = moment().isAfter(liveStartsAt)
    if (isLiveOpen) {
      return AuctionTimerState.LIVE_INTEGRATION_ONGOING
    } else {
      return AuctionTimerState.LIVE_INTEGRATION_UPCOMING
    }
  } else {
    return AuctionTimerState.CLOSING
  }
}

export interface CountdownProps extends CountdownTimerProps {
  hasStarted?: boolean
  hasBeenExtended: boolean
  cascadingEndTimeIntervalMinutes?: number | null
  extendedBiddingIntervalMinutes?: number | null
  extendedBiddingPeriodMinutes?: number | null
  biddingEndAt?: string | null
  startAt?: string | null
}

export const Countdown: React.FC<CountdownProps> = ({
  duration,
  label,
  hasStarted,
  hasBeenExtended,
  startAt,
  cascadingEndTimeIntervalMinutes,
  extendedBiddingIntervalMinutes,
  extendedBiddingPeriodMinutes,
  biddingEndAt,
}) => {
  const cascadingEndTimeFeatureEnabled = useFeatureFlag("AREnableCascadingEndTimerLotPage")

  return (
    <Flex alignItems="center">
      {cascadingEndTimeFeatureEnabled && cascadingEndTimeIntervalMinutes ? (
        <ModernTicker duration={duration} hasStarted={hasStarted} isExtended={hasBeenExtended} />
      ) : (
        <SimpleTicker duration={duration} separator="  " size="4t" weight="medium" />
      )}
      {!!extendedBiddingPeriodMinutes && !!extendedBiddingIntervalMinutes && (
        <ArtworkAuctionProgressBar
          startAt={startAt}
          extendedBiddingPeriodMinutes={extendedBiddingPeriodMinutes}
          extendedBiddingIntervalMinutes={extendedBiddingIntervalMinutes}
          biddingEndAt={biddingEndAt}
          hasBeenExtended={hasBeenExtended}
        />
      )}
      <Sans size="2" weight="medium" color="black60">
        {label}
      </Sans>
      {!!extendedBiddingPeriodMinutes && (
        <>
          <Spacer mt={1} />
          <Text variant="xs" color="black60" textAlign="center">
            *Closure times may be extended to accomodate last minute bids
          </Text>
        </>
      )}
    </Flex>
  )
}

interface TimeOffsetProviderProps {
  children: React.ReactElement<any>
}

export class TimeOffsetProvider extends React.Component<TimeOffsetProviderProps> {
  static contextTypes = {
    timeOffsetInMilliSeconds: PropTypes.number,
  }

  render() {
    return React.cloneElement(this.props.children, this.context || {})
  }
}

export const Timer: React.FC<Props> = (props) => {
  return (
    <TimeOffsetProvider>
      <CountdownStateManager
        CountdownComponent={Countdown}
        onCurrentTickerState={() => {
          const state = currentTimerState(props)
          const { label, date } = relevantStateData(state, props)
          return { label, date, state } as any // STRICTNESS_MIGRATION
        }}
        onNextTickerState={({ state }) => {
          const nextState = nextTimerState(state as AuctionTimerState, props)
          const { label, date } = relevantStateData(nextState, props)
          return { state: nextState, label, date } as any // STRICTNESS_MIGRATION
        }}
      />
    </TimeOffsetProvider>
  )
}
