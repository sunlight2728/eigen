/* tslint:disable */
/* eslint-disable */
/* @relayHash 5826dd9b4889a64491e04198004a88dc */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConversationsQueryVariables = {
    count: number;
    cursor?: string | null;
};
export type ConversationsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"Conversations_me">;
    } | null;
};
export type ConversationsQuery = {
    readonly response: ConversationsQueryResponse;
    readonly variables: ConversationsQueryVariables;
};



/*
query ConversationsQuery(
  $count: Int!
  $cursor: String
) {
  me {
    ...Conversations_me_1G22uz
    id
  }
}

fragment ConversationSnippet_conversation on Conversation {
  internalID
  to {
    name
    id
  }
  lastMessage
  lastMessageAt
  unread
  items {
    item {
      __typename
      ... on Artwork {
        date
        title
        artistNames
        image {
          url
        }
      }
      ... on Show {
        fair {
          name
          id
        }
        name
        coverImage {
          url
        }
      }
      ... on Node {
        id
      }
    }
  }
}

fragment Conversations_me_1G22uz on Me {
  conversations: conversationsConnection(first: $count, after: $cursor) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        internalID
        last_message: lastMessage
        ...ConversationSnippet_conversation
        id
        __typename
      }
      cursor
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "cursor",
    "type": "String",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = [
  (v2/*: any*/),
  (v3/*: any*/)
],
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v6 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ConversationsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Conversations_me",
            "args": [
              {
                "kind": "Variable",
                "name": "count",
                "variableName": "count"
              },
              {
                "kind": "Variable",
                "name": "cursor",
                "variableName": "cursor"
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ConversationsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": "conversations",
            "name": "conversationsConnection",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "ConversationConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pageInfo",
                "storageKey": null,
                "args": null,
                "concreteType": "PageInfo",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "endCursor",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "hasNextPage",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ConversationEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Conversation",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "internalID",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "last_message",
                        "name": "lastMessage",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "to",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "ConversationResponder",
                        "plural": false,
                        "selections": (v4/*: any*/)
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "lastMessage",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "lastMessageAt",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "unread",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "items",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "ConversationItem",
                        "plural": true,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "item",
                            "storageKey": null,
                            "args": null,
                            "concreteType": null,
                            "plural": false,
                            "selections": [
                              (v5/*: any*/),
                              (v3/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "type": "Artwork",
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "date",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "title",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "artistNames",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "image",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Image",
                                    "plural": false,
                                    "selections": (v6/*: any*/)
                                  }
                                ]
                              },
                              {
                                "kind": "InlineFragment",
                                "type": "Show",
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "fair",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Fair",
                                    "plural": false,
                                    "selections": (v4/*: any*/)
                                  },
                                  (v2/*: any*/),
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "coverImage",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Image",
                                    "plural": false,
                                    "selections": (v6/*: any*/)
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      (v3/*: any*/),
                      (v5/*: any*/)
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "cursor",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "conversations",
            "name": "conversationsConnection",
            "args": (v1/*: any*/),
            "handle": "connection",
            "key": "Conversations_conversations",
            "filters": null
          },
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ConversationsQuery",
    "id": "a50bbadafca9ca9b89e2e53b2058eb4b",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '82b85cf4af654ade37df29ccb3f139d6';
export default node;
