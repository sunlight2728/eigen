/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FollowArtistButton_artist = {
    readonly id: string;
    readonly slug: string;
    readonly internalID: string;
    readonly is_followed: boolean | null;
    readonly " $refType": "FollowArtistButton_artist";
};
export type FollowArtistButton_artist$data = FollowArtistButton_artist;
export type FollowArtistButton_artist$key = {
    readonly " $data"?: FollowArtistButton_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"FollowArtistButton_artist">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FollowArtistButton_artist",
  "type": "Artist",
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
      "alias": "is_followed",
      "name": "isFollowed",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '6a89e893f21a7504ee59138e10dcdc8e';
export default node;
