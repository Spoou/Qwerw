/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AutosuggestResults_results = {
    readonly results: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly imageUrl: string | null;
                readonly href: string | null;
                readonly displayLabel: string | null;
                readonly internalID?: string;
                readonly displayType?: string | null;
                readonly slug?: string;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "AutosuggestResults_results";
};
export type AutosuggestResults_results$data = AutosuggestResults_results;
export type AutosuggestResults_results$key = {
    readonly " $data"?: AutosuggestResults_results$data;
    readonly " $fragmentRefs": FragmentRefs<"AutosuggestResults_results">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    },
    {
      "defaultValue": [
        "ARTIST",
        "ARTWORK",
        "FAIR",
        "GENE",
        "SALE",
        "PROFILE",
        "COLLECTION"
      ],
      "kind": "LocalArgument",
      "name": "entities"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "query"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "results"
        ]
      }
    ]
  },
  "name": "AutosuggestResults_results",
  "selections": [
    {
      "alias": "results",
      "args": [
        {
          "kind": "Variable",
          "name": "entities",
          "variableName": "entities"
        },
        {
          "kind": "Literal",
          "name": "mode",
          "value": "AUTOSUGGEST"
        },
        {
          "kind": "Variable",
          "name": "query",
          "variableName": "query"
        }
      ],
      "concreteType": "SearchableConnection",
      "kind": "LinkedField",
      "name": "__AutosuggestResults_results_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "SearchableEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": null,
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "imageUrl",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "href",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "displayLabel",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                },
                {
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "internalID",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "displayType",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "slug",
                      "storageKey": null
                    }
                  ],
                  "type": "SearchableItem",
                  "abstractKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
(node as any).hash = 'bb0ab705d1bba72b6c1441320beaee09';
export default node;
