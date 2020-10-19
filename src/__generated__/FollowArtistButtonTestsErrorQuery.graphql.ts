/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 1b7cfa5b786e32f0faccd54efa1c07bd */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FollowArtistButtonTestsErrorQueryVariables = {};
export type FollowArtistButtonTestsErrorQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"FollowArtistButton_artist">;
    } | null;
};
export type FollowArtistButtonTestsErrorQueryRawResponse = {
    readonly artist: ({
        readonly id: string;
        readonly slug: string;
        readonly internalID: string;
        readonly is_followed: boolean | null;
    }) | null;
};
export type FollowArtistButtonTestsErrorQuery = {
    readonly response: FollowArtistButtonTestsErrorQueryResponse;
    readonly variables: FollowArtistButtonTestsErrorQueryVariables;
    readonly rawResponse: FollowArtistButtonTestsErrorQueryRawResponse;
};



/*
query FollowArtistButtonTestsErrorQuery {
  artist(id: "artistID") {
    ...FollowArtistButton_artist
    id
  }
}

fragment FollowArtistButton_artist on Artist {
  id
  slug
  internalID
  is_followed: isFollowed
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "artistID"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "FollowArtistButtonTestsErrorQuery",
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
            "name": "FollowArtistButton_artist"
          }
        ],
        "storageKey": "artist(id:\"artistID\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "FollowArtistButtonTestsErrorQuery",
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
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
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
            "alias": "is_followed",
            "args": null,
            "kind": "ScalarField",
            "name": "isFollowed",
            "storageKey": null
          }
        ],
        "storageKey": "artist(id:\"artistID\")"
      }
    ]
  },
  "params": {
    "id": "1b7cfa5b786e32f0faccd54efa1c07bd",
    "metadata": {},
    "name": "FollowArtistButtonTestsErrorQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '22243b83ad90d479f77e6a5683cc90dc';
export default node;
