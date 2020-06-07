/* tslint:disable */
/* eslint-disable */
/* @relayHash 16b3523b78d832143fd4bd67fbc77353 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowArtistsPreviewTestsQueryVariables = {};
export type ShowArtistsPreviewTestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"ShowArtistsPreview_show">;
    } | null;
};
export type ShowArtistsPreviewTestsQueryRawResponse = {
    readonly show: ({
        readonly internalID: string;
        readonly slug: string;
        readonly artists: ReadonlyArray<({
            readonly id: string;
            readonly internalID: string;
            readonly slug: string;
            readonly href: string | null;
            readonly name: string | null;
            readonly initials: string | null;
            readonly is_followed: boolean | null;
            readonly nationality: string | null;
            readonly birthday: string | null;
            readonly deathday: string | null;
            readonly image: ({
                readonly url: string | null;
            }) | null;
        }) | null> | null;
        readonly artists_without_artworks: ReadonlyArray<({
            readonly id: string;
            readonly internalID: string;
            readonly slug: string;
            readonly href: string | null;
            readonly name: string | null;
            readonly initials: string | null;
            readonly is_followed: boolean | null;
            readonly nationality: string | null;
            readonly birthday: string | null;
            readonly deathday: string | null;
            readonly image: ({
                readonly url: string | null;
            }) | null;
        }) | null> | null;
        readonly id: string | null;
    }) | null;
};
export type ShowArtistsPreviewTestsQuery = {
    readonly response: ShowArtistsPreviewTestsQueryResponse;
    readonly variables: ShowArtistsPreviewTestsQueryVariables;
    readonly rawResponse: ShowArtistsPreviewTestsQueryRawResponse;
};



/*
query ShowArtistsPreviewTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    ...ShowArtistsPreview_show
    id
  }
}

fragment ArtistListItem_artist on Artist {
  id
  internalID
  slug
  name
  initials
  href
  is_followed: isFollowed
  nationality
  birthday
  deathday
  image {
    url
  }
}

fragment ShowArtistsPreview_show on Show {
  internalID
  slug
  artists {
    id
    internalID
    slug
    href
    ...ArtistListItem_artist
  }
  artists_without_artworks: artistsWithoutArtworks {
    id
    internalID
    slug
    href
    ...ArtistListItem_artist
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "anderson-fine-art-gallery-flickinger-collection"
  }
],
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
  "name": "slug",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = [
  (v3/*: any*/),
  (v1/*: any*/),
  (v2/*: any*/),
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
    "name": "name",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "initials",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": "is_followed",
    "name": "isFollowed",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "nationality",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "birthday",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "deathday",
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
        "kind": "ScalarField",
        "alias": null,
        "name": "url",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ShowArtistsPreviewTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ShowArtistsPreview_show",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ShowArtistsPreviewTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": (v4/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": "artists_without_artworks",
            "name": "artistsWithoutArtworks",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": (v4/*: any*/)
          },
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ShowArtistsPreviewTestsQuery",
    "id": "4dc5bb7b20b8372673e592dd93fc284c",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '2508f0f726263c27cb498e2f47cc504c';
export default node;
