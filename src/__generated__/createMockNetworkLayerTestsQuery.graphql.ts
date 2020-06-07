/* tslint:disable */
/* eslint-disable */
/* @relayHash 8d77d17b72cd364eb93213fd7f4a5b31 */

import { ConcreteRequest } from "relay-runtime";
export type createMockNetworkLayerTestsQueryVariables = {};
export type createMockNetworkLayerTestsQueryResponse = {
    readonly artwork: {
        readonly id: string;
        readonly title: string | null;
    } | null;
};
export type createMockNetworkLayerTestsQuery = {
    readonly response: createMockNetworkLayerTestsQueryResponse;
    readonly variables: createMockNetworkLayerTestsQueryVariables;
};



/*
query createMockNetworkLayerTestsQuery {
  artwork(id: "untitled") {
    id
    title
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "artwork",
    "storageKey": "artwork(id:\"untitled\")",
    "args": [
      {
        "kind": "Literal",
        "name": "id",
        "value": "untitled"
      }
    ],
    "concreteType": "Artwork",
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
        "name": "title",
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
    "name": "createMockNetworkLayerTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "createMockNetworkLayerTestsQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "createMockNetworkLayerTestsQuery",
    "id": "0de7f21178b2e07411e95edac6027432",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '1eeffdf1d257e48e4d0b0d33a8f7a7f8';
export default node;
