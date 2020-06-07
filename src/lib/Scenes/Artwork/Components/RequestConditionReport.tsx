import { Button, Flex } from "@artsy/palette"
import { RequestConditionReport_artwork } from "__generated__/RequestConditionReport_artwork.graphql"
import { RequestConditionReport_me } from "__generated__/RequestConditionReport_me.graphql"
import {
  RequestConditionReportMutation,
  RequestConditionReportMutationResponse,
} from "__generated__/RequestConditionReportMutation.graphql"
import { RequestConditionReportQuery } from "__generated__/RequestConditionReportQuery.graphql"
import { Modal } from "lib/Components/Modal"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { Schema, track } from "lib/utils/track"
import React from "react"
import { View } from "react-native"
import { commitMutation, createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import { PayloadError } from "relay-runtime"

interface RequestConditionReportProps {
  artwork: RequestConditionReport_artwork
  me: RequestConditionReport_me
  relay: RelayProp
}

interface State {
  requestingConditionReport: boolean
  showConditionReportRequestedModal: boolean
  showErrorModal: boolean
  errorModalText: string
}

@track({
  action_name: Schema.ActionNames.RequestConditionReport,
  context_module: Schema.ContextModules.ArtworkDetails,
})
export class RequestConditionReport extends React.Component<RequestConditionReportProps, State> {
  state: State = {
    requestingConditionReport: false,
    showConditionReportRequestedModal: false,
    showErrorModal: false,
    errorModalText: "",
  }

  requestConditionReport = () => {
    const { artwork, relay } = this.props
    return new Promise<RequestConditionReportMutationResponse>(async (resolve, reject) => {
      commitMutation<RequestConditionReportMutation>(relay.environment, {
        onCompleted: resolve,
        onError: reject,
        mutation: graphql`
          mutation RequestConditionReportMutation($input: RequestConditionReportInput!) {
            requestConditionReport(input: $input) {
              conditionReportRequest {
                internalID
              }
            }
          }
        `,
        variables: {
          // @ts-ignore STRICTNESS_MIGRATION
          input: { saleArtworkID: artwork.saleArtwork.internalID },
        },
      })
    })
  }

  @track({
    action_type: Schema.ActionTypes.Fail,
  })
  presentErrorModal(errors: Error | ReadonlyArray<PayloadError>) {
    console.error("RequestConditionReport.tsx", errors)
    const errorMessage = "There was a problem processing your request. Please try again."
    this.setState({ showErrorModal: true, errorModalText: errorMessage })
  }

  @track({
    action_type: Schema.ActionTypes.Success,
  })
  presentSuccessModal() {
    this.setState({ showConditionReportRequestedModal: true })
  }

  @track({
    action_type: Schema.ActionTypes.Tap,
  })
  handleRequestConditionReportTap() {
    this.setState({ requestingConditionReport: true })

    this.requestConditionReport()
      .then(data => {
        if (data.requestConditionReport) {
          this.presentSuccessModal()
        } else {
          // @ts-ignore STRICTNESS_MIGRATION
          this.presentErrorModal(null)
        }
        this.setState({ requestingConditionReport: false })
      })
      .catch(error => {
        this.presentErrorModal(error)
        this.setState({ requestingConditionReport: false })
      })
  }

  closeModals() {
    this.setState({ showConditionReportRequestedModal: false, showErrorModal: false })
  }

  render() {
    const { me } = this.props
    const { requestingConditionReport, showErrorModal, errorModalText, showConditionReportRequestedModal } = this.state

    return (
      <View>
        <Button
          mt={1}
          size="small"
          variant="secondaryGray"
          loading={requestingConditionReport}
          onPress={this.handleRequestConditionReportTap.bind(this)}
        >
          Request condition report
        </Button>
        <Flex height={0}>
          <Modal
            textAlign="center"
            visible={showErrorModal}
            headerText="An error occurred"
            detailText={errorModalText}
            closeModal={this.closeModals.bind(this)}
          />
          <Modal
            textAlign="center"
            visible={showConditionReportRequestedModal}
            headerText="Condition Report Requested"
            detailText={`We have received your request.\nThe condition report will be sent to ${me &&
              me.email}.\nFor questions contact specialist@artsy.net.`}
            closeModal={this.closeModals.bind(this)}
          />
        </Flex>
      </View>
    )
  }
}

export const RequestConditionReportQueryRenderer: React.FC<{
  artworkID: string
}> = ({ artworkID }) => {
  return (
    <QueryRenderer<RequestConditionReportQuery>
      environment={defaultEnvironment}
      variables={{ artworkID }}
      query={graphql`
        query RequestConditionReportQuery($artworkID: String!) {
          me {
            ...RequestConditionReport_me
          }

          artwork(id: $artworkID) {
            ...RequestConditionReport_artwork
          }
        }
      `}
      render={({ props }) => {
        if (props) {
          // @ts-ignore STRICTNESS_MIGRATION
          return <RequestConditionReportFragmentContainer artwork={props.artwork} me={props.me} />
        } else {
          return null
        }
      }}
    />
  )
}

export const RequestConditionReportFragmentContainer = createFragmentContainer(RequestConditionReport, {
  me: graphql`
    fragment RequestConditionReport_me on Me {
      email
      internalID
    }
  `,
  artwork: graphql`
    fragment RequestConditionReport_artwork on Artwork {
      internalID
      slug
      saleArtwork {
        internalID
      }
    }
  `,
})
