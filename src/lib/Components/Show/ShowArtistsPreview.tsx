import { Serif, Spacer } from "@artsy/palette"
import { ShowArtistsPreview_show } from "__generated__/ShowArtistsPreview_show.graphql"
import { ArtistListItemContainer as ArtistListItem } from "lib/Components/ArtistListItem"
import { CaretButton } from "lib/Components/Buttons/CaretButton"
import Switchboard from "lib/NativeModules/SwitchBoard"
import { get } from "lib/utils/get"
import { Schema, Track, track as _track } from "lib/utils/track"
import { take } from "lodash"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  show: ShowArtistsPreview_show
  onViewAllArtistsPressed: () => void
  Component?: any
}

const track: Track<Props> = _track

@track()
export class ShowArtistsPreview extends React.Component<Props> {
  @track((_props, _state, args) => {
    const [, id, internalID] = args
    return {
      action_name: Schema.ActionNames.ArtistName,
      action_type: Schema.ActionTypes.Tap,
      owner_id: internalID,
      owner_slug: id,
      owner_type: Schema.OwnerEntityTypes.Artist,
    } as any
  })
  handlePress(url: string, _slug: string, _internalID: string) {
    Switchboard.presentNavigationViewController(this.props.Component || this, url)
  }

  render() {
    const { show, onViewAllArtistsPressed, Component } = this.props
    const artistsShown = 5
    // @ts-ignore STRICTNESS_MIGRATION
    const artists = get(show, s => s.artists, []).concat(get(show, s => s.artists_without_artworks, []))
    const items = take(artists, artistsShown)

    return (
      <>
        <Serif size="5">Artists</Serif>
        <Spacer m={1} />
        {items.map((artist, idx, arr) => {
          // @ts-ignore STRICTNESS_MIGRATION
          const { id } = artist
          return (
            <React.Fragment key={id}>
              <ArtistListItem
                // @ts-ignore STRICTNESS_MIGRATION
                artist={artist}
                Component={Component}
              />
              {idx < arr.length - 1 && <Spacer m={1} />}
            </React.Fragment>
          )
        })}
        {artists.length > artistsShown && (
          <>
            <Spacer m={1} />
            <CaretButton text={`View all ${artists.length} artists`} onPress={() => onViewAllArtistsPressed()} />
          </>
        )}
      </>
    )
  }
}

export const ShowArtistsPreviewContainer = createFragmentContainer(ShowArtistsPreview, {
  show: graphql`
    fragment ShowArtistsPreview_show on Show {
      internalID
      slug
      artists {
        id
        internalID
        slug
        href
        ...ArtistListItem_artist
      }
      artists_without_artworks: artistsWithoutArtworks {
        id
        internalID
        slug
        href
        ...ArtistListItem_artist
      }
    }
  `,
})
