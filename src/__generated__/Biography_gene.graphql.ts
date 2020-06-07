/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Biography_gene = {
    readonly description: string | null;
    readonly " $refType": "Biography_gene";
};
export type Biography_gene$data = Biography_gene;
export type Biography_gene$key = {
    readonly " $data"?: Biography_gene$data;
    readonly " $fragmentRefs": FragmentRefs<"Biography_gene">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Biography_gene",
  "type": "Gene",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '50849d2daf12d006bf14b29f169ebd34';
export default node;
