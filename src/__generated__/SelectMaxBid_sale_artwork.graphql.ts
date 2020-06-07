/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SelectMaxBid_sale_artwork = {
    readonly id: string;
    readonly increments: ReadonlyArray<{
        readonly display: string | null;
        readonly cents: number | null;
    } | null> | null;
    readonly " $fragmentRefs": FragmentRefs<"ConfirmBid_sale_artwork">;
    readonly " $refType": "SelectMaxBid_sale_artwork";
};
export type SelectMaxBid_sale_artwork$data = SelectMaxBid_sale_artwork;
export type SelectMaxBid_sale_artwork$key = {
    readonly " $data"?: SelectMaxBid_sale_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"SelectMaxBid_sale_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SelectMaxBid_sale_artwork",
  "type": "SaleArtwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "increments",
      "storageKey": "increments(useMyMaxBid:true)",
      "args": [
        {
          "kind": "Literal",
          "name": "useMyMaxBid",
          "value": true
        }
      ],
      "concreteType": "BidIncrementsFormatted",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "display",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "cents",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ConfirmBid_sale_artwork",
      "args": null
    }
  ]
};
(node as any).hash = 'da3f4c5b318013c4b3203bcd274c23bb';
export default node;
