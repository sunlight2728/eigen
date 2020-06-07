import { Box, Separator, space, Spacer, Theme } from "@artsy/palette"
import { Artwork_artworkAboveTheFold } from "__generated__/Artwork_artworkAboveTheFold.graphql"
import { Artwork_artworkBelowTheFold } from "__generated__/Artwork_artworkBelowTheFold.graphql"
import { Artwork_me } from "__generated__/Artwork_me.graphql"
import { ArtworkAboveTheFoldQuery } from "__generated__/ArtworkAboveTheFoldQuery.graphql"
import { ArtworkBelowTheFoldQuery } from "__generated__/ArtworkBelowTheFoldQuery.graphql"
import { ArtworkMarkAsRecentlyViewedQuery } from "__generated__/ArtworkMarkAsRecentlyViewedQuery.graphql"
import { RetryErrorBoundary } from "lib/Components/RetryErrorBoundary"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { AboveTheFoldQueryRenderer } from "lib/utils/AboveTheFoldQueryRenderer"
import {
  PlaceholderBox,
  PlaceholderRaggedText,
  PlaceholderText,
  ProvidePlaceholderContext,
} from "lib/utils/placeholders"
import { Schema, screenTrack } from "lib/utils/track"
import { ProvideScreenDimensions, useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { ActivityIndicator, FlatList, View } from "react-native"
import { RefreshControl } from "react-native"
import { commitMutation, createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { TrackingProp } from "react-tracking"
import { RelayModernEnvironment } from "relay-runtime/lib/store/RelayModernEnvironment"
import { AboutArtistFragmentContainer as AboutArtist } from "./Components/AboutArtist"
import { AboutWorkFragmentContainer as AboutWork } from "./Components/AboutWork"
import { ArtworkDetailsFragmentContainer as ArtworkDetails } from "./Components/ArtworkDetails"
import { ArtworkHeaderFragmentContainer as ArtworkHeader } from "./Components/ArtworkHeader"
import { ArtworkHistoryFragmentContainer as ArtworkHistory } from "./Components/ArtworkHistory"
import { CommercialInformationFragmentContainer as CommercialInformation } from "./Components/CommercialInformation"
import { ContextCardFragmentContainer as ContextCard } from "./Components/ContextCard"
import { OtherWorksFragmentContainer as OtherWorks, populatedGrids } from "./Components/OtherWorks/OtherWorks"
import { PartnerCardFragmentContainer as PartnerCard } from "./Components/PartnerCard"

interface Props {
  artworkAboveTheFold: Artwork_artworkAboveTheFold
  artworkBelowTheFold: Artwork_artworkBelowTheFold
  me: Artwork_me
  isVisible: boolean
  relay: RelayRefetchProp
  tracking?: TrackingProp
}

interface State {
  refreshing: boolean
}

@screenTrack<Props>(props => ({
  context_screen: Schema.PageNames.ArtworkPage,
  context_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
  context_screen_owner_slug: props.artworkAboveTheFold.slug,
  context_screen_owner_id: props.artworkAboveTheFold.internalID,
  availability: props.artworkAboveTheFold.availability,
  acquireable: props.artworkAboveTheFold.is_acquireable,
  inquireable: props.artworkAboveTheFold.is_inquireable,
  offerable: props.artworkAboveTheFold.is_offerable,
  biddable: props.artworkAboveTheFold.is_biddable,
}))
export class Artwork extends React.Component<Props, State> {
  state = {
    refreshing: false,
  }

  shouldRenderDetails = () => {
    const {
      category,
      canRequestLotConditionsReport,
      conditionDescription,
      signature,
      signatureInfo,
      certificateOfAuthenticity,
      framed,
      series,
      publisher,
      manufacturer,
      image_rights,
    } = this.props.artworkBelowTheFold

    return !!(
      category ||
      canRequestLotConditionsReport ||
      conditionDescription ||
      signature ||
      signatureInfo ||
      certificateOfAuthenticity ||
      framed ||
      series ||
      publisher ||
      manufacturer ||
      image_rights
    )
  }

  componentDidMount() {
    this.markArtworkAsRecentlyViewed()
  }

  // @ts-ignore STRICTNESS_MIGRATION
  componentDidUpdate(prevProps) {
    // If we are visible, but weren't, then we are re-appearing (not called on first render).
    if (this.props.isVisible && !prevProps.isVisible) {
      this.props.relay.refetch(
        { artistID: this.props.artworkAboveTheFold.internalID },
        null,
        () => {
          this.markArtworkAsRecentlyViewed()
        },
        { force: true }
      )
    }
  }

  shouldRenderPartner = () => {
    const { partner, sale } = this.props.artworkBelowTheFold
    if ((sale && sale.isBenefit) || (sale && sale.isGalleryAuction)) {
      return false
    } else if (partner && partner.type && partner.type !== "Auction House") {
      return true
    } else {
      return false
    }
  }

  shouldRenderOtherWorks = () => {
    const { contextGrids } = this.props.artworkBelowTheFold
    // @ts-ignore STRICTNESS_MIGRATION
    const gridsToShow = populatedGrids(contextGrids)

    if (gridsToShow && gridsToShow.length > 0) {
      return true
    } else {
      return false
    }
  }

  onRefresh = (cb?: () => any) => {
    if (this.state.refreshing) {
      return
    }

    this.setState({ refreshing: true })
    this.props.relay.refetch(
      { artistID: this.props.artworkAboveTheFold.internalID },
      null,
      () => {
        this.setState({ refreshing: false })
        cb?.()
      },
      {
        force: true,
      }
    )
  }

  markArtworkAsRecentlyViewed = () => {
    commitMutation<ArtworkMarkAsRecentlyViewedQuery>(this.props.relay.environment, {
      mutation: graphql`
        mutation ArtworkMarkAsRecentlyViewedQuery($input: RecordArtworkViewInput!) {
          recordArtworkView(input: $input) {
            artworkId
          }
        }
      `,
      variables: {
        input: {
          artwork_id: this.props.artworkAboveTheFold.slug,
        },
      },
    })
  }

  sections(): ArtworkPageSection[] {
    const { artworkAboveTheFold, artworkBelowTheFold, me, tracking } = this.props

    const sections: ArtworkPageSection[] = []

    sections.push({
      key: "header",
      element: <ArtworkHeader artwork={artworkAboveTheFold} />,
      excludePadding: true,
    })

    sections.push({
      key: "commercialInformation",
      element: <CommercialInformation artwork={artworkAboveTheFold} me={me} tracking={tracking} />,
    })

    if (!artworkBelowTheFold) {
      sections.push({
        key: "belowTheFoldPlaceholder",
        element: <BelowTheFoldPlaceholder />,
      })
      return sections
    }

    const { artist, context } = artworkBelowTheFold

    if (artworkBelowTheFold.description || artworkBelowTheFold.additional_information) {
      sections.push({
        key: "aboutWork",
        element: <AboutWork artwork={artworkBelowTheFold} />,
      })
    }

    if (this.shouldRenderDetails()) {
      sections.push({
        key: "artworkDetails",
        element: <ArtworkDetails artwork={artworkBelowTheFold} />,
      })
    }

    if (artworkBelowTheFold.provenance || artworkBelowTheFold.exhibition_history || artworkBelowTheFold.literature) {
      sections.push({
        key: "history",
        element: <ArtworkHistory artwork={artworkBelowTheFold} />,
      })
    }

    if (artist && artist.biography_blurb) {
      sections.push({
        key: "aboutArtist",
        element: <AboutArtist artwork={artworkBelowTheFold} />,
      })
    }

    if (this.shouldRenderPartner()) {
      sections.push({
        key: "partnerCard",
        element: <PartnerCard artwork={artworkBelowTheFold} />,
      })
    }

    if (context && context.__typename === "Sale" && context.isAuction) {
      sections.push({
        key: "contextCard",
        element: <ContextCard artwork={artworkBelowTheFold} />,
      })
    }

    if (this.shouldRenderOtherWorks()) {
      sections.push({
        key: "otherWorks",
        element: <OtherWorks artwork={artworkBelowTheFold} />,
      })
    }

    return sections
  }

  render() {
    return (
      <FlatList<ArtworkPageSection>
        data={this.sections()}
        ItemSeparatorComponent={() => (
          <Box px={2} mx={2} my={3}>
            <Separator />
          </Box>
        )}
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        contentInset={{ bottom: 40 }}
        renderItem={({ item }) => (item.excludePadding ? item.element : <Box px={2}>{item.element}</Box>)}
      />
    )
  }
}

interface ArtworkPageSection {
  key: string
  element: JSX.Element
  excludePadding?: boolean
}

export const ArtworkContainer = createRefetchContainer(
  Artwork,
  {
    artworkAboveTheFold: graphql`
      fragment Artwork_artworkAboveTheFold on Artwork {
        ...ArtworkHeader_artwork
        ...CommercialInformation_artwork
        slug
        internalID
        id
        is_acquireable: isAcquireable
        is_offerable: isOfferable
        is_biddable: isBiddable
        is_inquireable: isInquireable
        availability
      }
    `,
    artworkBelowTheFold: graphql`
      fragment Artwork_artworkBelowTheFold on Artwork {
        additional_information: additionalInformation
        description
        provenance
        exhibition_history: exhibitionHistory
        literature
        partner {
          type
          id
        }
        artist {
          biography_blurb: biographyBlurb {
            text
          }
        }
        sale {
          id
          isBenefit
          isGalleryAuction
        }
        category
        canRequestLotConditionsReport
        conditionDescription {
          details
        }
        signature
        signatureInfo {
          details
        }
        certificateOfAuthenticity {
          details
        }
        framed {
          details
        }
        series
        publisher
        manufacturer
        image_rights: imageRights
        context {
          __typename
          ... on Sale {
            isAuction
          }
        }
        contextGrids {
          artworks: artworksConnection(first: 6) {
            edges {
              node {
                id
              }
            }
          }
        }
        ...PartnerCard_artwork
        ...AboutWork_artwork
        ...OtherWorks_artwork
        ...AboutArtist_artwork
        ...ArtworkDetails_artwork
        ...ContextCard_artwork
        ...ArtworkHistory_artwork
      }
    `,
    me: graphql`
      fragment Artwork_me on Me {
        ...CommercialInformation_me
      }
    `,
  },
  graphql`
    query ArtworkRefetchQuery($artworkID: String!) {
      artwork(id: $artworkID) {
        ...Artwork_artworkAboveTheFold
        ...Artwork_artworkBelowTheFold
      }
    }
  `
)

export const ArtworkQueryRenderer: React.SFC<{
  artworkID: string
  isVisible: boolean
  environment?: RelayModernEnvironment
  tracking?: TrackingProp
}> = ({ artworkID, environment, ...others }) => {
  return (
    <RetryErrorBoundary
      render={({ isRetry }) => {
        return (
          <Theme>
            <ProvideScreenDimensions>
              <AboveTheFoldQueryRenderer<ArtworkAboveTheFoldQuery, ArtworkBelowTheFoldQuery>
                environment={environment || defaultEnvironment}
                above={{
                  query: graphql`
                    query ArtworkAboveTheFoldQuery($artworkID: String!) {
                      artwork(id: $artworkID) {
                        ...Artwork_artworkAboveTheFold
                      }
                      me {
                        ...Artwork_me
                      }
                    }
                  `,
                  variables: { artworkID },
                }}
                below={{
                  query: graphql`
                    query ArtworkBelowTheFoldQuery($artworkID: String!) {
                      artwork(id: $artworkID) {
                        ...Artwork_artworkBelowTheFold
                      }
                    }
                  `,
                  variables: { artworkID },
                }}
                render={{
                  renderPlaceholder: () => <AboveTheFoldPlaceholder />,
                  renderComponent: ({ above, below }) => {
                    return (
                      <ArtworkContainer
                        // @ts-ignore STRICTNESS_MIGRATION
                        artworkAboveTheFold={above.artwork}
                        // @ts-ignore STRICTNESS_MIGRATION
                        artworkBelowTheFold={below?.artwork ?? null}
                        // @ts-ignore STRICTNESS_MIGRATION
                        me={above.me}
                        {...others}
                      />
                    )
                  },
                }}
                cacheConfig={{
                  // Bypass Relay cache on retries.
                  ...(isRetry && { force: true }),
                }}
              />
            </ProvideScreenDimensions>
          </Theme>
        )
      }}
    />
  )
}

const AboveTheFoldPlaceholder: React.FC<{}> = ({}) => {
  const screenDimensions = useScreenDimensions()
  // The logic for artworkHeight comes from the zeplin spec https://zpl.io/25JLX0Q
  // @ts-ignore STRICTNESS_MIGRATION
  const artworkHeight = screenDimensions.width >= 375 ? 340 : 290

  return (
    <View style={{ flex: 1, padding: space(2) }}>
      {/* Artwork thumbnail */}
      <PlaceholderBox height={artworkHeight} />
      <Spacer mb={2} />
      {/* save/share buttons */}
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <PlaceholderText width={50} marginHorizontal={space(1)} />
        <PlaceholderText width={50} marginHorizontal={space(1)} />
        <PlaceholderText width={50} marginHorizontal={space(1)} />
      </View>
      <Spacer mb={2} />
      {/* Artist name */}
      <PlaceholderText width={100} />
      <Spacer mb={2} />
      {/* Artwork tombstone details */}
      <View style={{ width: 130 }}>
        <PlaceholderRaggedText numLines={4} />
      </View>
      <Spacer mb={3} />
      {/* more junk */}
      <Separator />
      <Spacer mb={3} />
      <PlaceholderRaggedText numLines={3} />
      <Spacer mb={2} />
      {/* commerce button */}
      <PlaceholderBox height={60} />
    </View>
  )
}

const BelowTheFoldPlaceholder: React.FC<{}> = ({}) => {
  return (
    <ProvidePlaceholderContext>
      <Separator />
      <Spacer mb={3} />
      {/* About the artwork title */}
      <PlaceholderText width={60} />
      <Spacer mb={2} />
      {/* About the artwork copy */}
      <PlaceholderRaggedText numLines={4} />
      <Spacer mb={3} />
      <Separator />
      <Spacer mb={3} />
      <ActivityIndicator />
      <Spacer mb={3} />
    </ProvidePlaceholderContext>
  )
}
