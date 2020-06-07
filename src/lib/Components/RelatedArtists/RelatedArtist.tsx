import { color, Sans, Spacer } from "@artsy/palette"
import { RelatedArtist_artist } from "__generated__/RelatedArtist_artist.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { Component } from "react"
import { TouchableWithoutFeedback, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import ImageView from "../OpaqueImageView/OpaqueImageView"

interface Props {
  artist: RelatedArtist_artist
  imageSize: {
    width: number
  }
}

class RelatedArtist extends Component<Props> {
  handleTap() {
    // @ts-ignore STRICTNESS_MIGRATION
    SwitchBoard.presentNavigationViewController(this, this.props.artist.href)
  }

  render() {
    const artist = this.props.artist
    const imageURL = artist.image && artist.image.url

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View style={{ width: this.props.imageSize.width }}>
          <ImageView style={[this.props.imageSize, { overflow: "hidden", borderRadius: 2 }]} imageURL={imageURL} />
          <Spacer mb={1} />
          <Sans size="3t" weight="medium">
            {artist.name}
          </Sans>
          <Sans size="3t" color={color("black60")}>
            {this.artworksString(artist.counts)}
          </Sans>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  artworksString(counts: RelatedArtist_artist["counts"]) {
    // @ts-ignore STRICTNESS_MIGRATION
    const totalWorks = counts.artworks ? counts.artworks + (counts.artworks > 1 ? " works" : " work") : null
    // @ts-ignore STRICTNESS_MIGRATION
    if (totalWorks && counts.forSaleArtworks === counts.artworks) {
      return totalWorks + " for sale"
    }

    // @ts-ignore STRICTNESS_MIGRATION
    const forSale = counts.forSaleArtworks ? counts.forSaleArtworks + " for sale" : null
    if (forSale && totalWorks) {
      return totalWorks + ", " + forSale
    }
    return forSale ? forSale : totalWorks
  }
}

export default createFragmentContainer(RelatedArtist, {
  artist: graphql`
    fragment RelatedArtist_artist on Artist {
      href
      name
      counts {
        forSaleArtworks
        artworks
      }
      image {
        url(version: "large")
      }
    }
  `,
})
