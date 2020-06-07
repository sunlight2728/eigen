/* tslint:disable */
/* eslint-disable */
/* @relayHash c73e04a1cb0bda51d2d16a506edc96dc */

import { ConcreteRequest } from "relay-runtime";
export type FiltersTestsQueryVariables = {};
export type FiltersTestsQueryResponse = {
    readonly show: {
        readonly id: string;
    } | null;
};
export type FiltersTestsQueryRawResponse = {
    readonly show: ({
        readonly id: string;
    }) | null;
};
export type FiltersTestsQuery = {
    readonly response: FiltersTestsQueryResponse;
    readonly variables: FiltersTestsQueryVariables;
    readonly rawResponse: FiltersTestsQueryRawResponse;
};



/*
query FiltersTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "show",
    "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
    "args": [
      {
        "kind": "Literal",
        "name": "id",
        "value": "anderson-fine-art-gallery-flickinger-collection"
      }
    ],
    "concreteType": "Show",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "id",
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
    "name": "FiltersTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "FiltersTestsQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "FiltersTestsQuery",
    "id": "0690e06ee79f5c42829d0b519d4df860",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '6a8f5448c878b9bd72c34520bb8256d1';
export default node;
