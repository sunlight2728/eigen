import * as Analytics from "@artsy/cohesion"
import { Spacer } from "@artsy/palette"
import { SmallTileRail_artworks } from "__generated__/SmallTileRail_artworks.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { saleMessageOrBidInfo } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import HomeAnalytics from "../homeAnalytics"

export const SmallTileRailContainer: React.FC<{
  artworks: SmallTileRail_artworks
  listRef: React.MutableRefObject<FlatList<any> | undefined>
  contextModule: Analytics.ContextModule | undefined
}> = ({ artworks, listRef, contextModule }) => {
  const tracking = useTracking()
  return (
    <AboveTheFoldFlatList
      listRef={listRef}
      horizontal
      ListHeaderComponent={() => <Spacer mr={2}></Spacer>}
      ListFooterComponent={() => <Spacer mr={2}></Spacer>}
      ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
      showsHorizontalScrollIndicator={false}
      data={artworks}
      initialNumToRender={4}
      windowSize={3}
      renderItem={({ item, index }) => (
        <ArtworkTileRailCard
          onPress={
            item.href
              ? () => {
                  if (contextModule) {
                    tracking.trackEvent(
                      HomeAnalytics.artworkThumbnailTapEvent(contextModule, item.slug, index, "single")
                    )
                  }
                  SwitchBoard.presentNavigationViewController(listRef.current!, item.href!)
                }
              : undefined
          }
          imageURL={item.image?.imageURL ?? ""}
          artistNames={item.artistNames}
          saleMessage={saleMessageOrBidInfo(item)}
        />
      )}
      keyExtractor={(item, index) => String(item.image?.imageURL || index)}
    />
  )
}

export const SmallTileRail = createFragmentContainer(SmallTileRailContainer, {
  artworks: graphql`
    fragment SmallTileRail_artworks on Artwork @relay(plural: true) {
      href
      saleMessage
      artistNames
      slug
      internalID
      sale {
        isAuction
        isClosed
        displayTimelyAt
      }
      saleArtwork {
        currentBid {
          display
        }
      }
      partner {
        name
      }
      image {
        imageURL
      }
    }
  `,
})
