/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommercialPartnerInformation_artwork = {
    readonly availability: string | null;
    readonly isAcquireable: boolean | null;
    readonly isForSale: boolean | null;
    readonly isOfferable: boolean | null;
    readonly shippingOrigin: string | null;
    readonly shippingInfo: string | null;
    readonly priceIncludesTaxDisplay: string | null;
    readonly partner: {
        readonly name: string | null;
    } | null;
    readonly " $refType": "CommercialPartnerInformation_artwork";
};
export type CommercialPartnerInformation_artwork$data = CommercialPartnerInformation_artwork;
export type CommercialPartnerInformation_artwork$key = {
    readonly " $data"?: CommercialPartnerInformation_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"CommercialPartnerInformation_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CommercialPartnerInformation_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "availability",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isAcquireable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isForSale",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isOfferable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "shippingOrigin",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "shippingInfo",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "priceIncludesTaxDisplay",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": "Partner",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = 'f9a0bea135bd5f94a8aefee20b854c1e';
export default node;
