/* tslint:disable */
/* eslint-disable */
/* @relayHash 63b5263e5c256dd9db7a374d176d70fe */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FavoriteShowsQueryVariables = {};
export type FavoriteShowsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"Shows_me">;
    } | null;
};
export type FavoriteShowsQuery = {
    readonly response: FavoriteShowsQueryResponse;
    readonly variables: FavoriteShowsQueryVariables;
};



/*
query FavoriteShowsQuery {
  me {
    ...Shows_me
    id
  }
}

fragment ShowItemRow_show on Show {
  id
  slug
  internalID
  is_followed: isFollowed
  name
  isStubShow
  partner {
    __typename
    ... on Partner {
      name
      profile {
        image {
          url(version: "square")
        }
        id
      }
    }
    ... on Node {
      id
    }
    ... on ExternalPartner {
      id
    }
  }
  href
  exhibition_period: exhibitionPeriod
  status
  cover_image: coverImage {
    url
  }
  is_fair_booth: isFairBooth
  end_at: endAt
}

fragment Shows_me on Me {
  followsAndSaves {
    shows: showsConnection(first: 10) {
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
      }
      edges {
        node {
          id
          ...ShowItemRow_show
          __typename
        }
        cursor
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
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
  "name": "__typename",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FavoriteShowsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Shows_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FavoriteShowsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "followsAndSaves",
            "storageKey": null,
            "args": null,
            "concreteType": "FollowsAndSaves",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": "shows",
                "name": "showsConnection",
                "storageKey": "showsConnection(first:10)",
                "args": (v0/*: any*/),
                "concreteType": "FollowedShowConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "pageInfo",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "startCursor",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "endCursor",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "hasPreviousPage",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "hasNextPage",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "FollowedShowEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Show",
                        "plural": false,
                        "selections": [
                          (v1/*: any*/),
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
                          },
                          (v2/*: any*/),
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
                              (v3/*: any*/),
                              (v1/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "type": "Partner",
                                "selections": [
                                  (v2/*: any*/),
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "profile",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Profile",
                                    "plural": false,
                                    "selections": [
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
                                            "args": [
                                              {
                                                "kind": "Literal",
                                                "name": "version",
                                                "value": "square"
                                              }
                                            ],
                                            "storageKey": "url(version:\"square\")"
                                          }
                                        ]
                                      },
                                      (v1/*: any*/)
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "href",
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
                            "name": "status",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": "cover_image",
                            "name": "coverImage",
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
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "is_fair_booth",
                            "name": "isFairBooth",
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
                          (v3/*: any*/)
                        ]
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "cursor",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": "shows",
                "name": "showsConnection",
                "args": (v0/*: any*/),
                "handle": "connection",
                "key": "SavedShows_shows",
                "filters": null
              }
            ]
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FavoriteShowsQuery",
    "id": "8f38701cdeaa1d14d8efb1a371d8e01a",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '6dbdf618a8913e9625487bb6719e165f';
export default node;
