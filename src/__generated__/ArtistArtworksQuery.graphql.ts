/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash a85461f8b26cea472b22e88705774342 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistArtworksQueryVariables = {
    id: string;
    count: number;
    cursor?: string | null;
    sort?: string | null;
    additionalGeneIDs?: Array<string | null> | null;
    priceRange?: string | null;
    color?: string | null;
    colors?: Array<string | null> | null;
    partnerID?: string | null;
    partnerIDs?: Array<string | null> | null;
    dimensionRange?: string | null;
    majorPeriods?: Array<string | null> | null;
    acquireable?: boolean | null;
    inquireableOnly?: boolean | null;
    atAuction?: boolean | null;
    offerable?: boolean | null;
    attributionClass?: Array<string | null> | null;
};
export type ArtistArtworksQueryResponse = {
    readonly node: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistArtworks_artist">;
    } | null;
};
export type ArtistArtworksQuery = {
    readonly response: ArtistArtworksQueryResponse;
    readonly variables: ArtistArtworksQueryVariables;
};



/*
query ArtistArtworksQuery(
  $id: ID!
  $count: Int!
  $cursor: String
  $sort: String
  $additionalGeneIDs: [String]
  $priceRange: String
  $color: String
  $colors: [String]
  $partnerID: ID
  $partnerIDs: [String]
  $dimensionRange: String
  $majorPeriods: [String]
  $acquireable: Boolean
  $inquireableOnly: Boolean
  $atAuction: Boolean
  $offerable: Boolean
  $attributionClass: [String]
) {
  node(id: $id) {
    __typename
    ... on Artist {
      ...ArtistArtworks_artist_1qqVY9
    }
    id
  }
}

fragment ArtistArtworks_artist_1qqVY9 on Artist {
  id
  slug
  internalID
  artworks: filterArtworksConnection(first: $count, after: $cursor, sort: $sort, additionalGeneIDs: $additionalGeneIDs, priceRange: $priceRange, color: $color, colors: $colors, partnerID: $partnerID, partnerIDs: $partnerIDs, dimensionRange: $dimensionRange, majorPeriods: $majorPeriods, acquireable: $acquireable, inquireableOnly: $inquireableOnly, atAuction: $atAuction, offerable: $offerable, aggregations: [COLOR, DIMENSION_RANGE, PARTNER, MAJOR_PERIOD, MEDIUM, PRICE_RANGE], attributionClass: $attributionClass) {
    aggregations {
      slice
      counts {
        count
        name
        value
      }
    }
    edges {
      node {
        id
        __typename
      }
      cursor
    }
    counts {
      total
    }
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
    id
  }
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  saleMessage
  slug
  internalID
  artistNames
  href
  sale {
    isAuction
    isClosed
    displayTimelyAt
    endAt
    id
  }
  saleArtwork {
    counts {
      bidderPositions
    }
    currentBid {
      display
    }
    lotLabel
    id
  }
  partner {
    name
    id
  }
  image {
    url(version: "large")
    aspectRatio
  }
}

fragment InfiniteScrollArtworksGrid_connection on ArtworkConnectionInterface {
  __isArtworkConnectionInterface: __typename
  pageInfo {
    hasNextPage
    startCursor
    endCursor
  }
  edges {
    __typename
    node {
      slug
      id
      image {
        aspectRatio
      }
      ...ArtworkGridItem_artwork
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "acquireable"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "additionalGeneIDs"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "atAuction"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "attributionClass"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "color"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "colors"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cursor"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "dimensionRange"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "inquireableOnly"
},
v11 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "majorPeriods"
},
v12 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "offerable"
},
v13 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "partnerID"
},
v14 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "partnerIDs"
},
v15 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "priceRange"
},
v16 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sort"
},
v17 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v18 = {
  "kind": "Variable",
  "name": "acquireable",
  "variableName": "acquireable"
},
v19 = {
  "kind": "Variable",
  "name": "additionalGeneIDs",
  "variableName": "additionalGeneIDs"
},
v20 = {
  "kind": "Variable",
  "name": "atAuction",
  "variableName": "atAuction"
},
v21 = {
  "kind": "Variable",
  "name": "attributionClass",
  "variableName": "attributionClass"
},
v22 = {
  "kind": "Variable",
  "name": "color",
  "variableName": "color"
},
v23 = {
  "kind": "Variable",
  "name": "colors",
  "variableName": "colors"
},
v24 = {
  "kind": "Variable",
  "name": "dimensionRange",
  "variableName": "dimensionRange"
},
v25 = {
  "kind": "Variable",
  "name": "inquireableOnly",
  "variableName": "inquireableOnly"
},
v26 = {
  "kind": "Variable",
  "name": "majorPeriods",
  "variableName": "majorPeriods"
},
v27 = {
  "kind": "Variable",
  "name": "offerable",
  "variableName": "offerable"
},
v28 = {
  "kind": "Variable",
  "name": "partnerID",
  "variableName": "partnerID"
},
v29 = {
  "kind": "Variable",
  "name": "partnerIDs",
  "variableName": "partnerIDs"
},
v30 = {
  "kind": "Variable",
  "name": "priceRange",
  "variableName": "priceRange"
},
v31 = {
  "kind": "Variable",
  "name": "sort",
  "variableName": "sort"
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v36 = [
  (v18/*: any*/),
  (v19/*: any*/),
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Literal",
    "name": "aggregations",
    "value": [
      "COLOR",
      "DIMENSION_RANGE",
      "PARTNER",
      "MAJOR_PERIOD",
      "MEDIUM",
      "PRICE_RANGE"
    ]
  },
  (v20/*: any*/),
  (v21/*: any*/),
  (v22/*: any*/),
  (v23/*: any*/),
  (v24/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  (v25/*: any*/),
  (v26/*: any*/),
  (v27/*: any*/),
  (v28/*: any*/),
  (v29/*: any*/),
  (v30/*: any*/),
  (v31/*: any*/)
],
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/),
      (v13/*: any*/),
      (v14/*: any*/),
      (v15/*: any*/),
      (v16/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistArtworksQuery",
    "selections": [
      {
        "alias": null,
        "args": (v17/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "args": [
                  (v18/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/),
                  (v21/*: any*/),
                  (v22/*: any*/),
                  (v23/*: any*/),
                  {
                    "kind": "Variable",
                    "name": "count",
                    "variableName": "count"
                  },
                  {
                    "kind": "Variable",
                    "name": "cursor",
                    "variableName": "cursor"
                  },
                  (v24/*: any*/),
                  (v25/*: any*/),
                  (v26/*: any*/),
                  (v27/*: any*/),
                  (v28/*: any*/),
                  (v29/*: any*/),
                  (v30/*: any*/),
                  (v31/*: any*/)
                ],
                "kind": "FragmentSpread",
                "name": "ArtistArtworks_artist"
              }
            ],
            "type": "Artist",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v9/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v16/*: any*/),
      (v1/*: any*/),
      (v15/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v13/*: any*/),
      (v14/*: any*/),
      (v8/*: any*/),
      (v11/*: any*/),
      (v0/*: any*/),
      (v10/*: any*/),
      (v2/*: any*/),
      (v12/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "ArtistArtworksQuery",
    "selections": [
      {
        "alias": null,
        "args": (v17/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v32/*: any*/),
          (v33/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v34/*: any*/),
              (v35/*: any*/),
              {
                "alias": "artworks",
                "args": (v36/*: any*/),
                "concreteType": "FilterArtworksConnection",
                "kind": "LinkedField",
                "name": "filterArtworksConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArtworksAggregationResults",
                    "kind": "LinkedField",
                    "name": "aggregations",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "slice",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AggregationCount",
                        "kind": "LinkedField",
                        "name": "counts",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "count",
                            "storageKey": null
                          },
                          (v37/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "value",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FilterArtworksEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v33/*: any*/),
                          (v32/*: any*/)
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
                    "concreteType": "FilterArtworksCounts",
                    "kind": "LinkedField",
                    "name": "counts",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "total",
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
                  },
                  (v33/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "selections": [
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
                            "name": "startCursor",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          (v32/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v34/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Image",
                                "kind": "LinkedField",
                                "name": "image",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "aspectRatio",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "version",
                                        "value": "large"
                                      }
                                    ],
                                    "kind": "ScalarField",
                                    "name": "url",
                                    "storageKey": "url(version:\"large\")"
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "title",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "date",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "saleMessage",
                                "storageKey": null
                              },
                              (v35/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "artistNames",
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
                                "concreteType": "Sale",
                                "kind": "LinkedField",
                                "name": "sale",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "isAuction",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "isClosed",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "displayTimelyAt",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "endAt",
                                    "storageKey": null
                                  },
                                  (v33/*: any*/)
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "SaleArtwork",
                                "kind": "LinkedField",
                                "name": "saleArtwork",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "SaleArtworkCounts",
                                    "kind": "LinkedField",
                                    "name": "counts",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "bidderPositions",
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "SaleArtworkCurrentBid",
                                    "kind": "LinkedField",
                                    "name": "currentBid",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "display",
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "lotLabel",
                                    "storageKey": null
                                  },
                                  (v33/*: any*/)
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Partner",
                                "kind": "LinkedField",
                                "name": "partner",
                                "plural": false,
                                "selections": [
                                  (v37/*: any*/),
                                  (v33/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v33/*: any*/)
                            ],
                            "type": "Node",
                            "abstractKey": "__isNode"
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "type": "ArtworkConnectionInterface",
                    "abstractKey": "__isArtworkConnectionInterface"
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "artworks",
                "args": (v36/*: any*/),
                "filters": [
                  "sort",
                  "additionalGeneIDs",
                  "priceRange",
                  "color",
                  "colors",
                  "partnerID",
                  "partnerIDs",
                  "dimensionRange",
                  "majorPeriods",
                  "acquireable",
                  "inquireableOnly",
                  "atAuction",
                  "offerable",
                  "aggregations",
                  "attributionClass"
                ],
                "handle": "connection",
                "key": "ArtistArtworksGrid_artworks",
                "kind": "LinkedHandle",
                "name": "filterArtworksConnection"
              }
            ],
            "type": "Artist",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "a85461f8b26cea472b22e88705774342",
    "metadata": {},
    "name": "ArtistArtworksQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'fdce66f7aa4d33bb47f098f4629b14fb';
export default node;
