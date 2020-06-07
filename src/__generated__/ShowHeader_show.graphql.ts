/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowHeader_show = {
    readonly slug: string;
    readonly internalID: string;
    readonly id: string;
    readonly name: string | null;
    readonly is_followed: boolean | null;
    readonly end_at: string | null;
    readonly exhibition_period: string | null;
    readonly isStubShow: boolean | null;
    readonly partner: {
        readonly name?: string | null;
        readonly slug?: string;
        readonly href?: string | null;
    } | null;
    readonly coverImage: {
        readonly url: string | null;
        readonly aspect_ratio: number;
    } | null;
    readonly images: ReadonlyArray<{
        readonly url: string | null;
        readonly aspect_ratio: number;
    } | null> | null;
    readonly followedArtists: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly artist: {
                    readonly name: string | null;
                    readonly href: string | null;
                    readonly slug: string;
                    readonly internalID: string;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly artists: ReadonlyArray<{
        readonly name: string | null;
        readonly href: string | null;
        readonly slug: string;
        readonly internalID: string;
    } | null> | null;
    readonly " $refType": "ShowHeader_show";
};
export type ShowHeader_show$data = ShowHeader_show;
export type ShowHeader_show$key = {
    readonly " $data"?: ShowHeader_show$data;
    readonly " $fragmentRefs": FragmentRefs<"ShowHeader_show">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v4 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": "aspect_ratio",
    "name": "aspectRatio",
    "args": null,
    "storageKey": null
  }
],
v5 = [
  (v2/*: any*/),
  (v3/*: any*/),
  (v0/*: any*/),
  (v1/*: any*/)
];
return {
  "kind": "Fragment",
  "name": "ShowHeader_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    (v2/*: any*/),
    {
      "kind": "ScalarField",
      "alias": "is_followed",
      "name": "isFollowed",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "end_at",
      "name": "endAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "exhibition_period",
      "name": "exhibitionPeriod",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isStubShow",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": [
            (v2/*: any*/),
            (v0/*: any*/),
            (v3/*: any*/)
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "coverImage",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": (v4/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "images",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": true,
      "selections": (v4/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": "followedArtists",
      "name": "followedArtistsConnection",
      "storageKey": "followedArtistsConnection(first:3)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 3
        }
      ],
      "concreteType": "ShowFollowArtistConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ShowFollowArtistEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "ShowFollowArtist",
              "plural": false,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "artist",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Artist",
                  "plural": false,
                  "selections": (v5/*: any*/)
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": (v5/*: any*/)
    }
  ]
};
})();
(node as any).hash = 'fd0f6f7275f3fb70bcbe35ae933fd0f9';
export default node;
