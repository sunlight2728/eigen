import { Button, color, Sans } from "@artsy/palette"
import { BidButton_artwork } from "__generated__/BidButton_artwork.graphql"
import { BidButton_me } from "__generated__/BidButton_me.graphql"
import { AuctionTimerState } from "lib/Components/Bidding/Components/Timer"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { bidderNeedsIdentityVerification } from "lib/utils/auction"
import { Schema } from "lib/utils/track"
import React from "react"
import { Text } from "react-native"
import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import track from "react-tracking"

export const PREDICTION_URL = "https://live.artsy.net"

export interface BidButtonProps {
  artwork: BidButton_artwork
  me: BidButton_me
  auctionState: AuctionTimerState
  relay: RelayProp
}

// @ts-ignore STRICTNESS_MIGRATION
const watchOnly = sale => sale.isRegistrationClosed && !sale?.registrationStatus?.qualifiedForBidding
// @ts-ignore STRICTNESS_MIGRATION
const getMyLotStanding = artwork => artwork.myLotStanding && artwork.myLotStanding.length && artwork.myLotStanding[0]
// @ts-ignore STRICTNESS_MIGRATION
const getHasBid = myLotStanding => !!(myLotStanding && myLotStanding.mostRecentBid)

// @ts-ignore STRICTNESS_MIGRATION
const IdentityVerificationRequiredMessage = ({ onPress, ...remainderProps }) => (
  <Sans mt="1" size="3" color="black60" pb="1" textAlign="center" {...remainderProps}>
    Identity verification required to bid.{" "}
    <Text style={{ textDecorationLine: "underline" }} onPress={onPress}>
      FAQ
    </Text>
  </Sans>
)

@track()
export class BidButton extends React.Component<BidButtonProps> {
  @track({
    action_name: Schema.ActionNames.IdentityVerificationFAQ,
    action_type: Schema.ActionTypes.Tap,
  })
  redirectToIdentityVerificationFAQ() {
    SwitchBoard.presentNavigationViewController(this, `/identity-verification-faq`)
  }

  @track({
    action_name: Schema.ActionNames.RegisterToBid,
    action_type: Schema.ActionTypes.Tap,
  })
  redirectToRegister() {
    const { sale } = this.props.artwork
    // @ts-ignore STRICTNESS_MIGRATION
    SwitchBoard.presentNavigationViewController(this, `/auction-registration/${sale.slug}`)
  }

  @track(props => {
    const { artwork } = props
    return {
      action_name: watchOnly(artwork.sale) ? Schema.ActionNames.EnterLiveBidding : Schema.ActionNames.WatchLiveBidding,
      action_type: Schema.ActionTypes.Tap,
    }
  })
  redirectToLiveBidding() {
    // @ts-ignore STRICTNESS_MIGRATION
    const { slug } = this.props.artwork.sale
    const liveUrl = `${PREDICTION_URL}/${slug}`
    SwitchBoard.presentNavigationViewController(this, liveUrl)
  }

  @track(props => {
    const { artwork } = props
    const myLotStanding = getMyLotStanding(artwork)
    const hasBid = getHasBid(myLotStanding)
    return {
      action_name: hasBid ? Schema.ActionNames.IncreaseMaxBid : Schema.ActionNames.Bid,
      action_type: Schema.ActionTypes.Tap,
    }
  })
  redirectToBid(firstIncrement: number) {
    const { slug, sale } = this.props.artwork
    const bid = firstIncrement

    // @ts-ignore STRICTNESS_MIGRATION
    SwitchBoard.presentNavigationViewController(this, `/auction/${sale.slug}/bid/${slug}?bid=${bid}`)
  }

  renderIsPreview(
    // @ts-ignore STRICTNESS_MIGRATION
    registrationStatus: BidButton_artwork["sale"]["registrationStatus"],
    needsIdentityVerification: boolean
  ) {
    return (
      <>
        {!registrationStatus && (
          <>
            <Button width={100} block size="large" mt={1} onPress={() => this.redirectToRegister()}>
              Register to bid
            </Button>
            {needsIdentityVerification && (
              <IdentityVerificationRequiredMessage onPress={() => this.redirectToIdentityVerificationFAQ()} />
            )}
          </>
        )}
        {registrationStatus && !registrationStatus.qualifiedForBidding && (
          <>
            <Button width={100} block size="large" mt={1} disabled>
              Registration pending
            </Button>
            {needsIdentityVerification && (
              <IdentityVerificationRequiredMessage onPress={() => this.redirectToIdentityVerificationFAQ()} />
            )}
          </>
        )}
        {registrationStatus?.qualifiedForBidding && (
          <Button width={100} block size="large" mt={1} disabled>
            Registration complete
          </Button>
        )}
      </>
    )
  }

