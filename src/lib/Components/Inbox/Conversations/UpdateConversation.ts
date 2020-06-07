import { UpdateConversationMutation } from "__generated__/UpdateConversationMutation.graphql"
import { commitMutation, graphql } from "react-relay"
import { Environment, MutationConfig } from "relay-runtime"

interface Conversation {
  id: string
  internalID: string
}

export function updateConversation(
  environment: Environment,
  conversation: Conversation,
  fromLastViewedMessageId: string,
  onCompleted: MutationConfig<any>["onCompleted"],
  onError: MutationConfig<any>["onError"]
) {
  return commitMutation<UpdateConversationMutation>(environment, {
    updater: store => {
      // @ts-ignore STRICTNESS_MIGRATION
      store.get(conversation.id).setValue(false, "unread")
    },
    onCompleted,
    onError,
    mutation: graphql`
      mutation UpdateConversationMutation($input: UpdateConversationMutationInput!) {
        updateConversation(input: $input) {
          conversation {
            internalID
            from_last_viewed_message_id: fromLastViewedMessageID
          }
        }
      }
    `,
    variables: {
      input: {
        conversationId: conversation.internalID,
        fromLastViewedMessageId,
      },
    },
  })
}
