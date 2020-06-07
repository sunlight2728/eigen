/* tslint:disable */
/* eslint-disable */
/* @relayHash b4e333cfdae93e7d5c4876fa368eaa36 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ImageCarouselTestsQueryVariables = {};
export type ImageCarouselTestsQueryResponse = {
    readonly artwork: {
        readonly images: ReadonlyArray<{
            readonly " $fragmentRefs": FragmentRefs<"ImageCarousel_images">;
        } | null> | null;
    } | null;
};
export type ImageCarouselTestsQueryRawResponse = {
    readonly artwork: ({
        readonly images: ReadonlyArray<({
            readonly url: string | null;
            readonly width: number | null;
            readonly height: number | null;
            readonly imageVersions: ReadonlyArray<string | null> | null;
            readonly deepZoom: ({
                readonly image: ({
                    readonly tileSize: number | null;
                    readonly url: string | null;
                    readonly format: string | null;
                    readonly size: ({
                        readonly width: number | null;
                        readonly height: number | null;
                    }) | null;
                }) | null;
            }) | null;
        }) | null> | null;
        readonly id: string | null;
    }) | null;
};
export type ImageCarouselTestsQuery = {
    readonly response: ImageCarouselTestsQueryResponse;
    readonly variables: ImageCarouselTestsQueryVariables;
    readonly rawResponse: ImageCarouselTestsQueryRawResponse;
};



/*
query ImageCarouselTestsQuery {
  artwork(id: "unused") {
    images {
      ...ImageCarousel_images
    }
    id
  }
}

fragment ImageCarousel_images on Image {
  url: imageURL
  width
  height
  imageVersions
  deepZoom {
    image: Image {
      tileSize: TileSize
      url: Url
      format: Format
      size: Size {
        width: Width
        height: Height
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "unused"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ImageCarouselTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"unused\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "images",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": true,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "ImageCarousel_images",
                "args": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ImageCarouselTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"unused\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "images",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": "url",
                "name": "imageURL",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "width",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "height",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "imageVersions",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "deepZoom",
                "storageKey": null,
                "args": null,
                "concreteType": "DeepZoom",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": "image",
                    "name": "Image",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "DeepZoomImage",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": "tileSize",
                        "name": "TileSize",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "url",
                        "name": "Url",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "format",
                        "name": "Format",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": "size",
                        "name": "Size",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "DeepZoomImageSize",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": "width",
                            "name": "Width",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "height",
                            "name": "Height",
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
          },
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
  "params": {
    "operationKind": "query",
    "name": "ImageCarouselTestsQuery",
    "id": "8792d37017c851a70dfa3671f759a20f",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '0f69d35c674ffe60f75fa008371a55c7';
export default node;