  renderIsLiveOpen() {
    const { sale } = this.props.artwork
    const isWatchOnly = watchOnly(sale)
    return (
      <>
        {isWatchOnly && (
          <Sans size="2" color={color("black60")} pb={1} textAlign="center">
            Registration closed
          </Sans>
        )}
        <Button width={100} block size="large" onPress={() => this.redirectToLiveBidding()}>
          {isWatchOnly ? "Watch live bidding" : "Enter live bidding"}
        </Button>
      </>
    )
  }

  render() {
    const { artwork, auctionState, me } = this.props
    const { sale, saleArtwork } = artwork
    // @ts-ignore STRICTNESS_MIGRATION
    const { registrationStatus } = sale

    // TODO: Do we need a nil check against +sale+?
    if (sale?.isClosed) {
      return null
    }

    const qualifiedForBidding = registrationStatus?.qualifiedForBidding
    // @ts-ignore STRICTNESS_MIGRATION
    const needsIdentityVerification = bidderNeedsIdentityVerification({ sale, user: me, bidder: registrationStatus })

    /**
     * NOTE: This is making an incorrect assumption that there could only ever
     *       be 1 live sale with this work. When we run into that case, there is
     *       likely design work to be done too, so we can adjust this then.
     */
    const myLotStanding = getMyLotStanding(artwork)
    const hasBid = getHasBid(myLotStanding)

    if (auctionState === AuctionTimerState.PREVIEW) {
      return this.renderIsPreview(registrationStatus, needsIdentityVerification)
    } else if (auctionState === AuctionTimerState.LIVE_INTEGRATION_ONGOING) {
      return this.renderIsLiveOpen()
    } else if (registrationStatus && !qualifiedForBidding) {
      return (
        <>
          <Button width={100} block size="large" disabled>
            Registration pending
          </Button>
          {needsIdentityVerification && (
            <IdentityVerificationRequiredMessage onPress={() => this.redirectToIdentityVerificationFAQ()} />
          )}
        </>
      )
      // @ts-ignore STRICTNESS_MIGRATION
    } else if (sale.isRegistrationClosed && !qualifiedForBidding) {
      return (
        <Button width={100} block size="large" disabled>
          Registration closed
        </Button>
      )
    } else if (needsIdentityVerification) {
      return (
        <>
          <Button width={100} block size="large" mt={1} onPress={() => this.redirectToRegister()}>
            Register to bid
          </Button>
          <IdentityVerificationRequiredMessage onPress={() => this.redirectToIdentityVerificationFAQ()} />
        </>
      )
    } else {
      const myLastMaxBid = hasBid && myLotStanding.mostRecentBid.maxBid.cents
      // @ts-ignore STRICTNESS_MIGRATION
      const increments = saleArtwork.increments.filter(increment => increment.cents > (myLastMaxBid || 0))
      const firstIncrement = increments && increments.length && increments[0]
      const incrementCents = firstIncrement && firstIncrement.cents

      return (
        // @ts-ignore STRICTNESS_MIGRATION
        <Button width={100} size="large" block onPress={() => this.redirectToBid(incrementCents)}>
          {hasBid ? "Increase max bid" : "Bid"}
        </Button>
      )
    }
  }
}

export const BidButtonFragmentContainer = createFragmentContainer(BidButton, {
  artwork: graphql`
    fragment BidButton_artwork on Artwork {
      slug
      sale {
        slug
        registrationStatus {
          qualifiedForBidding
        }
        isPreview
        isLiveOpen
        isClosed
        isRegistrationClosed
        requireIdentityVerification
      }
      myLotStanding(live: true) {
        mostRecentBid {
          maxBid {
            cents
          }
        }
      }
      saleArtwork {
        increments {
          cents
        }
      }
    }
  `,
  me: graphql`
    fragment BidButton_me on Me {
      identityVerified
    }
  `,
})
