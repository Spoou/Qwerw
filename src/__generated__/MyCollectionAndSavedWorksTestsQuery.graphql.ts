/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
<<<<<<< HEAD
<<<<<<< HEAD
/* @relayHash 8da4f7a2cbc3a38a53c25071e43ae6cc */
=======
/* @relayHash bb0ab40a7b853c68f2b739f0e2c7f43c */
>>>>>>> 0ac07c6c97 (add profile verification methods)
=======
/* @relayHash bb0ab40a7b853c68f2b739f0e2c7f43c */
=======
<<<<<<< HEAD
<<<<<<< HEAD
/* @relayHash 5add6cc756eed4180860c0da673e0644 */
=======
/* @relayHash a70fcc4496dae2887c634a26e6dcb2fe */
>>>>>>> 6f81cd6a42 (add profile verification methods)
=======
/* @relayHash a70fcc4496dae2887c634a26e6dcb2fe */
=======
/* @relayHash 60f471d2b3324d9d94ae0927c6c7f709 */
>>>>>>> 2db50a06fb (send verification email on verify press)
>>>>>>> 157b1cc5be (send verification email on verify press)
>>>>>>> bf16f44883 (send verification email on verify press)
>>>>>>> 52000b447e (send verification email on verify press)

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionAndSavedWorksTestsQueryVariables = {};
export type MyCollectionAndSavedWorksTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionAndSavedWorks_me">;
    } | null;
};
export type MyCollectionAndSavedWorksTestsQuery = {
    readonly response: MyCollectionAndSavedWorksTestsQueryResponse;
    readonly variables: MyCollectionAndSavedWorksTestsQueryVariables;
};



/*
query MyCollectionAndSavedWorksTestsQuery {
  me @optionalField {
    ...MyCollectionAndSavedWorks_me
    id
  }
}

fragment MyCollectionAndSavedWorks_me on Me {
  name
  bio
  location {
    display
    id
  }
  otherRelevantPositions
  profession
  icon {
    url(version: "thumbnail")
  }
  createdAt
  ...MyProfileEditFormModal_me_40LmUp
}

fragment MyProfileEditFormModal_me_40LmUp on Me {
<<<<<<< HEAD
  name
  profession
  otherRelevantPositions
=======
>>>>>>> 52000b447e (send verification email on verify press)
  bio
  location {
    display
    city
    state
    country
    id
  }
  icon {
    url(version: "thumbnail")
  }
  name
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v2 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionAndSavedWorksTestsQuery",
    "selections": [
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
            "name": "MyCollectionAndSavedWorks_me"
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyCollectionAndSavedWorksTestsQuery",
    "selections": [
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
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "bio",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "MyLocation",
            "kind": "LinkedField",
            "name": "location",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "display",
                "storageKey": null
              },
              (v0/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "city",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "state",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "country",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "otherRelevantPositions",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "profession",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "icon",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "version",
                    "value": "thumbnail"
                  }
                ],
                "kind": "ScalarField",
                "name": "url",
                "storageKey": "url(version:\"thumbnail\")"
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "createdAt",
            "storageKey": null
          },
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
<<<<<<< HEAD
<<<<<<< HEAD
    "id": "8da4f7a2cbc3a38a53c25071e43ae6cc",
=======
    "id": "bb0ab40a7b853c68f2b739f0e2c7f43c",
>>>>>>> 0ac07c6c97 (add profile verification methods)
=======
    "id": "bb0ab40a7b853c68f2b739f0e2c7f43c",
=======
<<<<<<< HEAD
<<<<<<< HEAD
    "id": "5add6cc756eed4180860c0da673e0644",
=======
    "id": "a70fcc4496dae2887c634a26e6dcb2fe",
>>>>>>> 6f81cd6a42 (add profile verification methods)
=======
    "id": "a70fcc4496dae2887c634a26e6dcb2fe",
=======
    "id": "60f471d2b3324d9d94ae0927c6c7f709",
>>>>>>> 2db50a06fb (send verification email on verify press)
>>>>>>> 157b1cc5be (send verification email on verify press)
>>>>>>> bf16f44883 (send verification email on verify press)
>>>>>>> 52000b447e (send verification email on verify press)
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.bio": (v1/*: any*/),
        "me.createdAt": (v1/*: any*/),
        "me.icon": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "me.icon.url": (v1/*: any*/),
        "me.id": (v2/*: any*/),
        "me.location": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MyLocation"
        },
        "me.location.city": (v1/*: any*/),
        "me.location.country": (v1/*: any*/),
        "me.location.display": (v1/*: any*/),
        "me.location.id": (v2/*: any*/),
        "me.location.state": (v1/*: any*/),
        "me.name": (v1/*: any*/),
        "me.otherRelevantPositions": (v1/*: any*/),
        "me.profession": (v1/*: any*/)
      }
    },
    "name": "MyCollectionAndSavedWorksTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '6510b5ab5aadfb3040f84106f4be7a50';
export default node;
