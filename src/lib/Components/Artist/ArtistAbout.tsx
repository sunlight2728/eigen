import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import RelatedArtists from "../RelatedArtists/RelatedArtists"
import Articles from "./Articles"
import Biography from "./Biography"

import { ArtistAbout_artist } from "__generated__/ArtistAbout_artist.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { CaretButton } from "../Buttons/CaretButton"
import { Stack } from "../Stack"
import { StickyTabPageScrollView } from "../StickyTabPage/StickyTabPageScrollView"
import { ArtistConsignButtonFragmentContainer as ArtistConsignButton } from "./ArtistConsignButton"

interface Props {
  artist: ArtistAbout_artist
}

class ArtistAbout extends React.Component<Props> {
  render() {
    return (
      <StickyTabPageScrollView>
        <Stack spacing={3} my={2}>
          {!!this.props.artist.has_metadata && <Biography artist={this.props.artist as any} />}
          {!!this.props.artist.is_display_auction_link && (
            <CaretButton
              text="Auction results"
              onPress={() =>
                SwitchBoard.presentNavigationViewController(this, `/artist/${this.props.artist.slug}/auction-results`)
              }
            />
          )}
          <ArtistConsignButton artist={this.props.artist} />
          {!!this.props.artist.articles?.edges?.length && (
            <Articles articles={this.props.artist.articles.edges.map(edge => edge?.node!)} />
          )}
          {!!this.props.artist.related?.artists?.edges?.length && (
            <RelatedArtists artists={this.props.artist.related.artists.edges.map(edge => edge?.node!)} />
          )}
        </Stack>
      </StickyTabPageScrollView>
    )
  }
}

export default createFragmentContainer(ArtistAbout, {
  artist: graphql`
    fragment ArtistAbout_artist on Artist {
      has_metadata: hasMetadata
      is_display_auction_link: isDisplayAuctionLink
      slug
      ...Biography_artist
      ...ArtistConsignButton_artist
      related {
        artists: artistsConnection(first: 16) {
          edges {
            node {
              ...RelatedArtists_artists
            }
          }
        }
      }
      articles: articlesConnection(first: 10) {
        edges {
          node {
            ...Articles_articles
          }
        }
      }
    }
  `,
})
