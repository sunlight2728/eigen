/* tslint:disable */
/* eslint-disable */
/* @relayHash 3e8d441d9209574d7ed22359a7b28e92 */

import { ConcreteRequest } from "relay-runtime";
export type CreditCardInput = {
    clientMutationId?: string | null;
    oneTimeUse?: boolean | null;
    token: string;
};
export type ConfirmBidCreateCreditCardMutationVariables = {
    input: CreditCardInput;
};
export type ConfirmBidCreateCreditCardMutationResponse = {
    readonly createCreditCard: {
        readonly creditCardOrError: {
            readonly creditCard?: {
                readonly internalID: string;
                readonly brand: string;
                readonly name: string | null;
                readonly last_digits: string;
                readonly expiration_month: number;
                readonly expiration_year: number;
            } | null;
            readonly mutationError?: {
                readonly type: string | null;
                readonly message: string | null;
                readonly detail: string | null;
            } | null;
        } | null;
    } | null;
};
export type ConfirmBidCreateCreditCardMutation = {
    readonly response: ConfirmBidCreateCreditCardMutationResponse;
    readonly variables: ConfirmBidCreateCreditCardMutationVariables;
};



/*
mutation ConfirmBidCreateCreditCardMutation(
  $input: CreditCardInput!
) {
  createCreditCard(input: $input) {
    creditCardOrError {
      __typename
      ... on CreditCardMutationSuccess {
        creditCard {
          internalID
          brand
          name
          last_digits: lastDigits
          expiration_month: expirationMonth
          expiration_year: expirationYear
          id
        }
      }
      ... on CreditCardMutationFailure {
        mutationError {
          type
          message
          detail
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "CreditCardInput!",
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
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "brand",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": "last_digits",
  "name": "lastDigits",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": "expiration_month",
  "name": "expirationMonth",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": "expiration_year",
  "name": "expirationYear",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "InlineFragment",
  "type": "CreditCardMutationFailure",
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "mutationError",
      "storageKey": null,
      "args": null,
      "concreteType": "GravityMutationError",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "type",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "message",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "detail",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ConfirmBidCreateCreditCardMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createCreditCard",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "CreditCardPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "creditCardOrError",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              {
                "kind": "InlineFragment",
                "type": "CreditCardMutationSuccess",
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "creditCard",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "CreditCard",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/)
                    ]
                  }
                ]
              },
              (v8/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ConfirmBidCreateCreditCardMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createCreditCard",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "CreditCardPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "creditCardOrError",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "__typename",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "type": "CreditCardMutationSuccess",
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "creditCard",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "CreditCard",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
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
              },
              (v8/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "ConfirmBidCreateCreditCardMutation",
    "id": "f489cab3e59f4336d6c66f8c43b94ff2",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'a6a9a07d13745be99d002fadbe49643e';
export default node;
