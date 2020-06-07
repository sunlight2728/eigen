/* tslint:disable */
/* eslint-disable */
/* @relayHash d6aa41086433c7db293ad5021edc0e6b */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FollowArtistButtonTestsQueryVariables = {};
export type FollowArtistButtonTestsQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"FollowArtistButton_artist">;
    } | null;
};
export type FollowArtistButtonTestsQueryRawResponse = {
    readonly artist: ({
        readonly id: string;
        readonly slug: string;
        readonly internalID: string;
        readonly is_followed: boolean | null;
    }) | null;
};
export type FollowArtistButtonTestsQuery = {
    readonly response: FollowArtistButtonTestsQueryResponse;
    readonly variables: FollowArtistButtonTestsQueryVariables;
    readonly rawResponse: FollowArtistButtonTestsQueryRawResponse;
};



/*
query FollowArtistButtonTestsQuery {
  artist(id: "artistID") {
    ...FollowArtistButton_artist
    id
  }
}

fragment FollowArtistButton_artist on Artist {
  id
  slug
  internalID
  is_followed: isFollowed
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "artistID"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FollowArtistButtonTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": "artist(id:\"artistID\")",
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "FollowArtistButton_artist",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FollowArtistButtonTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": "artist(id:\"artistID\")",
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "plural": false,
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
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FollowArtistButtonTestsQuery",
    "id": "fd193e93b0118d71e98014c6426956a7",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'b8a4919d4f5e1e9039e03985edeccbad';
export default node;
