/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistConsignButton_artist = {
    readonly targetSupply: {
        readonly isInMicrofunnel: boolean | null;
        readonly isTargetSupply: boolean | null;
    } | null;
    readonly internalID: string;
    readonly slug: string;
    readonly name: string | null;
    readonly image: {
        readonly cropped: {
            readonly url: string | null;
        } | null;
    } | null;
    readonly " $refType": "ArtistConsignButton_artist";
};
export type ArtistConsignButton_artist$data = ArtistConsignButton_artist;
export type ArtistConsignButton_artist$key = {
    readonly " $data"?: ArtistConsignButton_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistConsignButton_artist">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtistConsignButton_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "targetSupply",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtistTargetSupply",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isInMicrofunnel",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isTargetSupply",
          "args": null,
          "storageKey": null
        }
      ]
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
      "name": "slug",
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
      "kind": "LinkedField",
      "alias": null,
      "name": "image",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "cropped",
          "storageKey": "cropped(height:66,width:66)",
          "args": [
            {
              "kind": "Literal",
              "name": "height",
              "value": 66
            },
            {
              "kind": "Literal",
              "name": "width",
              "value": 66
            }
          ],
          "concreteType": "CroppedImageUrl",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "url",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '23da8ebb4f46afb4d72e5014c4f9f2b5';
export default node;
