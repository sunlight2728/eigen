/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerOverview_partner = {
    readonly internalID: string;
    readonly name: string | null;
    readonly cities: ReadonlyArray<string | null> | null;
    readonly profile: {
        readonly bio: string | null;
    } | null;
    readonly counts: {
        readonly artists: number | null;
    } | null;
    readonly artists: {
        readonly pageInfo: {
            readonly hasNextPage: boolean;
            readonly startCursor: string | null;
            readonly endCursor: string | null;
        };
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly " $fragmentRefs": FragmentRefs<"ArtistListItem_artist">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"PartnerLocationSection_partner">;
    readonly " $refType": "PartnerOverview_partner";
};
export type PartnerOverview_partner$data = PartnerOverview_partner;
export type PartnerOverview_partner$key = {
    readonly " $data"?: PartnerOverview_partner$data;
    readonly " $fragmentRefs": FragmentRefs<"PartnerOverview_partner">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "PartnerOverview_partner",
  "type": "Partner",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "artists"
        ]
      }
    ]
  },
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": 10
    },
    {
      "kind": "LocalArgument",
      "name": "cursor",
      "type": "String",
      "defaultValue": null
    }
  ],
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
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "cities",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "profile",
      "storageKey": null,
      "args": null,
      "concreteType": "Profile",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "bio",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "PartnerCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artists",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "artists",
      "name": "__Partner_artists_connection",
      "storageKey": "__Partner_artists_connection(sort:\"SORTABLE_ID_ASC\")",
      "args": [
        {
          "kind": "Literal",
          "name": "sort",
          "value": "SORTABLE_ID_ASC"
        }
      ],
      "concreteType": "ArtistPartnerConnection",
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
              "name": "hasNextPage",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "startCursor",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "endCursor",
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
          "concreteType": "ArtistPartnerEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Artist",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "id",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "__typename",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "FragmentSpread",
                  "name": "ArtistListItem_artist",
                  "args": null
                }
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
      "kind": "FragmentSpread",
      "name": "PartnerLocationSection_partner",
      "args": null
    }
  ]
};
(node as any).hash = 'cd5cebde9ccf122843c16cc0d4dcb0f3';
export default node;
