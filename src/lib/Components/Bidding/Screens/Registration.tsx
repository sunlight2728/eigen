import { Box, Button, Sans, Serif } from "@artsy/palette"
import { get, isEmpty } from "lodash"
import React from "react"
import { NativeModules, ScrollView, View, ViewProperties } from "react-native"
import NavigatorIOS from "react-native-navigator-ios"
import { commitMutation, createFragmentContainer, graphql, RelayProp } from "react-relay"
// @ts-ignore STRICTNESS_MIGRATION
import stripe from "tipsi-stripe"

import { bidderNeedsIdentityVerification } from "lib/utils/auction"
import { Schema, screenTrack } from "lib/utils/track"

import SwitchBoard from "lib/NativeModules/SwitchBoard"

import { Flex } from "../Elements/Flex"

import { Modal } from "lib/Components/Modal"
import { LinkText } from "../../Text/LinkText"
import { BiddingThemeProvider } from "../Components/BiddingThemeProvider"
import { Checkbox } from "../Components/Checkbox"
import { PaymentInfo } from "../Components/PaymentInfo"
import { Timer } from "../Components/Timer"
import { Title } from "../Components/Title"
import { Address, PaymentCardTextFieldParams, StripeToken } from "../types"

import { Registration_me } from "__generated__/Registration_me.graphql"
import { Registration_sale } from "__generated__/Registration_sale.graphql"

import { RegistrationCreateBidderMutation } from "__generated__/RegistrationCreateBidderMutation.graphql"
import { RegistrationCreateCreditCardMutation } from "__generated__/RegistrationCreateCreditCardMutation.graphql"
import { RegistrationUpdateUserMutation } from "__generated__/RegistrationUpdateUserMutation.graphql"
import { RegistrationResult, RegistrationStatus } from "./RegistrationResult"

stripe.setOptions({ publishableKey: NativeModules.Emission.stripePublishableKey })

export interface RegistrationProps extends ViewProperties {
  sale: Registration_sale
  me: Registration_me
  relay: RelayProp
  navigator?: NavigatorIOS
}

interface RegistrationState {
  billingAddress?: Address
  creditCardFormParams?: PaymentCardTextFieldParams
  creditCardToken?: StripeToken
  conditionsOfSaleChecked: boolean
  isLoading: boolean
  requiresPaymentInformation: boolean
  errorModalVisible: boolean
  errorModalDetailText: string
}

// @ts-ignore STRICTNESS_MIGRATION
const Hint = props => {
  return <Sans mt="5" mx="4" size="3t" textAlign="center" {...props} />
}

@screenTrack({
  context_screen: Schema.PageNames.BidFlowRegistration,
  // @ts-ignore STRICTNESS_MIGRATION
  context_screen_owner_type: null,
})
export class Registration extends React.Component<RegistrationProps, RegistrationState> {
  // @ts-ignore STRICTNESS_MIGRATION
  constructor(props) {
    super(props)

    const { has_credit_cards } = this.props.me
    const requiresPaymentInformation = !has_credit_cards

    this.state = {
      // @ts-ignore STRICTNESS_MIGRATION
      billingAddress: null,
      // @ts-ignore STRICTNESS_MIGRATION
      creditCardToken: null,
      // @ts-ignore STRICTNESS_MIGRATION
      creditCardFormParams: null,
      conditionsOfSaleChecked: false,
      requiresPaymentInformation,
      isLoading: false,
      errorModalVisible: false,
      errorModalDetailText: "",
    }
  }

  canCreateBidder() {
    const { billingAddress, creditCardToken, conditionsOfSaleChecked } = this.state

    if (this.state.requiresPaymentInformation) {
      return billingAddress && creditCardToken && conditionsOfSaleChecked
    } else {
      return conditionsOfSaleChecked
    }
  }

  onPressConditionsOfSale = () => {
    SwitchBoard.presentModalViewController(this, "/conditions-of-sale?present_modally=true")
  }

  onCreditCardAdded(token: StripeToken, params: PaymentCardTextFieldParams) {
    this.setState({ creditCardToken: token, creditCardFormParams: params })
  }

  onBillingAddressAdded(values: Address) {
    this.setState({ billingAddress: values })
  }

  conditionsOfSalePressed() {
    this.setState({ conditionsOfSaleChecked: !this.state.conditionsOfSaleChecked })
  }

  async register() {
    this.setState({ isLoading: true })

    this.state.requiresPaymentInformation ? await this.setupAddressCardAndBidder() : await this.setupBidder()
  }

  /** Make a bid */
  async setupBidder() {
    await this.createBidder()
  }

