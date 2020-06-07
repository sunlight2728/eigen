/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleListItem_sale = {
    readonly name: string | null;
    readonly href: string | null;
    readonly liveURLIfOpen: string | null;
    readonly liveStartAt: string | null;
    readonly displayTimelyAt: string | null;
    readonly coverImage: {
        readonly url: string | null;
    } | null;
    readonly " $refType": "SaleListItem_sale";
};
export type SaleListItem_sale$data = SaleListItem_sale;
export type SaleListItem_sale$key = {
    readonly " $data"?: SaleListItem_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleListItem_sale">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SaleListItem_sale",
  "type": "Sale",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "href",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "liveURLIfOpen",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "liveStartAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "displayTimelyAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "coverImage",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "large"
            }
          ],
          "storageKey": "url(version:\"large\")"
        }
      ]
    }
  ]
};
(node as any).hash = '05316e5bbded808509ab908b676ae8fe';
export default node;
