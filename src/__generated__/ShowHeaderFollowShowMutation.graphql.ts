/* tslint:disable */
/* eslint-disable */
/* @relayHash 830449dd116d4960701f1169d75ef876 */

import { ConcreteRequest } from "relay-runtime";
export type FollowShowInput = {
    clientMutationId?: string | null;
    partnerShowID?: string | null;
    unfollow?: boolean | null;
};
export type ShowHeaderFollowShowMutationVariables = {
    input: FollowShowInput;
};
export type ShowHeaderFollowShowMutationResponse = {
    readonly followShow: {
        readonly show: {
            readonly slug: string;
            readonly internalID: string;
            readonly is_followed: boolean | null;
        } | null;
    } | null;
};
export type ShowHeaderFollowShowMutation = {
    readonly response: ShowHeaderFollowShowMutationResponse;
    readonly variables: ShowHeaderFollowShowMutationVariables;
};



/*
mutation ShowHeaderFollowShowMutation(
  $input: FollowShowInput!
) {
  followShow(input: $input) {
    show {
      slug
      internalID
      is_followed: isFollowed
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "FollowShowInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
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
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": "is_followed",
  "name": "isFollowed",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ShowHeaderFollowShowMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "followShow",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "FollowShowPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "show",
            "storageKey": null,
            "args": null,
            "concreteType": "Show",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ShowHeaderFollowShowMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "followShow",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "FollowShowPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "show",
            "storageKey": null,
            "args": null,
            "concreteType": "Show",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "ShowHeaderFollowShowMutation",
    "id": "d6dcea734ed2c6dc355355d8a3a1c833",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'c6d7386195fa69df1834a4f120251101';
export default node;