  /** Run through the full flow setting up the user account and making a bid  */
  async setupAddressCardAndBidder() {
    try {
      await this.updatePhoneNumber()
      const token = await this.createTokenFromAddress()
      await this.createCreditCard(token)
      await this.createBidder()
    } catch (error) {
      if (!this.state.errorModalVisible) {
        this.presentRegistrationError(error, RegistrationStatus.RegistrationStatusError)
      }
    }
  }

  /**
   * Because the phone number lives on the user, not as credit card metadata, then we
   * need a separate call to update our User model to store that info
   */
  async updatePhoneNumber() {
    return new Promise((done, reject) => {
      // @ts-ignore STRICTNESS_MIGRATION
      const { phoneNumber } = this.state.billingAddress
      commitMutation<RegistrationUpdateUserMutation>(this.props.relay.environment, {
        onCompleted: (_, errors) => {
          if (errors && errors.length) {
            this.presentErrorModal(errors, null)
            reject(errors)
          } else {
            done()
          }
        },
        onError: error => {
          this.presentRegistrationError(error, RegistrationStatus.RegistrationStatusNetworkError)
        },
        mutation: graphql`
          mutation RegistrationUpdateUserMutation($input: UpdateMyProfileInput!) {
            updateMyUserProfile(input: $input) {
              clientMutationId
              user {
                phone
              }
            }
          }
        `,
        variables: { input: { phone: phoneNumber } },
      })
    })
  }

  async createTokenFromAddress() {
    const { billingAddress, creditCardFormParams } = this.state
    return stripe.createTokenWithCard({
      ...creditCardFormParams,
      // @ts-ignore STRICTNESS_MIGRATION
      name: billingAddress.fullName,
      // @ts-ignore STRICTNESS_MIGRATION
      addressLine1: billingAddress.addressLine1,
      // @ts-ignore STRICTNESS_MIGRATION
      addressLine2: billingAddress.addressLine2,
      // @ts-ignore STRICTNESS_MIGRATION
      addressCity: billingAddress.city,
      // @ts-ignore STRICTNESS_MIGRATION
      addressState: billingAddress.state,
      // @ts-ignore STRICTNESS_MIGRATION
      addressZip: billingAddress.postalCode,
      // @ts-ignore STRICTNESS_MIGRATION
      addressCountry: billingAddress.country.shortName,
    })
  }

  async createCreditCard(token: any) {
    return new Promise(done => {
      commitMutation<RegistrationCreateCreditCardMutation>(this.props.relay.environment, {
        onCompleted: (data, errors) => {
          if (data && get(data, "createCreditCard.creditCardOrError.creditCard")) {
            done()
          } else {
            if (isEmpty(errors)) {
              const mutationError = data && get(data, "createCreditCard.creditCardOrError.mutationError")
              this.presentErrorModal(mutationError, mutationError.detail)
            } else {
              this.presentErrorModal(errors, null)
            }
          }
        },
        onError: errors => this.presentRegistrationError(errors, RegistrationStatus.RegistrationStatusNetworkError),
        mutation: graphql`
          mutation RegistrationCreateCreditCardMutation($input: CreditCardInput!) {
            createCreditCard(input: $input) {
              creditCardOrError {
                ... on CreditCardMutationSuccess {
                  creditCard {
                    internalID
                    brand
                    name
                    last_digits: lastDigits
                    expiration_month: expirationMonth
                    expiration_year: expirationYear
                  }
                }
                ... on CreditCardMutationFailure {
                  mutationError {
                    type
                    message
                    detail
                  }
                }
              }
            }
          }
        `,
        variables: { input: { token: token.tokenId } },
      })
    })
  }

  createBidder() {
    commitMutation<RegistrationCreateBidderMutation>(this.props.relay.environment, {
      onCompleted: (results, errors) =>
        isEmpty(errors)
          ? this.presentRegistrationSuccess(results)
          : this.presentRegistrationError(errors, RegistrationStatus.RegistrationStatusError),
      onError: error => {
        this.presentRegistrationError(error, RegistrationStatus.RegistrationStatusNetworkError)
      },
      mutation: graphql`
        mutation RegistrationCreateBidderMutation($input: CreateBidderInput!) {
          createBidder(input: $input) {
            bidder {
              internalID
              qualified_for_bidding: qualifiedForBidding
            }
          }
        }
      `,
      // FIXME: Should this be slug or internalID?
      variables: { input: { saleID: this.props.sale.slug } },
    })
  }

  // @ts-ignore STRICTNESS_MIGRATION
  presentRegistrationSuccess({ createBidder }) {
    NativeModules.ARNotificationsManager.postNotificationName("ARAuctionArtworkRegistrationUpdated", {
      ARAuctionID: this.props.sale.slug,
    })

    const qualifiedForBidding = createBidder.bidder.qualified_for_bidding
    if (qualifiedForBidding === true) {
      this.presentRegistrationResult(RegistrationStatus.RegistrationStatusComplete)
    } else {
      this.presentRegistrationResult(RegistrationStatus.RegistrationStatusPending)
    }
  }

