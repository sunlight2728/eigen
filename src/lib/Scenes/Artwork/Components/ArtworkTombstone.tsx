import { Box, Flex, Serif, Spacer } from "@artsy/palette"
import { ArtworkTombstone_artwork } from "__generated__/ArtworkTombstone_artwork.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { NativeModules, Text, TouchableWithoutFeedback } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { FollowArtistButtonFragmentContainer as FollowArtistButton } from "./FollowArtistButton"

const Constants = NativeModules.ARCocoaConstantsModule

type Artist = NonNullable<NonNullable<ArtworkTombstone_artwork["artists"]>[0]>

export interface ArtworkTombstoneProps {
  artwork: ArtworkTombstone_artwork
}

export interface ArtworkTombstoneState {
  showingMoreArtists: boolean
}

@track()
export class ArtworkTombstone extends React.Component<ArtworkTombstoneProps, ArtworkTombstoneState> {
  state = {
    showingMoreArtists: false,
  }

  @track(() => ({
    action_name: Schema.ActionNames.ArtistName,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkTombstone,
  }))
  handleArtistTap(href: string) {
    SwitchBoard.presentNavigationViewController(this, href)
  }

  @track(() => ({
    action_name: Schema.ActionNames.ArtworkClassification,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.ArtworkTombstone,
  }))
  handleClassificationTap(href: string) {
    SwitchBoard.presentNavigationViewController(this, href)
  }

  showAttributionClassFAQ() {
    SwitchBoard.presentNavigationViewController(this, "/artwork-classifications")
  }

  showMoreArtists = () => {
    this.setState({
      showingMoreArtists: !this.state.showingMoreArtists,
    })
  }

  renderSingleArtist(artist: Artist) {
    return (
      <React.Fragment>
        <Text>
          {this.renderArtistName(
            // @ts-ignore STRICTNESS_MIGRATION
            artist.name,
            artist.href
          )}
          <Serif size="4t" weight="semibold">
            {"  "}·{"  "}
          </Serif>
          <FollowArtistButton artist={artist} contextModule={Schema.ContextModules.ArtworkTombstone} />
        </Text>
      </React.Fragment>
    )
  }

  renderArtistName(artistName: string, href: string) {
    return href ? (
      <TouchableWithoutFeedback onPress={this.handleArtistTap.bind(this, href)}>
        <Serif size="4t" weight="semibold">
          {artistName}
        </Serif>
      </TouchableWithoutFeedback>
    ) : (
      <Serif size="4t" weight="semibold">
        {artistName}
      </Serif>
    )
  }

  renderMultipleArtists = () => {
    const {
      artwork: { artists },
    } = this.props

    // @ts-ignore STRICTNESS_MIGRATION
    const truncatedArtists = !this.state.showingMoreArtists ? artists.slice(0, 3) : artists
    // @ts-ignore STRICTNESS_MIGRATION
    const artistNames = truncatedArtists.map((artist, index) => {
      // @ts-ignore STRICTNESS_MIGRATION
      const artistNameWithComma = index !== artists.length - 1 ? artist.name + ", " : artist.name
      return (
        // @ts-ignore STRICTNESS_MIGRATION
        <React.Fragment key={artist.href}>{this.renderArtistName(artistNameWithComma, artist.href)}</React.Fragment>
      )
    })

    return (
      <Flex flexDirection="row" flexWrap="wrap">
        <Serif size="4t">
          {artistNames}
          {!this.state.showingMoreArtists && artists! /* STRICTNESS_MIGRATION */.length > 3 && (
            <TouchableWithoutFeedback onPress={this.showMoreArtists}>
              <Serif size="4t" weight="semibold">
                {artists! /* STRICTNESS_MIGRATION */.length - 3} more
              </Serif>
            </TouchableWithoutFeedback>
          )}
        </Serif>
      </Flex>
    )
  }

  render() {
    const { artwork } = this.props
    const addedComma = artwork.date ? ", " : ""
    const displayAuctionLotLabel =
      artwork.isInAuction &&
      artwork.saleArtwork &&
      artwork.saleArtwork.lotLabel &&
      artwork.sale &&
      !artwork.sale.isClosed

    return (
      <Box textAlign="left">
        <Flex flexDirection="row" flexWrap="wrap">
          {artwork.artists! /* STRICTNESS_MIGRATION */.length === 1
            ? this.renderSingleArtist(
                // @ts-ignore STRICTNESS_MIGRATION
                artwork.artists[0]
              )
            : this.renderMultipleArtists()}
          {!!(artwork.artists! /* STRICTNESS_MIGRATION */.length === 0 &&
            artwork.cultural_maker) &&
            // @ts-ignore STRICTNESS_MIGRATION
            this.renderArtistName(artwork.cultural_maker, null)}
        </Flex>
        <Spacer mb={1} />
        {!!displayAuctionLotLabel && (
          <Serif color="black100" size="3t" weight="semibold">
            Lot{" "}
            {
              // @ts-ignore STRICTNESS_MIGRATION
              artwork.saleArtwork.lotLabel
            }
          </Serif>
        )}
        <Flex flexDirection="row" flexWrap="wrap">
          <Serif size="3t">
            <Serif italic color="black60" size="3t">
              {artwork.title + addedComma}
            </Serif>
            {!!artwork.date && (
              <Serif color="black60" size="3t">
                {artwork.date}
              </Serif>
            )}
          </Serif>
        </Flex>
        {!!artwork.medium && (
          <Serif color="black60" size="3t">
            {artwork.medium}
          </Serif>
        )}
        {!!artwork.dimensions! /* STRICTNESS_MIGRATION */.in && !!artwork.dimensions! /* STRICTNESS_MIGRATION */.cm && (
          <Serif color="black60" size="3t">
            {Constants.CurrentLocale === "en_US"
              ? artwork.dimensions! /* STRICTNESS_MIGRATION */.in
              : artwork.dimensions! /* STRICTNESS_MIGRATION */.cm}
          </Serif>
        )}
        {!!artwork.edition_of && (
          <Serif color="black60" size="3t">
            {artwork.edition_of}
          </Serif>
        )}
        {!!artwork.attribution_class && (
          <Serif color="black60" size="3t" mt={1}>
            <TouchableWithoutFeedback onPress={() => this.handleClassificationTap("/artwork-classifications")}>
              <Text style={{ textDecorationLine: "underline" }}>{artwork.attribution_class.shortDescription}</Text>
            </TouchableWithoutFeedback>
            .
          </Serif>
        )}
        {!!artwork.isInAuction && !!artwork.sale && !artwork.sale.isClosed && (
          <>
            <Spacer mb={1} />
            {!!artwork.partner && (
              <Serif color="black100" size="3t" weight="semibold">
                {artwork.partner.name}
              </Serif>
            )}
            {!!artwork.saleArtwork && !!artwork.saleArtwork.estimate && (
              <Serif size="3t" color="black60">
                Estimated value: {artwork.saleArtwork.estimate}
              </Serif>
            )}
          </>
        )}
      </Box>
    )
  }
}

export const ArtworkTombstoneFragmentContainer = createFragmentContainer(ArtworkTombstone, {
  artwork: graphql`
    fragment ArtworkTombstone_artwork on Artwork {
      title
      isInAuction
      medium
      date
      cultural_maker: culturalMaker
      saleArtwork {
        lotLabel
        estimate
      }
      partner {
        name
      }
      sale {
        isClosed
      }
      artists {
        name
        href
        ...FollowArtistButton_artist
      }
      dimensions {
        in
        cm
      }
      edition_of: editionOf
      attribution_class: attributionClass {
        shortDescription
      }
    }
  `,
})
