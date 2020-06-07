import { Box, Button, color, Flex, Sans, Spacer } from "@artsy/palette"
import Spinner from "lib/Components/Spinner"
import { Schema, screenTrack } from "lib/utils/track"
import React from "react"
import { NavigatorIOS, Route, View, ViewProperties } from "react-native"
import styled from "styled-components/native"
import SwitchBoard from "../../../NativeModules/SwitchBoard"
import Welcome from "./Welcome"

interface Props extends ViewProperties {
  navigator: NavigatorIOS
  route: Route
  /** Used for testing, it's expected to be undefined in prod */
  initialState?: SubmissionTypes

  /** Callback for when the spinner has been showing for after 1 second */
  submissionRequestValidationCheck?: () => boolean
}

interface State {
  submissionState: SubmissionTypes
}

export enum SubmissionTypes {
  Submitting = "Submitting",
  SuccessfulSubmission = "SuccessfulSubmission",
  FailedSubmission = "FailedSubmission",
}

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

@screenTrack({
  context_screen: Schema.PageNames.ConsignmentsSubmission,
  context_screen_owner_type: Schema.OwnerEntityTypes.Consignment,
})
export default class Confirmation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      submissionState: props.initialState || SubmissionTypes.Submitting,
    }

    if (this.state.submissionState === SubmissionTypes.Submitting && props.submissionRequestValidationCheck) {
      setTimeout(this.checkForSubmissionStatus, 1000)
    }
  }

  checkForSubmissionStatus = () => {
    // @ts-ignore STRICTNESS_MIGRATION
    const success = this.props.submissionRequestValidationCheck()
    if (success === undefined) {
      setTimeout(this.checkForSubmissionStatus, 1000)
    } else {
      const submissionState = success ? SubmissionTypes.SuccessfulSubmission : SubmissionTypes.FailedSubmission
      this.setState({ submissionState })
    }
  }

  exitModal = () => SwitchBoard.dismissModalViewController(this)
  exitModalAndGoHome = () => {
    SwitchBoard.dismissModalViewController(this)
    SwitchBoard.presentNavigationViewController(this, "/")
  }
  restart = () => this.props.navigator.push({ component: Welcome })

  progressContent = () => (
    <Flex style={{ flex: 1 }} flexDirection="row" alignItems="center" justifyContent="center">
      <Spinner />
    </Flex>
  )

  successContent = () => (
    <View>
      <Box px={2}>
        <Sans size="6" style={{ textAlign: "center" }}>
          Thank you for submitting your consignment
        </Sans>
        <Spacer mb={3} />
        <Sans size="4" color={color("black60")} style={{ textAlign: "center" }}>
          Our team of specialists are reviewing your work. You'll receive an email update once the status of your
          submission changes.
        </Sans>
        <Spacer mb={3} />
        <Sans size="4" color={color("black60")} style={{ textAlign: "center" }}>
          If your work is accepted, Artsy will gather competitive offers and guide you through the selling process.
        </Sans>
        <Spacer mb={3} />
        <Flex alignItems="stretch" flexDirection="column" width="100%">
          <Button block width={100} onPress={this.exitModal}>
            Done
          </Button>
          <Spacer mb={2} />
          <Button block width={100} onPress={this.exitModalAndGoHome} variant="secondaryOutline">
            Browse new works for sale
          </Button>
        </Flex>
      </Box>
    </View>
  )
  failedContent = () => (
    <View>
      <Box px={2}>
        <Sans size="6" style={{ textAlign: "center" }}>
          Submission failed
        </Sans>
        <Spacer mb={2} />
        <Sans size="4" color={color("black60")} style={{ textAlign: "center" }}>
          Please try again.
        </Sans>
        <Spacer mb={3} />
        <Flex flexDirection="row" justifyContent="center">
          <Button block width={100} onPress={this.restart}>
            Try again
          </Button>
        </Flex>
        <Spacer mb={2} />
        <Flex flexDirection="row" justifyContent="center">
          <Button variant="secondaryOutline" block width={100} onPress={this.exitModal}>
            Quit
          </Button>
        </Flex>
      </Box>
    </View>
  )

  confirmationContent() {
    if (this.state.submissionState === SubmissionTypes.Submitting) {
      return this.progressContent()
    } else if (this.state.submissionState === SubmissionTypes.SuccessfulSubmission) {
      return this.successContent()
    } else if (this.state.submissionState === SubmissionTypes.FailedSubmission) {
      return this.failedContent()
    }
  }

  render() {
    return <Container>{this.confirmationContent()}</Container>
  }
}
