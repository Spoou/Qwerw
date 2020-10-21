/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 24360ff70c42ecad876d4c98e3f706dd */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleTestsQueryVariables = {};
export type SaleTestsQueryResponse = {
    readonly sale: {
        readonly internalID: string;
        readonly slug: string;
        readonly liveStartAt: string | null;
        readonly endAt: string | null;
        readonly registrationEndsAt: string | null;
        readonly " $fragmentRefs": FragmentRefs<"SaleHeader_sale" | "RegisterToBidButton_sale">;
    } | null;
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"SaleArtworksRail_me">;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_saleArtworksConnection">;
};
export type SaleTestsQuery = {
    readonly response: SaleTestsQueryResponse;
    readonly variables: SaleTestsQueryVariables;
};



/*
query SaleTestsQuery {
  sale(id: "the-sale") {
    internalID
    slug
    liveStartAt
    endAt
    registrationEndsAt
    ...SaleHeader_sale
    ...RegisterToBidButton_sale
    id
  }
  me {
    ...SaleArtworksRail_me
    id
  }
  ...SaleLotsList_saleArtworksConnection_49HmpD
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
  __isArtworkConnectionInterface: __typename
  edges {
    __typename
    node {
      id
      ...SaleArtworkListItem_artwork
    }
    ... on Node {
      __isNode: __typename
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
  lotsByFollowedArtistsConnection(first: 10, includeArtworksByFollowedArtists: true) {
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

fragment SaleLotsList_saleArtworksConnection_49HmpD on Query {
  saleArtworksConnection(saleID: "sale-slug", artistIDs: [], geneIDs: [], aggregations: [FOLLOWED_ARTISTS, ARTIST, MEDIUM, TOTAL], estimateRange: "", first: 10, includeArtworksByFollowedArtists: false, sort: "position") {
    aggregations {
      slice
      counts {
        count
        name
        value
      }
    }
    counts {
      followedArtists
      total
    }
    edges {
      node {
        id
        __typename
      }
      cursor
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "the-sale"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "liveStartAt",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "registrationEndsAt",
  "storageKey": null
},
v6 = {
  "kind": "Literal",
  "name": "saleID",
  "value": "sale-slug"
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v9 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v13 = [
  {
    "kind": "Literal",
    "name": "version",
    "value": "small"
  }
],
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "aspectRatio",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleMessage",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v17 = {
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
v18 = {
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
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lotLabel",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAuction",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isClosed",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTimelyAt",
  "storageKey": null
},
v23 = [
  {
    "kind": "Literal",
    "name": "aggregations",
    "value": [
      "FOLLOWED_ARTISTS",
      "ARTIST",
      "MEDIUM",
      "TOTAL"
    ]
  },
  {
    "kind": "Literal",
    "name": "artistIDs",
    "value": ([]/*: any*/)
  },
  {
    "kind": "Literal",
    "name": "estimateRange",
    "value": ""
  },
  (v9/*: any*/),
  {
    "kind": "Literal",
    "name": "geneIDs",
    "value": ([]/*: any*/)
  },
  {
    "kind": "Literal",
    "name": "includeArtworksByFollowedArtists",
    "value": false
  },
  (v6/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "position"
  }
],
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v25 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v26 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtworksConnection"
},
v27 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v28 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v29 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtwork"
},
v30 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v31 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Float"
},
v32 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtworkCounts"
},
v33 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FormattedNumber"
},
v34 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtworkCurrentBid"
},
v35 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v36 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v37 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v38 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SaleTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SaleHeader_sale"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "RegisterToBidButton_sale"
          }
        ],
        "storageKey": "sale(id:\"the-sale\")"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SaleArtworksRail_me"
          }
        ],
        "storageKey": null
      },
      {
        "args": [
          (v6/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "SaleLotsList_saleArtworksConnection"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SaleTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "timeZone",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "coverImage",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "url",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "requireIdentityVerification",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Bidder",
            "kind": "LinkedField",
            "name": "registrationStatus",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "qualifiedForBidding",
                "storageKey": null
              },
              (v8/*: any*/)
            ],
            "storageKey": null
          },
          (v8/*: any*/)
        ],
        "storageKey": "sale(id:\"the-sale\")"
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              (v9/*: any*/),
              {
                "kind": "Literal",
                "name": "includeArtworksByFollowedArtists",
                "value": true
              }
            ],
            "concreteType": "SaleArtworksConnection",
            "kind": "LinkedField",
            "name": "lotsByFollowedArtistsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "SaleArtwork",
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
                      (v8/*: any*/),
                      (v10/*: any*/),
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
                            "concreteType": "Artwork",
                            "kind": "LinkedField",
                            "name": "artwork",
                            "plural": false,
                            "selections": [
                              (v11/*: any*/),
                              (v12/*: any*/),
                              (v10/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Image",
                                "kind": "LinkedField",
                                "name": "image",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": "imageURL",
                                    "args": (v13/*: any*/),
                                    "kind": "ScalarField",
                                    "name": "url",
                                    "storageKey": "url(version:\"small\")"
                                  },
                                  (v14/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v1/*: any*/),
                              (v2/*: any*/),
                              (v15/*: any*/),
                              (v16/*: any*/),
                              (v8/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v17/*: any*/),
                          (v18/*: any*/),
                          (v19/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              (v20/*: any*/),
                              (v21/*: any*/),
                              (v22/*: any*/),
                              (v8/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v8/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v8/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": "lotsByFollowedArtistsConnection(first:10,includeArtworksByFollowedArtists:true)"
          },
          (v8/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v23/*: any*/),
        "concreteType": "SaleArtworksConnection",
        "kind": "LinkedField",
        "name": "saleArtworksConnection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "SaleArtworksAggregationResults",
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
                  (v7/*: any*/),
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
            "concreteType": "FilterSaleArtworksCounts",
            "kind": "LinkedField",
            "name": "counts",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "followedArtists",
                "storageKey": null
              },
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
            "concreteType": "SaleArtwork",
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
                  (v8/*: any*/),
                  (v24/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              },
              (v8/*: any*/)
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
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  (v24/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v11/*: any*/),
                      (v12/*: any*/),
                      (v10/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "image",
                        "plural": false,
                        "selections": [
                          {
                            "alias": "small",
                            "args": (v13/*: any*/),
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": "url(version:\"small\")"
                          },
                          (v14/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "height",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "width",
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
                      (v15/*: any*/),
                      (v2/*: any*/),
                      (v16/*: any*/),
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Sale",
                        "kind": "LinkedField",
                        "name": "sale",
                        "plural": false,
                        "selections": [
                          (v20/*: any*/),
                          (v21/*: any*/),
                          (v22/*: any*/),
                          (v4/*: any*/),
                          (v8/*: any*/)
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
                          (v17/*: any*/),
                          (v18/*: any*/),
                          (v19/*: any*/),
                          (v8/*: any*/)
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
                          (v7/*: any*/),
                          (v8/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "kind": "TypeDiscriminator",
                    "abstractKey": "__isNode"
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
                    "name": "startCursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "ArtworkConnectionInterface",
            "abstractKey": "__isArtworkConnectionInterface"
          }
        ],
        "storageKey": "saleArtworksConnection(aggregations:[\"FOLLOWED_ARTISTS\",\"ARTIST\",\"MEDIUM\",\"TOTAL\"],artistIDs:[],estimateRange:\"\",first:10,geneIDs:[],includeArtworksByFollowedArtists:false,saleID:\"sale-slug\",sort:\"position\")"
      },
      {
        "alias": null,
        "args": (v23/*: any*/),
        "filters": [
          "saleID",
          "artistIDs",
          "geneIDs",
          "aggregations",
          "estimateRange",
          "includeArtworksByFollowedArtists",
          "sort"
        ],
        "handle": "connection",
        "key": "SaleLotsList_saleArtworksConnection",
        "kind": "LinkedHandle",
        "name": "saleArtworksConnection"
      }
    ]
  },
  "params": {
    "id": "24360ff70c42ecad876d4c98e3f706dd",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.id": (v25/*: any*/),
        "me.lotsByFollowedArtistsConnection": (v26/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "SaleArtwork"
        },
        "me.lotsByFollowedArtistsConnection.edges.id": (v25/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node": (v27/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.href": (v28/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.id": (v25/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork": (v29/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork": (v27/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.artistNames": (v28/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.date": (v28/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.href": (v28/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.id": (v25/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.image": (v30/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.image.aspectRatio": (v31/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.image.imageURL": (v28/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.internalID": (v25/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.saleMessage": (v28/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.slug": (v25/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.title": (v28/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.counts": (v32/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.counts.bidderPositions": (v33/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.currentBid": (v34/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.currentBid.display": (v28/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.id": (v25/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.lotLabel": (v28/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.sale": (v35/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.sale.displayTimelyAt": (v28/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.sale.id": (v25/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.sale.isAuction": (v36/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.sale.isClosed": (v36/*: any*/),
        "sale": (v35/*: any*/),
        "sale.coverImage": (v30/*: any*/),
        "sale.coverImage.url": (v28/*: any*/),
        "sale.endAt": (v28/*: any*/),
        "sale.id": (v25/*: any*/),
        "sale.internalID": (v25/*: any*/),
        "sale.liveStartAt": (v28/*: any*/),
        "sale.name": (v28/*: any*/),
        "sale.registrationEndsAt": (v28/*: any*/),
        "sale.registrationStatus": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Bidder"
        },
        "sale.registrationStatus.id": (v25/*: any*/),
        "sale.registrationStatus.qualifiedForBidding": (v36/*: any*/),
        "sale.requireIdentityVerification": (v36/*: any*/),
        "sale.slug": (v25/*: any*/),
        "sale.startAt": (v28/*: any*/),
        "sale.timeZone": (v28/*: any*/),
        "saleArtworksConnection": (v26/*: any*/),
        "saleArtworksConnection.__isArtworkConnectionInterface": (v37/*: any*/),
        "saleArtworksConnection.aggregations": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "SaleArtworksAggregationResults"
        },
        "saleArtworksConnection.aggregations.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "AggregationCount"
        },
        "saleArtworksConnection.aggregations.counts.count": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Int"
        },
        "saleArtworksConnection.aggregations.counts.name": (v37/*: any*/),
        "saleArtworksConnection.aggregations.counts.value": (v37/*: any*/),
        "saleArtworksConnection.aggregations.slice": {
          "enumValues": [
            "ARTIST",
            "FOLLOWED_ARTISTS",
            "MEDIUM",
            "TOTAL"
          ],
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkAggregation"
        },
        "saleArtworksConnection.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterSaleArtworksCounts"
        },
        "saleArtworksConnection.counts.followedArtists": (v33/*: any*/),
        "saleArtworksConnection.counts.total": (v33/*: any*/),
        "saleArtworksConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdgeInterface"
        },
        "saleArtworksConnection.edges.__isNode": (v37/*: any*/),
        "saleArtworksConnection.edges.__typename": (v37/*: any*/),
        "saleArtworksConnection.edges.cursor": (v28/*: any*/),
        "saleArtworksConnection.edges.id": (v25/*: any*/),
        "saleArtworksConnection.edges.node": (v27/*: any*/),
        "saleArtworksConnection.edges.node.__typename": (v37/*: any*/),
        "saleArtworksConnection.edges.node.artistNames": (v28/*: any*/),
        "saleArtworksConnection.edges.node.date": (v28/*: any*/),
        "saleArtworksConnection.edges.node.href": (v28/*: any*/),
        "saleArtworksConnection.edges.node.id": (v25/*: any*/),
        "saleArtworksConnection.edges.node.image": (v30/*: any*/),
        "saleArtworksConnection.edges.node.image.aspectRatio": (v31/*: any*/),
        "saleArtworksConnection.edges.node.image.height": (v38/*: any*/),
        "saleArtworksConnection.edges.node.image.small": (v28/*: any*/),
        "saleArtworksConnection.edges.node.image.url": (v28/*: any*/),
        "saleArtworksConnection.edges.node.image.width": (v38/*: any*/),
        "saleArtworksConnection.edges.node.internalID": (v25/*: any*/),
        "saleArtworksConnection.edges.node.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "saleArtworksConnection.edges.node.partner.id": (v25/*: any*/),
        "saleArtworksConnection.edges.node.partner.name": (v28/*: any*/),
        "saleArtworksConnection.edges.node.sale": (v35/*: any*/),
        "saleArtworksConnection.edges.node.sale.displayTimelyAt": (v28/*: any*/),
        "saleArtworksConnection.edges.node.sale.endAt": (v28/*: any*/),
        "saleArtworksConnection.edges.node.sale.id": (v25/*: any*/),
        "saleArtworksConnection.edges.node.sale.isAuction": (v36/*: any*/),
        "saleArtworksConnection.edges.node.sale.isClosed": (v36/*: any*/),
        "saleArtworksConnection.edges.node.saleArtwork": (v29/*: any*/),
        "saleArtworksConnection.edges.node.saleArtwork.counts": (v32/*: any*/),
        "saleArtworksConnection.edges.node.saleArtwork.counts.bidderPositions": (v33/*: any*/),
        "saleArtworksConnection.edges.node.saleArtwork.currentBid": (v34/*: any*/),
        "saleArtworksConnection.edges.node.saleArtwork.currentBid.display": (v28/*: any*/),
        "saleArtworksConnection.edges.node.saleArtwork.id": (v25/*: any*/),
        "saleArtworksConnection.edges.node.saleArtwork.lotLabel": (v28/*: any*/),
        "saleArtworksConnection.edges.node.saleMessage": (v28/*: any*/),
        "saleArtworksConnection.edges.node.slug": (v25/*: any*/),
        "saleArtworksConnection.edges.node.title": (v28/*: any*/),
        "saleArtworksConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "saleArtworksConnection.pageInfo.endCursor": (v28/*: any*/),
        "saleArtworksConnection.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "saleArtworksConnection.pageInfo.startCursor": (v28/*: any*/)
      }
    },
    "name": "SaleTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'ee0789fbf5b6101d193ef0ef9abcc2d8';
export default node;
