/* tslint:disable */
/* eslint-disable */
/* @relayHash e18c1f60d2fb83e09e402a847ded5cd7 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeriesFullArtistSeriesListTestsQueryVariables = {};
export type ArtistSeriesFullArtistSeriesListTestsQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesFullArtistSeriesList_artist">;
    } | null;
};
export type ArtistSeriesFullArtistSeriesListTestsQueryRawResponse = {
    readonly artist: ({
        readonly artistSeriesConnection: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly slug: string;
                    readonly internalID: string;
                    readonly title: string;
                    readonly artworksCountMessage: string | null;
                    readonly image: ({
                        readonly url: string | null;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly id: string | null;
    }) | null;
};
export type ArtistSeriesFullArtistSeriesListTestsQuery = {
    readonly response: ArtistSeriesFullArtistSeriesListTestsQueryResponse;
    readonly variables: ArtistSeriesFullArtistSeriesListTestsQueryVariables;
    readonly rawResponse: ArtistSeriesFullArtistSeriesListTestsQueryRawResponse;
};



/*
query ArtistSeriesFullArtistSeriesListTestsQuery {
  artist(id: "a-great-artist") {
    ...ArtistSeriesFullArtistSeriesList_artist
    id
  }
}

fragment ArtistSeriesFullArtistSeriesList_artist on Artist {
  artistSeriesConnection {
    edges {
      node {
        slug
        internalID
        title
        artworksCountMessage
        image {
          url
        }
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
    "value": "a-great-artist"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistSeriesFullArtistSeriesListTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": "artist(id:\"a-great-artist\")",
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ArtistSeriesFullArtistSeriesList_artist",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistSeriesFullArtistSeriesListTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artist",
        "storageKey": "artist(id:\"a-great-artist\")",
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artistSeriesConnection",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtistSeriesConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtistSeriesEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ArtistSeries",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "slug",
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
                        "name": "title",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "artworksCountMessage",
                        "args": null,
                        "storageKey": null
                      },
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
                            "alias": null,
                            "name": "url",
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
    "name": "ArtistSeriesFullArtistSeriesListTestsQuery",
    "id": "ef4577b471f4007266c88f6b2a4e2369",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '439302971f623d6c11eed8192c4e0360';
export default node;
