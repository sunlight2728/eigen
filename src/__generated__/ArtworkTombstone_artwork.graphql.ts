/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkTombstone_artwork = {
    readonly title: string | null;
    readonly isInAuction: boolean | null;
    readonly medium: string | null;
    readonly date: string | null;
    readonly cultural_maker: string | null;
    readonly saleArtwork: {
        readonly lotLabel: string | null;
        readonly estimate: string | null;
    } | null;
    readonly partner: {
        readonly name: string | null;
    } | null;
    readonly sale: {
        readonly isClosed: boolean | null;
    } | null;
    readonly artists: ReadonlyArray<{
        readonly name: string | null;
        readonly href: string | null;
        readonly " $fragmentRefs": FragmentRefs<"FollowArtistButton_artist">;
    } | null> | null;
    readonly dimensions: {
        readonly in: string | null;
        readonly cm: string | null;
    } | null;
    readonly edition_of: string | null;
    readonly attribution_class: {
        readonly shortDescription: string | null;
    } | null;
    readonly " $refType": "ArtworkTombstone_artwork";
};
export type ArtworkTombstone_artwork$data = ArtworkTombstone_artwork;
export type ArtworkTombstone_artwork$key = {
    readonly " $data"?: ArtworkTombstone_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkTombstone_artwork">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ArtworkTombstone_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isInAuction",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "medium",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "date",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "cultural_maker",
      "name": "culturalMaker",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "saleArtwork",
      "storageKey": null,
      "args": null,
      "concreteType": "SaleArtwork",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "lotLabel",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "estimate",
          "args": null,
          "storageKey": null
        }
      ]
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
        (v0/*: any*/)
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "sale",
      "storageKey": null,
      "args": null,
      "concreteType": "Sale",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isClosed",
          "args": null,
          "storageKey": null
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
      "selections": [
        (v0/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "href",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "FragmentSpread",
          "name": "FollowArtistButton_artist",
          "args": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "dimensions",
      "storageKey": null,
      "args": null,
      "concreteType": "dimensions",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "in",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "cm",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": "edition_of",
      "name": "editionOf",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "attribution_class",
      "name": "attributionClass",
      "storageKey": null,
      "args": null,
      "concreteType": "AttributionClass",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "shortDescription",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
})();
(node as any).hash = '12c6ef0636ca72af76ba1dcff04d8838';
export default node;
