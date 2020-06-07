/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairMoreInfo_fair = {
    readonly organizer: {
        readonly website: string | null;
    } | null;
    readonly slug: string;
    readonly internalID: string;
    readonly about: string | null;
    readonly ticketsLink: string | null;
    readonly " $refType": "FairMoreInfo_fair";
};
export type FairMoreInfo_fair$data = FairMoreInfo_fair;
export type FairMoreInfo_fair$key = {
    readonly " $data"?: FairMoreInfo_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"FairMoreInfo_fair">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FairMoreInfo_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "organizer",
      "storageKey": null,
      "args": null,
      "concreteType": "organizer",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "website",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
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
      "name": "about",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "ticketsLink",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '70077522c1800bfee9ee140deea2aabd';
export default node;
