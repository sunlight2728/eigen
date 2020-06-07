import * as Analytics from "@artsy/cohesion"
import { TappedEntityGroup } from "@artsy/cohesion"
import * as Sentry from "@sentry/react-native"
import { ArtworkRail_rail } from "__generated__/ArtworkRail_rail.graphql"

type ValidHomeDestination =
  | Analytics.OwnerType.auctions
  | Analytics.OwnerType.sale
  | Analytics.OwnerType.fair
  | Analytics.OwnerType.artwork
  | Analytics.OwnerType.worksForYou
  | Analytics.OwnerType.savesAndFollows
  | Analytics.OwnerType.gene

export default class HomeAnalytics {
  // Auction events

  static auctionHeaderTapEvent(): Analytics.TappedEntityGroup {
    return Analytics.tappedEntityGroup({
      contextModule: Analytics.ContextModule.auctionRail,
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerType: Analytics.OwnerType.auctions,
      moduleHeight: "double",
      type: "header",
    })
  }

  static auctionThumbnailTapEvent(
    id?: string,
    slug?: string,
    horizontalSlidePosition?: number
  ): Analytics.TappedEntityGroup {
    return Analytics.tappedEntityGroup({
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerId: id,
      destinationScreenOwnerSlug: slug,
      destinationScreenOwnerType: Analytics.OwnerType.sale,
      contextModule: Analytics.ContextModule.auctionRail,
      horizontalSlidePosition,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Fair events

  static fairThumbnailTapEvent(fairID?: string, fairSlug?: string, index?: number): Analytics.TappedEntityGroup {
    return Analytics.tappedEntityGroup({
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerId: fairID,
      destinationScreenOwnerSlug: fairSlug,
      destinationScreenOwnerType: Analytics.OwnerType.fair,
      contextModule: Analytics.ContextModule.fairRail,
      horizontalSlidePosition: index,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Artwork Events

  static artworkHeaderTapEvent(key: string | null): Analytics.TappedEntityGroup | null {
    const contextModule = HomeAnalytics.artworkRailContextModule(key)
    const destinationScreen = HomeAnalytics.artworkHeaderDestinationScreen(key)
    if (contextModule && destinationScreen) {
      return Analytics.tappedEntityGroup({
        contextScreenOwnerType: Analytics.OwnerType.home,
        destinationScreenOwnerType: destinationScreen,
        contextModule,
        moduleHeight: "double",
        type: "header",
      })
    } else {
      const eventData = {
        action: Analytics.ActionType.tappedArtworkGroup,
        destinationScreenOwnerType: destinationScreen ?? "unspecified",
        contextModule: contextModule ?? "unspecified",
        moduleHeight: "double",
        eventType: "header",
      }
      HomeAnalytics.logUntrackedEvent(eventData)
      return null
    }
  }

  static artworkThumbnailTapEvent(
    contextModule: Analytics.ContextModule,
    slug: string,
    index?: number,
    moduleHeight?: "single" | "double"
  ): Analytics.TappedEntityGroup {
    return Analytics.tappedEntityGroup({
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerType: Analytics.OwnerType.artwork,
      destinationScreenOwnerSlug: slug,
      contextModule,
      horizontalSlidePosition: index,
      moduleHeight: moduleHeight ?? "double",
      type: "thumbnail",
    })
  }

  static artworkThumbnailTapEventFromKey(
    key: string | null,
    slug: string,
    index?: number
  ): Analytics.TappedEntityGroup | null {
    const contextModule = HomeAnalytics.artworkRailContextModule(key)
    if (contextModule) {
      return HomeAnalytics.artworkThumbnailTapEvent(contextModule, slug, index)
    } else {
      const eventData = {
        action: Analytics.ActionType.tappedArtworkGroup,
        destinationScreenOwnerType: Analytics.OwnerType.artwork,
        slug,
        contextModule: contextModule ?? "unspecifed",
        horizontalSlidePosition: index,
        moduleHeight: "double",
        eventType: "thumbnail",
      }
      HomeAnalytics.logUntrackedEvent(eventData)
      return null
    }
  }

  // Artist Events

  static artistThumbnailTapEvent(
    key: string | null,
    id: string,
    slug: string,
    index?: number
  ): Analytics.TappedEntityGroup {
    return Analytics.tappedEntityGroup({
      contextModule: HomeAnalytics.artistRailContextModule(key),
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerType: Analytics.OwnerType.artist,
      destinationScreenOwnerId: id,
      destinationScreenOwnerSlug: slug,
      horizontalSlidePosition: index,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Collections events

  static collectionThumbnailTapEvent(slug?: string, index?: number): TappedEntityGroup {
    return Analytics.tappedEntityGroup({
      contextModule: Analytics.ContextModule.collectionRail,
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerType: Analytics.OwnerType.collection,
      destinationScreenOwnerSlug: slug,
      horizontalSlidePosition: index,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Helpers

  static artworkHeaderDestinationScreen(key: string | null): ValidHomeDestination | null {
    switch (key) {
      case "followed_artists":
        return Analytics.OwnerType.worksForYou
      case "saved_works":
        return Analytics.OwnerType.savesAndFollows
      case "recommended_works":
        return Analytics.OwnerType.worksForYou
      case "genes":
        return Analytics.OwnerType.gene
      default:
        return null
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

  static artistRailContextModule(key: string | null): Analytics.ContextModule {
    switch (key) {
      case "SUGGESTED":
        return Analytics.ContextModule.recommendedArtistsRail
      case "TRENDING":
        return Analytics.ContextModule.trendingArtistsRail
      case "POPULAR":
        return Analytics.ContextModule.popularArtistsRail
      default:
        return Analytics.ContextModule.recommendedArtistsRail
    }
  }

  static artworkRailContextModule(key: string | null): Analytics.ContextModule | undefined {
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
    }
  }

  // Error Reporting

  static logUntrackedEvent(eventData: any) {
    if (!__DEV__) {
      Sentry.withScope(scope => {
        scope.setExtra("eventData", eventData)
        Sentry.captureMessage("Untracked home rail")
      })
    }
  }
}
