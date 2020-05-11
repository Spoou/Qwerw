import * as Analytics from "@artsy/cohesion"
import { ArtworkRail_rail } from "__generated__/ArtworkRail_rail.graphql"
import { Schema } from "lib/utils/track"

export enum HomeActionType {
  Header = "header",
  Thumbnail = "thumbnail",
  Follow = "follow",
}

export interface HomeEvent {
  action_name: string
  context_module: string
  context_screen_owner_type: string
  destination_screen: string
  destination_screen_owner_id?: string
  destination_screen_owner_slug?: string
  type: string
}

export default class HomeAnalytics {
  static auctionHeaderTapEvent(): HomeEvent {
    const auctionHeaderTapEvent = {
      action_name: Analytics.ActionType.tappedAuctionGroup,
      context_module: Analytics.ContextModule.auctionRail,
      context_screen_owner_type: Schema.PageNames.Home,
      destination_screen: Schema.PageNames.Auctions,
      type: HomeActionType.Header,
    }
    return auctionHeaderTapEvent
  }

  static auctionThumbnailTapEvent(auctionID: string | "unspecified", auctionSlug: string | "unspecified"): HomeEvent {
    const auctionThumbnailTapEvent = {
      action_name: Analytics.ActionType.tappedAuctionGroup,
      context_module: Analytics.ContextModule.auctionRail,
      context_screen_owner_type: Schema.PageNames.Home,
      destination_screen: Schema.PageNames.Auction,
      destination_screen_owner_id: auctionID,
      destination_screen_owner_slug: auctionSlug,
      type: HomeActionType.Thumbnail,
    }
    return auctionThumbnailTapEvent
  }

  static fairThumbnailTapEvent(fairID: string | "unspecified", fairSlug: string | "unspecified"): HomeEvent {
    const fairThumbnailTapEvent = {
      action_name: Analytics.ActionType.tappedFairGroup,
      context_module: Analytics.ContextModule.fairRail,
      context_screen_owner_type: Schema.PageNames.Home,
      destination_screen: Schema.PageNames.FairPage,
      destination_screen_owner_id: fairID,
      destination_screen_owner_slug: fairSlug,
      type: HomeActionType.Thumbnail,
    }
    return fairThumbnailTapEvent
  }

  static artistThumbnailTapEvent(key: string, artistID: string, artistSlug: string): HomeEvent {
    const artistThumbnailTapEvent = {
      action_name: Analytics.ActionType.tappedArtistGroup,
      context_module: HomeAnalytics.artistRailContextModule(key),
      context_screen_owner_type: Schema.PageNames.Home,
      destination_screen_owner_slug: artistSlug,
      destination_screen_owner_id: artistID,
      destination_screen: Schema.PageNames.ArtistPage,
      type: HomeActionType.Thumbnail,
    }
    return artistThumbnailTapEvent
  }

  static artistFollowTapEvent(key: string, artistID: string, artistSlug: string): HomeEvent {
    const artistFollowTapEvent = {
      action_name: Analytics.ActionType.tappedArtistGroup,
      context_module: HomeAnalytics.artistRailContextModule(key),
      context_screen_owner_type: Schema.PageNames.Home,
      destination_screen_owner_slug: artistSlug,
      destination_screen_owner_id: artistID,
      destination_screen: Schema.PageNames.ArtistPage,
      type: HomeActionType.Follow,
    }
    return artistFollowTapEvent
  }

  static artworkHeaderTapEvent(rail: ArtworkRail_rail): HomeEvent {
    const artworkHeaderTapEvent = {
      action_name: Analytics.ActionType.tappedArtworkGroup,
      context_module: HomeAnalytics.artworkRailContextModule(rail),
      context_screen_owner_type: Schema.PageNames.Home,
      destination_screen_owner_slug: HomeAnalytics.destinationScreenSlug(rail) ?? "unspecified",
      destination_screen: HomeAnalytics.destinationScreen(rail),
      type: HomeActionType.Header,
    }
    return artworkHeaderTapEvent
  }

  static artworkThumbnailTapEvent(contextModule: Analytics.ContextModule | "untracked_rail", slug: string): HomeEvent {
    const artworkThumbNailTapEvent = {
      action_name: Analytics.ActionType.tappedArtworkGroup,
      context_module: contextModule,
      context_screen_owner_type: Schema.PageNames.Home,
      destination_screen_owner_slug: slug,
      destination_screen: Schema.PageNames.ArtworkPage,
      type: HomeActionType.Thumbnail,
    }
    return artworkThumbNailTapEvent
  }

  static artworkThumbnailTapEventFromRail(rail: ArtworkRail_rail, slug: string): HomeEvent {
    const contextModule = HomeAnalytics.artworkRailContextModule(rail)
    return HomeAnalytics.artworkThumbnailTapEvent(contextModule, slug)
  }

  static destinationScreen(rail: ArtworkRail_rail): Schema.PageNames | "untracked_page" {
    const key = rail.key
    switch (key) {
      case "followed_artists":
        return Schema.PageNames.WorksForYou
      case "saved_works":
        return Schema.PageNames.SavesAndFollows
      case "recommended_works":
        return Schema.PageNames.WorksForYou
      case "genes":
        return Schema.PageNames.GenePage
      default:
        return "untracked_page"
    }
  }

  static destinationScreenSlug(rail: ArtworkRail_rail): string | undefined {
    const context = rail.context
    const key = rail.key
    switch (key) {
      case "followed_artist":
      case "related_artists":
        return context?.artist?.href ?? undefined
      case "genes":
      case "current_fairs":
      case "live_auctions":
        return context?.href ?? undefined
      default:
        return undefined
    }
  }

  static artistRailContextModule(key: string): Analytics.ContextModule | "untracked_rail" {
    switch (key) {
      case "SUGGESTED":
        return Analytics.ContextModule.recommendedArtistsRail
      case "TRENDING":
        return Analytics.ContextModule.trendingArtistsRail
      case "POPULAR":
        return Analytics.ContextModule.popularArtistsRail
      default:
        return "untracked_rail"
    }
  }

  static artworkRailContextModule(rail: ArtworkRail_rail): Analytics.ContextModule | "untracked_rail" {
    const key = rail.key
    switch (key) {
      case "followed_artists":
        return Analytics.ContextModule.newWorksByArtistsYouFollowRail
      case "recently_viewed_works":
        return Analytics.ContextModule.recentlyViewedRail
      case "saved_works":
        return Analytics.ContextModule.recentlySavedRail
      case "similar_to_saved_works":
        return Analytics.ContextModule.similarToWorksYouSavedRail
      case "similar_to_recently_viewed":
        return Analytics.ContextModule.similarToWorksYouViewedRail
      case "recommended_works":
        return Analytics.ContextModule.recommendedWorksForYouRail
      case "genes":
        return Analytics.ContextModule.categoryRail
      default:
        return "untracked_rail"
    }
  }
}
