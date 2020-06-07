/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type BidButton_artwork = {
    readonly slug: string;
    readonly sale: {
        readonly slug: string;
        readonly registrationStatus: {
            readonly qualifiedForBidding: boolean | null;
        } | null;
        readonly isPreview: boolean | null;
        readonly isLiveOpen: boolean | null;
        readonly isClosed: boolean | null;
        readonly isRegistrationClosed: boolean | null;
        readonly requireIdentityVerification: boolean | null;
    } | null;
    readonly myLotStanding: ReadonlyArray<{
        readonly mostRecentBid: {
            readonly maxBid: {
                readonly cents: number | null;
            } | null;
        } | null;
    }> | null;
    readonly saleArtwork: {
        readonly increments: ReadonlyArray<{
            readonly cents: number | null;
        } | null> | null;
    } | null;
    readonly " $refType": "BidButton_artwork";
};
export type BidButton_artwork$data = BidButton_artwork;
export type BidButton_artwork$key = {
    readonly " $data"?: BidButton_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"BidButton_artwork">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v1 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "cents",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "BidButton_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "sale",
      "storageKey": null,
      "args": null,
      "concreteType": "Sale",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "registrationStatus",
          "storageKey": null,
          "args": null,
          "concreteType": "Bidder",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "qualifiedForBidding",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isPreview",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isLiveOpen",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isClosed",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isRegistrationClosed",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "requireIdentityVerification",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "myLotStanding",
      "storageKey": "myLotStanding(live:true)",
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
          "alias": null,
          "name": "mostRecentBid",
          "storageKey": null,
          "args": null,
          "concreteType": "BidderPosition",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "maxBid",
              "storageKey": null,
              "args": null,
              "concreteType": "BidderPositionMaxBid",
              "plural": false,
              "selections": (v1/*: any*/)
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "saleArtwork",
      "storageKey": null,
      "args": null,
      "concreteType": "SaleArtwork",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "increments",
          "storageKey": null,
          "args": null,
          "concreteType": "BidIncrementsFormatted",
          "plural": true,
          "selections": (v1/*: any*/)
        }
      ]
    }
  ]
};
})();
(node as any).hash = '156fcfc4be3111c9e9bc130b3fafeeb2';
export default node;
