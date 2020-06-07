/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeaturedArtists_collection = {
    readonly slug: string;
    readonly artworksConnection: {
        readonly merchandisableArtists: ReadonlyArray<{
            readonly internalID: string;
            readonly " $fragmentRefs": FragmentRefs<"ArtistListItem_artist">;
        } | null> | null;
    } | null;
    readonly query: {
        readonly artistIDs: ReadonlyArray<string> | null;
    };
    readonly featuredArtistExclusionIds: ReadonlyArray<string> | null;
    readonly " $refType": "FeaturedArtists_collection";
};
export type FeaturedArtists_collection$data = FeaturedArtists_collection;
export type FeaturedArtists_collection$key = {
    readonly " $data"?: FeaturedArtists_collection$data;
    readonly " $fragmentRefs": FragmentRefs<"FeaturedArtists_collection">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FeaturedArtists_collection",
  "type": "MarketingCollection",
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
      "kind": "LinkedField",
      "alias": null,
      "name": "artworksConnection",
      "storageKey": "artworksConnection(aggregations:[\"MERCHANDISABLE_ARTISTS\"],size:0,sort:\"-decayed_merch\")",
      "args": [
        {
          "kind": "Literal",
          "name": "aggregations",
          "value": [
            "MERCHANDISABLE_ARTISTS"
          ]
        },
        {
          "kind": "Literal",
          "name": "size",
          "value": 0
        },
        {
          "kind": "Literal",
          "name": "sort",
          "value": "-decayed_merch"
        }
      ],
      "concreteType": "FilterArtworksConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "merchandisableArtists",
          "storageKey": "merchandisableArtists(size:4)",
          "args": [
            {
              "kind": "Literal",
              "name": "size",
              "value": 4
            }
          ],
          "concreteType": "Artist",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "internalID",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "FragmentSpread",
              "name": "ArtistListItem_artist",
              "args": null
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "query",
      "storageKey": null,
      "args": null,
      "concreteType": "MarketingCollectionQuery",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artistIDs",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "featuredArtistExclusionIds",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'a7a18e885dd71078dd8c05ac099c50d1';
export default node;
