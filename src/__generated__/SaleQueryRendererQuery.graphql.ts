/* tslint:disable */
/* eslint-disable */
/* @relayHash 1fa1c3059ab032d91c3fd3ff14aaad97 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleQueryRendererQueryVariables = {
    saleID: string;
};
export type SaleQueryRendererQueryResponse = {
    readonly sale: {
        readonly " $fragmentRefs": FragmentRefs<"Sale_sale">;
    } | null;
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"Sale_me">;
    } | null;
};
export type SaleQueryRendererQuery = {
    readonly response: SaleQueryRendererQueryResponse;
    readonly variables: SaleQueryRendererQueryVariables;
};



/*
query SaleQueryRendererQuery(
  $saleID: String!
) {
  sale(id: $saleID) {
    ...Sale_sale
    id
  }
  me {
    ...Sale_me
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
      id
    }
  }
}

fragment RegisterToBidButton_sale on Sale {
  slug
  startAt
  endAt
  requireIdentityVerification
  registrationStatus {
    qualifiedForBidding
    id
  }
}

fragment SaleArtworkListItem_artwork on Artwork {
  artistNames
  date
  href
  image {
    small: url(version: "small")
    aspectRatio
    height
    width
  }
  saleMessage
  slug
  title
  internalID
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
}

fragment SaleArtworkList_connection on ArtworkConnectionInterface {
  edges {
    __typename
    node {
      id
      ...SaleArtworkListItem_artwork
    }
    ... on Node {
      id
    }
  }
}

fragment SaleArtworkTileRailCard_saleArtwork on SaleArtwork {
  artwork {
    artistNames
    date
    href
    image {
      imageURL: url(version: "small")
      aspectRatio
    }
    internalID
    slug
    saleMessage
    title
    id
  }
  counts {
    bidderPositions
  }
  currentBid {
    display
  }
  lotLabel
  sale {
    isAuction
    isClosed
    displayTimelyAt
    id
  }
}

fragment SaleArtworksRail_me on Me {
  saleArtworksRail: lotsByFollowedArtistsConnection(first: 10, includeArtworksByFollowedArtists: true) {
    edges {
      node {
        id
        href
        saleArtwork {
          ...SaleArtworkTileRailCard_saleArtwork
          id
        }
      }
      id
    }
  }
}

fragment SaleHeader_sale on Sale {
  name
  internalID
  liveStartAt
  endAt
  startAt
  timeZone
  coverImage {
    url
  }
}

fragment SaleLotsList_me on Me {
  lotsByFollowedArtistsConnection(first: 10, liveSale: true, isAuction: true, includeArtworksByFollowedArtists: false) {
    edges {
      cursor
      node {
        __typename
        id
      }
      id
    }
    ...SaleArtworkList_connection
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment Sale_me on Me {
  ...SaleArtworksRail_me
  ...SaleLotsList_me
}

fragment Sale_sale on Sale {
  internalID
  slug
  ...SaleHeader_sale
  ...RegisterToBidButton_sale
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "saleID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "saleID"
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
  "name": "slug",
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
  "alias": null,
  "name": "endAt",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artistNames",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "date",
  "args": null,
  "storageKey": null
},
v11 = [
  {
    "kind": "Literal",
    "name": "version",
    "value": "small"
  }
],
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "aspectRatio",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "saleMessage",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "counts",
  "storageKey": null,
  "args": null,
  "concreteType": "SaleArtworkCounts",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "bidderPositions",
      "args": null,
      "storageKey": null
    }
  ]
},
v16 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "currentBid",
  "storageKey": null,
  "args": null,
  "concreteType": "SaleArtworkCurrentBid",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "display",
      "args": null,
      "storageKey": null
    }
  ]
},
v17 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "lotLabel",
  "args": null,
  "storageKey": null
},
v18 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isAuction",
  "args": null,
  "storageKey": null
},
v19 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isClosed",
  "args": null,
  "storageKey": null
},
v20 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "displayTimelyAt",
  "args": null,
  "storageKey": null
},
v21 = [
  (v7/*: any*/),
  {
    "kind": "Literal",
    "name": "includeArtworksByFollowedArtists",
    "value": false
  },
  {
    "kind": "Literal",
    "name": "isAuction",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "liveSale",
    "value": true
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SaleQueryRendererQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Sale_sale",
            "args": null
          }
        ]
      },
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
            "name": "Sale_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SaleQueryRendererQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "liveStartAt",
            "args": null,
            "storageKey": null
          },
          (v5/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "startAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "timeZone",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
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
            "alias": null,
            "name": "requireIdentityVerification",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "registrationStatus",
            "storageKey": null,
            "args": null,
            "concreteType": "Bidder",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "qualifiedForBidding",
                "args": null,
                "storageKey": null
              },
              (v6/*: any*/)
            ]
          },
          (v6/*: any*/)
        ]
      },
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
            "alias": "saleArtworksRail",
            "name": "lotsByFollowedArtistsConnection",
            "storageKey": "lotsByFollowedArtistsConnection(first:10,includeArtworksByFollowedArtists:true)",
            "args": [
              (v7/*: any*/),
              {
                "kind": "Literal",
                "name": "includeArtworksByFollowedArtists",
                "value": true
              }
            ],
            "concreteType": "SaleArtworksConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtwork",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v8/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "saleArtwork",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "artwork",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "plural": false,
                            "selections": [
                              (v9/*: any*/),
                              (v10/*: any*/),
                              (v8/*: any*/),
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
                                    "alias": "imageURL",
                                    "name": "url",
                                    "args": (v11/*: any*/),
                                    "storageKey": "url(version:\"small\")"
                                  },
                                  (v12/*: any*/)
                                ]
                              },
                              (v2/*: any*/),
                              (v3/*: any*/),
                              (v13/*: any*/),
                              (v14/*: any*/),
                              (v6/*: any*/)
                            ]
                          },
                          (v15/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "sale",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Sale",
                            "plural": false,
                            "selections": [
                              (v18/*: any*/),
                              (v19/*: any*/),
                              (v20/*: any*/),
                              (v6/*: any*/)
                            ]
                          },
                          (v6/*: any*/)
                        ]
                      }
                    ]
                  },
                  (v6/*: any*/)
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "lotsByFollowedArtistsConnection",
            "storageKey": "lotsByFollowedArtistsConnection(first:10,includeArtworksByFollowedArtists:false,isAuction:true,liveSale:true)",
            "args": (v21/*: any*/),
            "concreteType": "SaleArtworksConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtwork",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "cursor",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "__typename",
                        "args": null,
                        "storageKey": null
                      },
                      (v6/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v8/*: any*/),
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
                            "alias": "small",
                            "name": "url",
                            "args": (v11/*: any*/),
                            "storageKey": "url(version:\"small\")"
                          },
                          (v12/*: any*/),
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
                            "name": "width",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "url",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "large"
                              }
                            ],
                            "storageKey": "url(version:\"large\")"
                          }
                        ]
                      },
                      (v13/*: any*/),
                      (v3/*: any*/),
                      (v14/*: any*/),
                      (v2/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "sale",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Sale",
                        "plural": false,
                        "selections": [
                          (v18/*: any*/),
                          (v19/*: any*/),
                          (v20/*: any*/),
                          (v5/*: any*/),
                          (v6/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "saleArtwork",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "plural": false,
                        "selections": [
                          (v15/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/),
                          (v6/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Partner",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          (v6/*: any*/)
                        ]
                      }
                    ]
                  },
                  (v6/*: any*/)
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
                    "name": "hasNextPage",
                    "args": null,
                    "storageKey": null
                  },
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
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "lotsByFollowedArtistsConnection",
            "args": (v21/*: any*/),
            "handle": "connection",
            "key": "SaleLotsList_lotsByFollowedArtistsConnection",
            "filters": [
              "liveSale",
              "isAuction",
              "includeArtworksByFollowedArtists",
              "saleID"
            ]
          },
          (v6/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "SaleQueryRendererQuery",
    "id": "a698971905052e0d42a5a50abb031316",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '45feb50365b1b3feb9a27e9ca1ae96ff';
export default node;
