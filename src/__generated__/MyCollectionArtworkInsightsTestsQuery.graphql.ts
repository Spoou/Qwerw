/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 4d8fa5dcd2401df8920c4a676fe4deb8 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkInsightsTestsQueryVariables = {};
export type MyCollectionArtworkInsightsTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkInsights_artwork">;
    } | null;
    readonly marketPriceInsights: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkInsights_marketPriceInsights">;
    } | null;
};
export type MyCollectionArtworkInsightsTestsQuery = {
    readonly response: MyCollectionArtworkInsightsTestsQueryResponse;
    readonly variables: MyCollectionArtworkInsightsTestsQueryVariables;
};



/*
query MyCollectionArtworkInsightsTestsQuery {
  artwork(id: "some-artwork-id") {
    ...MyCollectionArtworkInsights_artwork
    id
  }
  marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
    ...MyCollectionArtworkInsights_marketPriceInsights
    id
  }
}

fragment AuctionResultListItem_auctionResult on AuctionResult {
  currency
  dateText
  id
  internalID
  artist {
    name
    id
  }
  images {
    thumbnail {
      url(version: "square140")
      height
      width
      aspectRatio
    }
  }
  estimate {
    low
  }
  mediumText
  organization
  boughtIn
  performance {
    mid
  }
  priceRealized {
    cents
    display
    displayUSD
  }
  saleDate
  title
}

fragment MyCollectionArtworkArtistArticles_artwork on Artwork {
  internalID
  slug
  artist {
    slug
    name
    internalID
    articlesConnection(first: 3, sort: PUBLISHED_AT_DESC, inEditorialFeed: true) {
      edges {
        node {
          slug
          internalID
          href
          thumbnailTitle
          author {
            name
            id
          }
          publishedAt(format: "MMM Do, YYYY")
          thumbnailImage {
            url
          }
          id
        }
      }
    }
    id
  }
}

fragment MyCollectionArtworkArtistAuctionResults_artwork on Artwork {
  internalID
  slug
  artist {
    slug
    name
    auctionResultsConnection(first: 3, sort: DATE_DESC) {
      edges {
        node {
          id
          internalID
          ...AuctionResultListItem_auctionResult
        }
      }
    }
    id
  }
}

fragment MyCollectionArtworkArtistMarket_artwork on Artwork {
  internalID
  slug
}

fragment MyCollectionArtworkArtistMarket_marketPriceInsights on MarketPriceInsights {
  annualLotsSold
  annualValueSoldCents
  sellThroughRate
  medianSaleToEstimateRatio
  liquidityRank
  demandTrend
}

fragment MyCollectionArtworkDemandIndex_artwork on Artwork {
  internalID
  slug
}

fragment MyCollectionArtworkDemandIndex_marketPriceInsights on MarketPriceInsights {
  demandRank
}

fragment MyCollectionArtworkInsights_artwork on Artwork {
  sizeBucket
  medium
  artist {
    name
    id
  }
  ...MyCollectionArtworkArtistAuctionResults_artwork
  ...MyCollectionArtworkArtistArticles_artwork
  ...MyCollectionArtworkArtistMarket_artwork
  ...MyCollectionArtworkDemandIndex_artwork
}

fragment MyCollectionArtworkInsights_marketPriceInsights on MarketPriceInsights {
  ...MyCollectionArtworkDemandIndex_marketPriceInsights
  ...MyCollectionArtworkArtistMarket_marketPriceInsights
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "some-artwork-id"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "artistId",
    "value": "some-artist-id"
  },
  {
    "kind": "Literal",
    "name": "medium",
    "value": "painting"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v5 = {
  "kind": "Literal",
  "name": "first",
  "value": 3
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v7 = [
  (v2/*: any*/),
  (v3/*: any*/)
],
v8 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artist"
},
v9 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v10 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v11 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v12 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
},
v13 = {
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
    "name": "MyCollectionArtworkInsightsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkInsights_artwork"
          }
        ],
        "storageKey": "artwork(id:\"some-artwork-id\")"
      },
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MarketPriceInsights",
        "kind": "LinkedField",
        "name": "marketPriceInsights",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkInsights_marketPriceInsights"
          }
        ],
        "storageKey": "marketPriceInsights(artistId:\"some-artist-id\",medium:\"painting\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyCollectionArtworkInsightsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "sizeBucket",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "medium",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artist",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": [
                  (v5/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "sort",
                    "value": "DATE_DESC"
                  }
                ],
                "concreteType": "AuctionResultConnection",
                "kind": "LinkedField",
                "name": "auctionResultsConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AuctionResultEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionResult",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v6/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "currency",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "dateText",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artist",
                            "kind": "LinkedField",
                            "name": "artist",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AuctionLotImages",
                            "kind": "LinkedField",
                            "name": "images",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Image",
                                "kind": "LinkedField",
                                "name": "thumbnail",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "version",
                                        "value": "square140"
                                      }
                                    ],
                                    "kind": "ScalarField",
                                    "name": "url",
                                    "storageKey": "url(version:\"square140\")"
                                  },
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
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "aspectRatio",
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
                            "concreteType": "AuctionLotEstimate",
                            "kind": "LinkedField",
                            "name": "estimate",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "low",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "mediumText",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "organization",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "boughtIn",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AuctionLotPerformance",
                            "kind": "LinkedField",
                            "name": "performance",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "mid",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AuctionResultPriceRealized",
                            "kind": "LinkedField",
                            "name": "priceRealized",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "cents",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "display",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "displayUSD",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "saleDate",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "title",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "auctionResultsConnection(first:3,sort:\"DATE_DESC\")"
              },
              (v6/*: any*/),
              {
                "alias": null,
                "args": [
                  (v5/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "inEditorialFeed",
                    "value": true
                  },
                  {
                    "kind": "Literal",
                    "name": "sort",
                    "value": "PUBLISHED_AT_DESC"
                  }
                ],
                "concreteType": "ArticleConnection",
                "kind": "LinkedField",
                "name": "articlesConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArticleEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Article",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          (v6/*: any*/),
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
                            "name": "thumbnailTitle",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Author",
                            "kind": "LinkedField",
                            "name": "author",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "format",
                                "value": "MMM Do, YYYY"
                              }
                            ],
                            "kind": "ScalarField",
                            "name": "publishedAt",
                            "storageKey": "publishedAt(format:\"MMM Do, YYYY\")"
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "thumbnailImage",
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
                          (v3/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "articlesConnection(first:3,inEditorialFeed:true,sort:\"PUBLISHED_AT_DESC\")"
              }
            ],
            "storageKey": null
          },
          (v6/*: any*/),
          (v4/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": "artwork(id:\"some-artwork-id\")"
      },
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MarketPriceInsights",
        "kind": "LinkedField",
        "name": "marketPriceInsights",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "demandRank",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "annualLotsSold",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "annualValueSoldCents",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "sellThroughRate",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "medianSaleToEstimateRatio",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "liquidityRank",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "demandTrend",
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": "marketPriceInsights(artistId:\"some-artist-id\",medium:\"painting\")"
      }
    ]
  },
  "params": {
    "id": "4d8fa5dcd2401df8920c4a676fe4deb8",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "artwork.artist": (v8/*: any*/),
        "artwork.artist.articlesConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArticleConnection"
        },
        "artwork.artist.articlesConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArticleEdge"
        },
        "artwork.artist.articlesConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Article"
        },
        "artwork.artist.articlesConnection.edges.node.author": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Author"
        },
        "artwork.artist.articlesConnection.edges.node.author.id": (v9/*: any*/),
        "artwork.artist.articlesConnection.edges.node.author.name": (v10/*: any*/),
        "artwork.artist.articlesConnection.edges.node.href": (v10/*: any*/),
        "artwork.artist.articlesConnection.edges.node.id": (v9/*: any*/),
        "artwork.artist.articlesConnection.edges.node.internalID": (v9/*: any*/),
        "artwork.artist.articlesConnection.edges.node.publishedAt": (v10/*: any*/),
        "artwork.artist.articlesConnection.edges.node.slug": (v10/*: any*/),
        "artwork.artist.articlesConnection.edges.node.thumbnailImage": (v11/*: any*/),
        "artwork.artist.articlesConnection.edges.node.thumbnailImage.url": (v10/*: any*/),
        "artwork.artist.articlesConnection.edges.node.thumbnailTitle": (v10/*: any*/),
        "artwork.artist.auctionResultsConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionResultConnection"
        },
        "artwork.artist.auctionResultsConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "AuctionResultEdge"
        },
        "artwork.artist.auctionResultsConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionResult"
        },
        "artwork.artist.auctionResultsConnection.edges.node.artist": (v8/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.artist.id": (v9/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.artist.name": (v10/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.boughtIn": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        },
        "artwork.artist.auctionResultsConnection.edges.node.currency": (v10/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.dateText": (v10/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.estimate": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionLotEstimate"
        },
        "artwork.artist.auctionResultsConnection.edges.node.estimate.low": (v12/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.id": (v9/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.images": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionLotImages"
        },
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail": (v11/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail.height": (v13/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail.url": (v10/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail.width": (v13/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.internalID": (v9/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.mediumText": (v10/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.organization": (v10/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.performance": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionLotPerformance"
        },
        "artwork.artist.auctionResultsConnection.edges.node.performance.mid": (v10/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionResultPriceRealized"
        },
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized.cents": (v12/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized.display": (v10/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized.displayUSD": (v10/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.saleDate": (v10/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.title": (v10/*: any*/),
        "artwork.artist.id": (v9/*: any*/),
        "artwork.artist.internalID": (v9/*: any*/),
        "artwork.artist.name": (v10/*: any*/),
        "artwork.artist.slug": (v9/*: any*/),
        "artwork.id": (v9/*: any*/),
        "artwork.internalID": (v9/*: any*/),
        "artwork.medium": (v10/*: any*/),
        "artwork.sizeBucket": (v10/*: any*/),
        "artwork.slug": (v9/*: any*/),
        "marketPriceInsights": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MarketPriceInsights"
        },
        "marketPriceInsights.annualLotsSold": (v13/*: any*/),
        "marketPriceInsights.annualValueSoldCents": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "BigInt"
        },
        "marketPriceInsights.demandRank": (v12/*: any*/),
        "marketPriceInsights.demandTrend": (v12/*: any*/),
        "marketPriceInsights.id": (v9/*: any*/),
        "marketPriceInsights.liquidityRank": (v12/*: any*/),
        "marketPriceInsights.medianSaleToEstimateRatio": (v12/*: any*/),
        "marketPriceInsights.sellThroughRate": (v12/*: any*/)
      }
    },
    "name": "MyCollectionArtworkInsightsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'cbb19540e1692c8f992a18876f4cd9ce';
export default node;