  // @ts-ignore STRICTNESS_MIGRATION
  presentRegistrationError(error, status) {
    console.error("Registration.tsx", error)
    this.presentRegistrationResult(status)
  }

  presentRegistrationResult(status: RegistrationStatus) {
    const { sale, me, navigator } = this.props

    // @ts-ignore STRICTNESS_MIGRATION
    navigator.push({
      // @ts-ignore STRICTNESS_MIGRATION
      component: RegistrationResult,
      title: "",
      passProps: {
        status,
        // @ts-ignore STRICTNESS_MIGRATION
        needsIdentityVerification: bidderNeedsIdentityVerification({ sale, user: me }),
      },
    })

    this.setState({ isLoading: false })
  }

  // @ts-ignore STRICTNESS_MIGRATION
  presentErrorModal(errors, mutationMessage) {
    console.error("Registration.tsx", errors)

    const errorMessage =
      mutationMessage || "There was a problem processing your information. Check your payment details and try again."
    this.setState({ errorModalVisible: true, errorModalDetailText: errorMessage, isLoading: false })
  }

  closeModal() {
    this.setState({ errorModalVisible: false })
  }

  render() {
    const { sale, me } = this.props
    const { live_start_at, end_at, is_preview, start_at } = sale
    const { isLoading, requiresPaymentInformation } = this.state

    return (
      <BiddingThemeProvider>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}>
          <View>
            <Flex alignItems="center">
              <Title mb={3}>Register to bid</Title>
              <Timer
                // @ts-ignore STRICTNESS_MIGRATION
                liveStartsAt={live_start_at}
                // @ts-ignore STRICTNESS_MIGRATION
                endsAt={end_at}
                // @ts-ignore STRICTNESS_MIGRATION
                isPreview={is_preview}
                // @ts-ignore STRICTNESS_MIGRATION
                startsAt={start_at}
              />
              <Serif size="4t" weight="semibold" my={5} mx={6} textAlign="center">
                {sale.name}
              </Serif>
            </Flex>
            {!!requiresPaymentInformation && (
              <>
                <PaymentInfo
                  navigator={isLoading ? ({ push: () => null } as any) : this.props.navigator}
                  onCreditCardAdded={this.onCreditCardAdded.bind(this)}
                  onBillingAddressAdded={this.onBillingAddressAdded.bind(this)}
                  billingAddress={this.state.billingAddress}
                  creditCardFormParams={this.state.creditCardFormParams}
                  creditCardToken={this.state.creditCardToken}
                />
                <Hint>A valid credit card is required.</Hint>
              </>
            )}
            {!!bidderNeedsIdentityVerification(
              // @ts-ignore STRICTNESS_MIGRATION
              { sale, user: me }
            ) && (
              <>
                <Hint>This auction requires Artsy to verify your identity before bidding.</Hint>
                <Hint mt="4">
                  After you register, you’ll receive an email with a link to complete identity verification.
                </Hint>
              </>
            )}
            {!requiresPaymentInformation &&
              !bidderNeedsIdentityVerification(
                // @ts-ignore STRICTNESS_MIGRATION
                { sale, user: me }
              ) && <Hint>To complete your registration, please confirm that you agree to the Conditions of Sale.</Hint>}
            <Modal
              visible={this.state.errorModalVisible}
              headerText="An error occurred"
              detailText={this.state.errorModalDetailText}
              closeModal={this.closeModal.bind(this)}
            />
          </View>

          <View>
            <Checkbox
              mb={4}
              justifyContent="center"
              onPress={() => this.conditionsOfSalePressed()}
              disabled={isLoading}
            >
              <Serif size="2" mt={2} color="black60">
                Agree to{" "}
                <LinkText onPress={isLoading ? undefined : this.onPressConditionsOfSale}>Conditions of Sale</LinkText>
              </Serif>
            </Checkbox>

            <Box m={4}>
              <Button
                // @ts-ignore STRICTNESS_MIGRATION
                onPress={this.canCreateBidder() ? this.register.bind(this) : null}
                loading={isLoading}
                block
                width={100}
                disabled={!this.canCreateBidder()}
              >
                Complete registration
              </Button>
            </Box>
          </View>
        </ScrollView>
      </BiddingThemeProvider>
    )
  }
}

export const RegistrationScreen = createFragmentContainer(Registration, {
  sale: graphql`
    fragment Registration_sale on Sale {
      slug
      end_at: endAt
      is_preview: isPreview
      live_start_at: liveStartAt
      name
      start_at: startAt
      requireIdentityVerification
    }
  `,
  me: graphql`
    fragment Registration_me on Me {
      has_credit_cards: hasCreditCards
      identityVerified
    }
  `,
})
