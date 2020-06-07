import { createConsignmentSubmissionMutation } from "__generated__/createConsignmentSubmissionMutation.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { NativeModules } from "react-native"
import { commitMutation, graphql } from "relay-runtime"
import { ConsignmentSetup } from "../index"
import { consignmentSetupToMutationInput } from "./consignmentSetupToSubmission"

export const createConsignmentSubmission = (submission: ConsignmentSetup) => {
  const input = consignmentSetupToMutationInput(submission)
  return new Promise<string>((resolve, reject) => {
    commitMutation<createConsignmentSubmissionMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation createConsignmentSubmissionMutation($input: CreateSubmissionMutationInput!) {
          createConsignmentSubmission(input: $input) {
            consignmentSubmission {
              internalID
            }
          }
        }
      `,
      variables: {
        input: {
          ...input,
          userAgent: NativeModules.Emission.userAgent,
        },
      },
      onError: reject,
      onCompleted: (response, errors) => {
        if (errors && errors.length > 0) {
          reject(new Error(JSON.stringify(errors)))
        } else {
          // @ts-ignore STRICTNESS_MIGRATION
          resolve(response.createConsignmentSubmission.consignmentSubmission.internalID)
        }
      },
    })
  })
}
