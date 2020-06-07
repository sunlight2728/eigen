/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Inquiry_artwork = {
    readonly slug: string;
    readonly internalID: string;
    readonly contact_message: string | null;
    readonly partner: {
        readonly name: string | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkPreview_artwork">;
    readonly " $refType": "Inquiry_artwork";
};
export type Inquiry_artwork$data = Inquiry_artwork;
export type Inquiry_artwork$key = {
    readonly " $data"?: Inquiry_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"Inquiry_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Inquiry_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "alias": "contact_message",
      "name": "contactMessage",
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
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkPreview_artwork",
      "args": null
    }
  ]
};
(node as any).hash = 'a45a56faecf5334e25bb1a35299c2a1d';
export default node;
