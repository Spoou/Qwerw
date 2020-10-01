/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d538509ee0be92f3cd476a762808e6f3 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistNotableWorksRailTestsQueryVariables = {};
export type ArtistNotableWorksRailTestsQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistNotableWorksRail_artist">;
    } | null;
};
export type ArtistNotableWorksRailTestsQueryRawResponse = {
    readonly artist: ({
        readonly filterArtworksConnection: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly image: ({
                        readonly imageURL: string | null;
                        readonly aspectRatio: number;
                    }) | null;
                    readonly saleMessage: string | null;
                    readonly saleArtwork: ({
                        readonly openingBid: ({
                            readonly display: string | null;
                        }) | null;
                        readonly highestBid: ({
                            readonly display: string | null;
                        }) | null;
                        readonly id: string;
                    }) | null;
                    readonly sale: ({
                        readonly isClosed: boolean | null;
                        readonly isAuction: boolean | null;
                        readonly id: string;
                    }) | null;
                    readonly title: string | null;
                    readonly internalID: string;
                    readonly slug: string;
                }) | null;
            }) | null> | null;
            readonly id: string;
        }) | null;
        readonly id: string;
    }) | null;
};
export type ArtistNotableWorksRailTestsQuery = {
    readonly response: ArtistNotableWorksRailTestsQueryResponse;
    readonly variables: ArtistNotableWorksRailTestsQueryVariables;
    readonly rawResponse: ArtistNotableWorksRailTestsQueryRawResponse;
};



/*
query ArtistNotableWorksRailTestsQuery {
  artist(id: "a-really-talented-artist") {
    ...ArtistNotableWorksRail_artist
    id
  }
}

fragment ArtistNotableWorksRail_artist on Artist {
  filterArtworksConnection(sort: "-weighted_iconicity", first: 10) {
    edges {
      node {
        id
        image {
          imageURL
          aspectRatio
        }
        saleMessage
        saleArtwork {
          openingBid {
            display
          }
          highestBid {
            display
          }
          id
        }
        sale {
          isClosed
          isAuction
          id
        }
        title
        internalID
        slug
      }
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "a-really-talented-artist"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistNotableWorksRailTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtistNotableWorksRail_artist"
          }
        ],
        "storageKey": "artist(id:\"a-really-talented-artist\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ArtistNotableWorksRailTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 10
              },
              {
                "kind": "Literal",
                "name": "sort",
                "value": "-weighted_iconicity"
              }
            ],
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "filterArtworksConnection",
            "plural": false,
            "selections": [
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
                      (v1/*: any*/),
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
                            "name": "imageURL",
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
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "saleMessage",
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
                            "concreteType": "SaleArtworkOpeningBid",
                            "kind": "LinkedField",
                            "name": "openingBid",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "SaleArtworkHighestBid",
                            "kind": "LinkedField",
                            "name": "highestBid",
                            "plural": false,
                            "selections": (v2/*: any*/),
                            "storageKey": null
                          },
                          (v1/*: any*/)
                        ],
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
                            "name": "isClosed",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isAuction",
                            "storageKey": null
                          },
                          (v1/*: any*/)
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
                        "name": "internalID",
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
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": "filterArtworksConnection(first:10,sort:\"-weighted_iconicity\")"
          },
          (v1/*: any*/)
        ],
        "storageKey": "artist(id:\"a-really-talented-artist\")"
      }
    ]
  },
  "params": {
    "id": "d538509ee0be92f3cd476a762808e6f3",
    "metadata": {},
    "name": "ArtistNotableWorksRailTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'dcfc8c2f4b9be90e5ee6f7df34d451b7';
export default node;
