/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionArtistSeriesRail_collectionGroup = {
    readonly name: string;
    readonly members: ReadonlyArray<{
        readonly slug: string;
        readonly id: string;
        readonly title: string;
        readonly priceGuidance: number | null;
        readonly artworksConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly title: string | null;
                    readonly image: {
                        readonly url: string | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
    }>;
    readonly " $refType": "CollectionArtistSeriesRail_collectionGroup";
};
export type CollectionArtistSeriesRail_collectionGroup$data = CollectionArtistSeriesRail_collectionGroup;
export type CollectionArtistSeriesRail_collectionGroup$key = {
    readonly " $data"?: CollectionArtistSeriesRail_collectionGroup$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionArtistSeriesRail_collectionGroup">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "CollectionArtistSeriesRail_collectionGroup",
  "type": "MarketingCollectionGroup",
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
      "kind": "LinkedField",
      "alias": null,
      "name": "members",
      "storageKey": null,
      "args": null,
      "concreteType": "MarketingCollection",
      "plural": true,
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
          "name": "id",
          "args": null,
          "storageKey": null
        },
        (v0/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "priceGuidance",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "artworksConnection",
          "storageKey": "artworksConnection(aggregations:[\"TOTAL\"],first:3,sort:\"-decayed_merch\")",
          "args": [
            {
              "kind": "Literal",
              "name": "aggregations",
              "value": [
                "TOTAL"
              ]
            },
            {
              "kind": "Literal",
              "name": "first",
              "value": 3
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
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "FilterArtworksEdge",
              "plural": true,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "node",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Artwork",
                  "plural": false,
                  "selections": [
                    (v0/*: any*/),
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
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '3b5d0b3f36b2c464bd7f265edc79a781';
export default node;
