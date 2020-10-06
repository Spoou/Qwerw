/* tslint:disable */
/* eslint-disable */
/* @relayHash da45826af61ddafe064146e96d04fe7e */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SearchEntity = "ARTICLE" | "ARTIST" | "ARTIST_SERIES" | "ARTWORK" | "CITY" | "COLLECTION" | "FAIR" | "FEATURE" | "GALLERY" | "GENE" | "INSTITUTION" | "PAGE" | "PROFILE" | "SALE" | "SHOW" | "TAG" | "%future added value";
export type AutosuggestResultsQueryVariables = {
    query: string;
    count: number;
    entities?: Array<SearchEntity | null> | null;
};
export type AutosuggestResultsQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"AutosuggestResults_results">;
};
export type AutosuggestResultsQuery = {
    readonly response: AutosuggestResultsQueryResponse;
    readonly variables: AutosuggestResultsQueryVariables;
};



/*
query AutosuggestResultsQuery(
  $query: String!
  $count: Int!
  $entities: [SearchEntity]
) {
  ...AutosuggestResults_results_2KyZFR
}

fragment AutosuggestResults_results_2KyZFR on Query {
  results: searchConnection(query: $query, mode: AUTOSUGGEST, first: $count, entities: $entities) {
    edges {
      node {
        imageUrl
        href
        displayLabel
        ... on SearchableItem {
          internalID
          displayType
          slug
        }
        ... on Node {
          id
        }
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "query",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "entities",
    "type": "[SearchEntity]",
    "defaultValue": null
  }
],
v1 = {
  "kind": "Variable",
  "name": "entities",
  "variableName": "entities"
},
v2 = {
  "kind": "Variable",
  "name": "query",
  "variableName": "query"
},
v3 = [
  (v1/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  {
    "kind": "Literal",
    "name": "mode",
    "value": "AUTOSUGGEST"
  },
  (v2/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "AutosuggestResultsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "FragmentSpread",
        "name": "AutosuggestResults_results",
        "args": [
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          (v1/*: any*/),
          (v2/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "AutosuggestResultsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "results",
        "name": "searchConnection",
        "storageKey": null,
        "args": (v3/*: any*/),
        "concreteType": "SearchableConnection",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "edges",
            "storageKey": null,
            "args": null,
            "concreteType": "SearchableEdge",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": null,
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "imageUrl",
                    "args": null,
                    "storageKey": null
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
                    "alias": null,
                    "name": "displayLabel",
                    "args": null,
                    "storageKey": null
                  },
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
                    "name": "__typename",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "SearchableItem",
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "internalID",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "displayType",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "slug",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
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
          },
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
                "name": "endCursor",
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
          }
        ]
      },
      {
        "kind": "LinkedHandle",
        "alias": "results",
        "name": "searchConnection",
        "args": (v3/*: any*/),
        "handle": "connection",
        "key": "AutosuggestResults_results",
        "filters": [
          "query",
          "mode",
          "entities"
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "AutosuggestResultsQuery",
    "id": "879c00e9535fca940c547bad41345e95",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'b0cfecc2b9235c28824c6ad6aa9d0a17';
export default node;
