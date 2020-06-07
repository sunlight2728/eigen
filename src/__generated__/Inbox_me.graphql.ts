/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Inbox_me = {
    readonly lot_standings: ReadonlyArray<{
        readonly most_recent_bid: {
            readonly id: string;
        } | null;
    } | null> | null;
    readonly conversations_existence_check: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly internalID: string | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"Conversations_me" | "ActiveBids_me">;
    readonly " $refType": "Inbox_me";
};
export type Inbox_me$data = Inbox_me;
export type Inbox_me$key = {
    readonly " $data"?: Inbox_me$data;
    readonly " $fragmentRefs": FragmentRefs<"Inbox_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Inbox_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "lot_standings",
      "name": "lotStandings",
      "storageKey": "lotStandings(live:true)",
      "args": [
        {
          "kind": "Literal",
          "name": "live",
          "value": true
        }
      ],
      "concreteType": "LotStanding",
      "plural": true,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "most_recent_bid",
          "name": "mostRecentBid",
          "storageKey": null,
          "args": null,
          "concreteType": "BidderPosition",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "id",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "conversations_existence_check",
      "name": "conversationsConnection",
      "storageKey": "conversationsConnection(first:1)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        }
      ],
      "concreteType": "ConversationConnection",
      "plural": false,
      "selections": [
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
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "Conversations_me",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ActiveBids_me",
      "args": null
    }
  ]
};
(node as any).hash = 'fc3a51501e74ad6cd70d9cb1a4fa9f85';
export default node;
