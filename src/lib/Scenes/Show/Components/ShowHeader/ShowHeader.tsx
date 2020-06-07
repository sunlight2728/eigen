import { Box, Button, Sans, Serif, Spacer } from "@artsy/palette"
import { ShowHeader_show } from "__generated__/ShowHeader_show.graphql"
import { ShowHeaderFollowShowMutation } from "__generated__/ShowHeaderFollowShowMutation.graphql"
import { EntityList } from "lib/Components/EntityList"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { exhibitionDates } from "lib/Scenes/Map/exhibitionPeriodParser"
import { Schema, Track, track as _track } from "lib/utils/track"
import { uniq } from "lodash"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
import { Carousel } from "./Components/Carousel"

interface Props {
  show: ShowHeader_show
  relay: RelayProp
}

interface State {
  isFollowedSaving: boolean
}

// @ts-ignore STRICTNESS_MIGRATION
const track: Track<Props, State> = _track

@track()
export class ShowHeader extends React.Component<Props, State> {
  state = { isFollowedSaving: false }

  handlePartnerTitleClick = () => {
    const { show } = this.props
    if (show.isStubShow) {
      return
    }
    // @ts-ignore STRICTNESS_MIGRATION
    SwitchBoard.presentNavigationViewController(this, `${show.partner.href}?entity=gallery`)
  }

  handleFollowShow = () => {
    const {
      relay,
      show: { slug: showSlug, id: relayID, internalID: showID, is_followed: isShowFollowed },
    } = this.props

    this.setState(
      {
        isFollowedSaving: true,
      },
      () => {
        commitMutation<ShowHeaderFollowShowMutation>(relay.environment, {
          onCompleted: () => this.handleShowSuccessfullyUpdated(),
          mutation: graphql`
            mutation ShowHeaderFollowShowMutation($input: FollowShowInput!) {
              followShow(input: $input) {
                show {
                  slug
                  internalID
                  is_followed: isFollowed
                }
              }
            }
          `,
          variables: {
            input: {
              partnerShowID: showID,
              unfollow: isShowFollowed,
            },
          },
          optimisticResponse: {
            followShow: {
              show: {
                internalID: showID,
                is_followed: !isShowFollowed,
                slug: showSlug,
              },
            },
          },
          updater: store => {
            // @ts-ignore STRICTNESS_MIGRATION
            store.get(relayID).setValue(!isShowFollowed, "is_followed")
          },
        })
      }
    )
  }

  @track(props => ({
    action_name: props.show.is_followed ? Schema.ActionNames.SaveShow : Schema.ActionNames.UnsaveShow,
    action_type: Schema.ActionTypes.Success,
    owner_id: props.show.internalID,
    owner_slug: props.show.slug,
    owner_type: Schema.OwnerEntityTypes.Show,
  }))
  handleShowSuccessfullyUpdated() {
    this.setState({
      isFollowedSaving: false,
    })
  }

  @track(props => ({
    action_name: Schema.ActionNames.CarouselSwipe,
    action_type: Schema.ActionTypes.Tap,
    owner_id: props.show.internalID,
    owner_slug: props.show.slug,
    owner_type: Schema.OwnerEntityTypes.Show,
  }))
  handleUserSwipingCarousel() {
    return null
  }

  @track((__, _, args) => {
    const slug = args[1]
    const id = args[2]
    return {
      action_name: Schema.ActionNames.ContextualArtist,
      action_type: Schema.ActionTypes.Tap,
      owner_id: id,
      owner_slug: slug,
      owner_type: Schema.OwnerEntityTypes.Artist,
    } as any
  })
  // @ts-ignore STRICTNESS_MIGRATION
  handleArtistSelected(url, _slug, _internalID) {
    SwitchBoard.presentNavigationViewController(this, url)
  }

  handleViewAllArtistsPressed() {
    SwitchBoard.presentNavigationViewController(this, `/show/${this.props.show.slug}/artists`)
  }

  render() {
    const { isFollowedSaving } = this.state
    const {
      show: { artists, images, is_followed, name, partner, followedArtists, end_at, exhibition_period, coverImage },
    } = this.props
    const fairfollowedArtistList =
      // @ts-ignore STRICTNESS_MIGRATION
      (followedArtists && followedArtists.edges && followedArtists.edges.map(fa => fa.node.artist)) || []
    const uniqArtistList = uniq(fairfollowedArtistList.concat(artists))
    const displayImageCarousel = !!images && !!images.length && images.length > 1
    const singleImage = !!images && images.length === 1 ? images[0] : coverImage

    return (
      <>
        <Box px={2} pt={5} pb={displayImageCarousel ? 0 : 4}>
          <Spacer m={2} />
          <TouchableWithoutFeedback onPress={this.handlePartnerTitleClick}>
            <Sans size="3" mb={0.5} weight="medium">
              {
                // @ts-ignore STRICTNESS_MIGRATION
                partner.name
              }
            </Sans>
          </TouchableWithoutFeedback>
          <Serif size="8" lineHeight={34}>
            {name}
          </Serif>
          {!!exhibition_period && (
            <Sans size="3">
              {exhibitionDates(
                exhibition_period,
                // @ts-ignore STRICTNESS_MIGRATION
                end_at
              )}
            </Sans>
          )}
        </Box>
        {displayImageCarousel ? (
          <Carousel
            // @ts-ignore STRICTNESS_MIGRATION
            sources={(images || []).map(({ url: imageURL, aspect_ratio: aspectRatio }) => ({
              imageURL,
              aspectRatio,
            }))}
            onScrollEndDrag={e => {
              // @ts-ignore STRICTNESS_MIGRATION
              if (e.nativeEvent.velocity.x > 0) {
                this.handleUserSwipingCarousel()
              }
            }}
          />
        ) : (
          !!singleImage && (
            <Box px={2} py={2}>
              <OpaqueImageView
                // @ts-ignore STRICTNESS_MIGRATION
                imageURL={singleImage.url}
                aspectRatio={singleImage.aspect_ratio}
              />
            </Box>
          )
        )}
        <Box px={2}>
          <EntityList
            prefix="Works by"
            // @ts-ignore STRICTNESS_MIGRATION
            list={uniqArtistList}
            // @ts-ignore STRICTNESS_MIGRATION
            count={artists.length}
            displayedItems={3}
            onItemSelected={this.handleArtistSelected.bind(this)}
            onViewAllPressed={this.handleViewAllArtistsPressed.bind(this)}
          />
          <Spacer mb={2} />
          <Button
            width={100}
            block
            loading={isFollowedSaving}
            onPress={this.handleFollowShow}
            variant={is_followed ? "secondaryOutline" : "primaryBlack"}
          >
            {is_followed ? "Show saved" : "Save show"}
          </Button>
          <Spacer mb={2} />
        </Box>
      </>
    )
  }
}

export const ShowHeaderContainer = createFragmentContainer(ShowHeader, {
  show: graphql`
    fragment ShowHeader_show on Show {
      slug
      internalID
      id
      name
      is_followed: isFollowed
      end_at: endAt
      exhibition_period: exhibitionPeriod
      isStubShow
      partner {
        ... on Partner {
          name
          slug
          href
        }
      }
      coverImage {
        url
        aspect_ratio: aspectRatio
      }
      images {
        url
        aspect_ratio: aspectRatio
      }
      followedArtists: followedArtistsConnection(first: 3) {
        edges {
          node {
            artist {
              name
              href
              slug
              internalID
            }
          }
        }
      }
      artists {
        name
        href
        slug
        internalID
      }
    }
  `,
})
