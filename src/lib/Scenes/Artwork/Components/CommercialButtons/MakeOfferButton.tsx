import { Button, ButtonVariant } from "@artsy/palette"
import { MakeOfferButton_artwork } from "__generated__/MakeOfferButton_artwork.graphql"
import { MakeOfferButtonOrderMutation } from "__generated__/MakeOfferButtonOrderMutation.graphql"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema, Track, track as _track } from "lib/utils/track"
import React from "react"
import { Alert } from "react-native"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"

export interface MakeOfferButtonProps {
  artwork: MakeOfferButton_artwork
  relay: RelayProp
  // EditionSetID is passed down from the edition selected by the user
  editionSetID: string | null
  variant?: ButtonVariant
}

export interface State {
  isCommittingCreateOfferOrderMutation: boolean
}

// @ts-ignore STRICTNESS_MIGRATION
const track: Track<MakeOfferButtonProps, State> = _track

@track()
export class MakeOfferButton extends React.Component<MakeOfferButtonProps, State> {
  state = {
    isCommittingCreateOfferOrderMutation: false,
  }

  // @ts-ignore STRICTNESS_MIGRATION
  onMutationError(error) {
    Alert.alert("Sorry, we couldn't process the request.", "Please try again or contact orders@artsy.net for help.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Retry",
        onPress: () => {
          this.handleCreateOfferOrder()
        },
      },
    ])
    console.log("src/lib/Scenes/Artwork/Components/MakeOfferButton.tsx", error)
  }

  @track({
    action_name: Schema.ActionNames.MakeOffer,
    action_type: Schema.ActionTypes.Tap,
    context_module: Schema.ContextModules.CommercialButtons,
  })
  handleCreateOfferOrder() {
    const { relay, artwork, editionSetID } = this.props
    const { isCommittingCreateOfferOrderMutation } = this.state
    const { internalID } = artwork

    if (isCommittingCreateOfferOrderMutation) {
      return
    }

    this.setState({ isCommittingCreateOfferOrderMutation: true }, () => {
      if (relay && relay.environment) {
        commitMutation<MakeOfferButtonOrderMutation>(relay.environment, {
          mutation: graphql`
            mutation MakeOfferButtonOrderMutation($input: CommerceCreateOfferOrderWithArtworkInput!) {
              commerceCreateOfferOrderWithArtwork(input: $input) {
                orderOrError {
                  __typename
                  ... on CommerceOrderWithMutationSuccess {
                    order {
                      internalID
                      mode
                    }
                  }
                  ... on CommerceOrderWithMutationFailure {
                    error {
                      type
                      code
                      data
                    }
                  }
                }
              }
            }
          `,
          variables: {
            input: {
              artworkId: internalID,
              editionSetId: editionSetID,
            },
          },
          onCompleted: data => {
            this.setState({ isCommittingCreateOfferOrderMutation: false }, () => {
              const {
                // @ts-ignore STRICTNESS_MIGRATION
                commerceCreateOfferOrderWithArtwork: { orderOrError },
              } = data
              if (orderOrError.__typename === "CommerceOrderWithMutationFailure") {
                this.onMutationError(orderOrError.error)
              } else if (orderOrError.__typename === "CommerceOrderWithMutationSuccess") {
                SwitchBoard.presentModalViewController(this, `/orders/${orderOrError.order.internalID}`)
              }
            })
          },
          onError: error =>
            this.setState({ isCommittingCreateOfferOrderMutation: false }, () => this.onMutationError(error)),
        })
      }
    })
  }

  render() {
    const { isCommittingCreateOfferOrderMutation } = this.state

    return (
      <Button
        onPress={() => this.handleCreateOfferOrder()}
        loading={isCommittingCreateOfferOrderMutation}
        size="large"
        block
        width={100}
        variant={this.props.variant}
      >
        Make offer
      </Button>
    )
  }
}

export const MakeOfferButtonFragmentContainer = createFragmentContainer(MakeOfferButton, {
  artwork: graphql`
    fragment MakeOfferButton_artwork on Artwork {
      internalID
    }
  `,
})
