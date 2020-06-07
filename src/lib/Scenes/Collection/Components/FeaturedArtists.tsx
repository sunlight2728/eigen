import { Box, Flex, Sans } from "@artsy/palette"
import { FeaturedArtists_collection } from "__generated__/FeaturedArtists_collection.graphql"
import { ArtistListItemContainer as ArtistListItem } from "lib/Components/ArtistListItem"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, Track, track as _track } from "lib/utils/track"
import { ContextModules } from "lib/utils/track/schema"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { TrackingProp } from "react-tracking"
import styled from "styled-components/native"

interface FeaturedArtistsProps {
  collection: FeaturedArtists_collection
  tracking?: TrackingProp
}

// @ts-ignore STRICTNESS_MIGRATION
const track: Track<FeaturedArtistsProps, {}> = _track

@track()
export class FeaturedArtists extends React.Component<FeaturedArtistsProps, {}> {
  handleTap = (context: any, href: string) => {
    SwitchBoard.presentNavigationViewController(context, href)
  }

  getFeaturedArtistEntityCollection = (
    // @ts-ignore STRICTNESS_MIGRATION
    artists: FeaturedArtists_collection["artworksConnection"]["merchandisableArtists"]
  ) => {
    // @ts-ignore STRICTNESS_MIGRATION
    return artists.map(artist => {
      return (
        <Box width="100%" key={artist.internalID} pb={20}>
          <ArtistListItem artist={artist} contextModule={ContextModules.FeaturedArtists} />
        </Box>
      )
    })
  }

  getFeaturedArtists = () => {
    const allArtists = this.props.collection?.artworksConnection?.merchandisableArtists || []
    const featuredArtistExclusionIds = this.props.collection?.featuredArtistExclusionIds || []
    const artistIDs = this.props.collection?.query?.artistIDs || []

    if (artistIDs.length > 0) {
      // @ts-ignore STRICTNESS_MIGRATION
      return allArtists.filter(artist => artistIDs.includes(artist.internalID))
    }

    if (featuredArtistExclusionIds.length > 0) {
      // @ts-ignore STRICTNESS_MIGRATION
      return allArtists.filter(artist => !featuredArtistExclusionIds.includes(artist.internalID))
    }
    return allArtists
  }

  render() {
    const artists = this.getFeaturedArtists()
    if (artists.length <= 0) {
      return null
    }

    const hasMultipleArtists = artists.length > 1

    const artistCount = 3
    const truncatedArtists = this.getFeaturedArtistEntityCollection(artists).slice(0, artistCount)
    const headlineLabel = "Featured Artist" + (hasMultipleArtists ? "s" : "")
    const { tracking } = this.props

    return (
      <Box pb={1}>
        <Flex justifyContent="space-between" pb={15} flexDirection="row">
          <Sans size="4">{headlineLabel}</Sans>
          {artists.length > artistCount && (
            <TouchableOpacity
              onPress={() => {
                SwitchBoard.presentNavigationViewController(this, `/collection/${this.props.collection.slug}/artists`)
                // @ts-ignore STRICTNESS_MIGRATION
                tracking.trackEvent({
                  action_type: Schema.ActionTypes.Tap,
                  action_name: Schema.ActionNames.ViewMore,
                  context_screen: Schema.PageNames.Collection,
                  context_module: Schema.ContextModules.FeaturedArtists,
                  flow: Schema.Flow.FeaturedArtists,
                })
              }}
            >
              <ViewAll size="4" color="black60">
                View all
              </ViewAll>
            </TouchableOpacity>
          )}
        </Flex>
        <Flex flexWrap="wrap">{truncatedArtists}</Flex>
      </Box>
    )
  }
}

export const CollectionFeaturedArtistsContainer = createFragmentContainer(FeaturedArtists, {
  collection: graphql`
    fragment FeaturedArtists_collection on MarketingCollection {
      slug
      artworksConnection(aggregations: [MERCHANDISABLE_ARTISTS], size: 0, sort: "-decayed_merch") {
        merchandisableArtists(size: 4) {
          internalID
          ...ArtistListItem_artist
        }
      }
      query {
        artistIDs
      }
      featuredArtistExclusionIds
    }
  `,
})

export const ViewAll = styled(Sans)`
  text-align: center;
`
