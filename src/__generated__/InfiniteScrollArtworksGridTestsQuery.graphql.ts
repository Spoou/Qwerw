/* tslint:disable */
/* eslint-disable */
/* @relayHash b5d0b4076ba7b64a2cdaf1e9ef5b4623 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InfiniteScrollArtworksGridTestsQueryVariables = {};
export type InfiniteScrollArtworksGridTestsQueryResponse = {
    readonly artworksConnection: {
        readonly pageInfo: {
            readonly hasNextPage: boolean;
            readonly startCursor: string | null;
            readonly endCursor: string | null;
        };
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly slug: string;
                readonly id: string;
                readonly image: {
                    readonly aspectRatio: number;
                } | null;
                readonly " $fragmentRefs": FragmentRefs<"ArtworkGridItem_artwork">;
            } | null;
        } | null> | null;
    } | null;
};
export type InfiniteScrollArtworksGridTestsQueryRawResponse = {
    readonly artworksConnection: ({
        readonly pageInfo: {
            readonly hasNextPage: boolean;
            readonly startCursor: string | null;
            readonly endCursor: string | null;
        };
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly slug: string;
                readonly id: string;
                readonly image: ({
                    readonly aspectRatio: number;
                    readonly url: string | null;
                }) | null;
                readonly title: string | null;
                readonly date: string | null;
                readonly saleMessage: string | null;
                readonly internalID: string;
                readonly artistNames: string | null;
                readonly href: string | null;
                readonly sale: ({
                    readonly isAuction: boolean | null;
                    readonly isClosed: boolean | null;
                    readonly displayTimelyAt: string | null;
                    readonly id: string | null;
                }) | null;
                readonly saleArtwork: ({
                    readonly currentBid: ({
                        readonly display: string | null;
                    }) | null;
                    readonly id: string | null;
                }) | null;
                readonly partner: ({
                    readonly name: string | null;
                    readonly id: string | null;
                }) | null;
            }) | null;
        }) | null> | null;
        readonly id: string | null;
    }) | null;
};
export type InfiniteScrollArtworksGridTestsQuery = {
    readonly response: InfiniteScrollArtworksGridTestsQueryResponse;
    readonly variables: InfiniteScrollArtworksGridTestsQueryVariables;
    readonly rawResponse: InfiniteScrollArtworksGridTestsQueryRawResponse;
};



/*
query InfiniteScrollArtworksGridTestsQuery {
  artworksConnection(first: 10) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        slug
        id
        image {
          aspectRatio
        }
        ...ArtworkGridItem_artwork
      }
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
    id
  }
  saleArtwork {
    currentBid {
      display
    }
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v1 = {
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
},
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
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "aspectRatio",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "InfiniteScrollArtworksGridTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artworksConnection",
        "storageKey": "artworksConnection(first:10)",
        "args": (v0/*: any*/),
        "concreteType": "FilterArtworksConnection",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "edges",
            "storageKey": null,
            "args": null,
            "concreteType": "FilterArtworksEdge",
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "image",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Image",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/)
                    ]
                  },
                  {
                    "kind": "FragmentSpread",
                    "name": "ArtworkGridItem_artwork",
                    "args": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "InfiniteScrollArtworksGridTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artworksConnection",
        "storageKey": "artworksConnection(first:10)",
        "args": (v0/*: any*/),
        "concreteType": "FilterArtworksConnection",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "edges",
            "storageKey": null,
            "args": null,
            "concreteType": "FilterArtworksEdge",
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "image",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Image",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
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
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "title",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "date",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "saleMessage",
                    "args": null,
                    "storageKey": null
                  },
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
                    "name": "artistNames",
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
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "sale",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Sale",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "isAuction",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "isClosed",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "displayTimelyAt",
                        "args": null,
                        "storageKey": null
                      },
                      (v3/*: any*/)
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
                      {
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
                      (v3/*: any*/)
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
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "name",
                        "args": null,
                        "storageKey": null
                      },
                      (v3/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "InfiniteScrollArtworksGridTestsQuery",
    "id": "fd842256b4241fcce9e2d9948610520d",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '071cf76ca0eb26bc11c920c75615ffec';
export default node;
