import { SendConversationMessageMutation } from "__generated__/SendConversationMessageMutation.graphql"
import { commitMutation, graphql } from "react-relay"
import { ConnectionHandler, Environment, MutationConfig, RecordSourceSelectorProxy } from "relay-runtime"

interface Conversation {
  lastMessageID: string
  internalID: string
  id: string
  from: {
    email: string
  }
}

export function sendConversationMessage(
  environment: Environment,
  conversation: Conversation,
  text: string,
  onCompleted: MutationConfig<any>["onCompleted"],
  onError: MutationConfig<any>["onError"]
) {
  const storeUpdater = (store: RecordSourceSelectorProxy) => {
    const mutationPayload = store.getRootField("sendConversationMessage")
    // @ts-ignore STRICTNESS_MIGRATION
    const newMessageEdge = mutationPayload.getLinkedRecord("messageEdge")
    const conversationStore = store.get(conversation.id)
    // @ts-ignore STRICTNESS_MIGRATION
    const connection = ConnectionHandler.getConnection(conversationStore, "Messages_messages")
    // @ts-ignore STRICTNESS_MIGRATION
    ConnectionHandler.insertEdgeBefore(connection, newMessageEdge)
  }
  return commitMutation<SendConversationMessageMutation>(environment, {
    onCompleted,
    onError,
    optimisticUpdater: storeUpdater,
    updater: storeUpdater,

    // TODO: See if we can extract the field selections into a fragment and share it with the normal pagination fragment.
    //      Also looks like we can get rid of the `body` selection.
    mutation: graphql`
      mutation SendConversationMessageMutation($input: SendConversationMessageMutationInput!) {
        sendConversationMessage(input: $input) {
          messageEdge {
            node {
              impulse_id: impulseID
              is_from_user: isFromUser
              body
              id
              ...Message_message
            }
          }
        }
      }
    `,

    variables: {
      input: {
        id: conversation.internalID,
        from: conversation.from.email,
        bodyText: text,
        // Reply to the last message
        replyToMessageID: conversation.lastMessageID,
      },
    },

    // TODO: Figure out which of these keys is *actually* required for Relay Modern and update the typings to reflect that.
    //      And if it’s really true that this config isn’t enough to update the connection and we really need the updater
    //      functions.
    configs: [
      {
        type: "RANGE_ADD",
        parentName: "conversation",
        parentID: "id",
        connectionName: "messages",
        edgeName: "messageEdge",
        rangeBehaviors: {
          "": "append",
        },
        connectionInfo: [
          {
            key: "Messages_messages",
            rangeBehavior: "append",
          },
        ],
      },
    ],

    optimisticResponse: {
      sendConversationMessage: {
        messageEdge: {
          node: {
            body: text,
            from: {
              email: conversation.from.email,
              name: null,
            },
            is_from_user: true,
            created_at: null, // Intentionally left blank so Message can recognize this as an optimistic response.
            attachments: [],
          } as any,
        },
      },
    },
  })
}
