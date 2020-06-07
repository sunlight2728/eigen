import {
  getGeminiCredentialsForEnvironmentMutation,
  getGeminiCredentialsForEnvironmentMutationResponse,
  RequestCredentialsForAssetUploadInput,
} from "__generated__/getGeminiCredentialsForEnvironmentMutation.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { commitMutation, graphql } from "relay-runtime"

// @ts-ignore STRICTNESS_MIGRATION
export type AssetCredentials = getGeminiCredentialsForEnvironmentMutationResponse["requestCredentialsForAssetUpload"]["asset"]

export const getGeminiCredentialsForEnvironment = (input: RequestCredentialsForAssetUploadInput) => {
  return new Promise<AssetCredentials>((resolve, reject) => {
    commitMutation<getGeminiCredentialsForEnvironmentMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation getGeminiCredentialsForEnvironmentMutation($input: RequestCredentialsForAssetUploadInput!) {
          requestCredentialsForAssetUpload(input: $input) {
            asset {
              signature
              credentials
              policyEncoded
              policyDocument {
                expiration
                conditions {
                  acl
                  bucket
                  geminiKey
                  successActionStatus
                }
              }
            }
          }
        }
      `,
      variables: {
        input: {
          ...input,
          clientMutationId: Math.random().toString(8),
        },
      },
      onError: reject,
      onCompleted: (response, errors) => {
        if (errors && errors.length > 0) {
          reject(new Error(JSON.stringify(errors)))
        } else {
          // @ts-ignore STRICTNESS_MIGRATION
          resolve(response.requestCredentialsForAssetUpload.asset)
        }
      },
    })
  })
}
