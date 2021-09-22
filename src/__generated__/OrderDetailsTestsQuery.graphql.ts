/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash a4aa5614acfbf5403705fd5458f368be */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OrderDetailsTestsQueryVariables = {};
export type OrderDetailsTestsQueryResponse = {
    readonly commerceOrder: {
        readonly " $fragmentRefs": FragmentRefs<"OrderDetails_order">;
    } | null;
};
export type OrderDetailsTestsQuery = {
    readonly response: OrderDetailsTestsQueryResponse;
    readonly variables: OrderDetailsTestsQueryVariables;
};



/*
query OrderDetailsTestsQuery {
  commerceOrder(id: "order-id") {
    __typename
    ...OrderDetails_order
    id
  }
}

fragment ArtworkInfoSection_artwork on CommerceOrder {
  __isCommerceOrder: __typename
  lineItems(first: 1) {
    edges {
      node {
        artwork {
          medium
          editionOf
          dimensions {
            in
            cm
          }
          date
          image {
            url(version: "square60")
          }
          title
          artistNames
          id
        }
        id
      }
    }
  }
}

fragment OrderDetailsHeader_info on CommerceOrder {
  __isCommerceOrder: __typename
  createdAt
  code
  state
  requestedFulfillment {
    __typename
    ... on CommerceShip {
      __typename
    }
    ... on CommercePickup {
      __typename
    }
    ... on CommerceShipArta {
      __typename
    }
  }
  lineItems(first: 1) {
    edges {
      node {
        shipment {
          status
          id
        }
        id
      }
    }
  }
}

fragment OrderDetailsPayment_order on CommerceOrder {
  __isCommerceOrder: __typename
  creditCard {
    brand
    lastDigits
    id
  }
}

fragment OrderDetails_order on CommerceOrder {
  __isCommerceOrder: __typename
  requestedFulfillment {
    __typename
    ... on CommerceShip {
      __typename
      name
    }
    ... on CommercePickup {
      __typename
    }
  }
  lineItems(first: 1) {
    edges {
      node {
        artwork {
          partner {
            name
            id
          }
          id
        }
        id
      }
    }
  }
  ...OrderDetailsHeader_info
  ...ArtworkInfoSection_artwork
  ...SummarySection_section
  ...OrderDetailsPayment_order
  ...TrackOrderSection_section
  ...ShipsToSection_address
  ...SoldBySection_soldBy
}

fragment ShipsToSection_address on CommerceOrder {
  __isCommerceOrder: __typename
  requestedFulfillment {
    __typename
    ... on CommercePickup {
      __typename
    }
    ... on CommerceShip {
      __typename
      addressLine1
      addressLine2
      city
      country
      phoneNumber
      postalCode
      region
    }
    ... on CommerceShipArta {
      __typename
      addressLine1
      addressLine2
      city
      country
      phoneNumber
      postalCode
      region
    }
  }
}

fragment SoldBySection_soldBy on CommerceOrder {
  __isCommerceOrder: __typename
  requestedFulfillment {
    __typename
    ... on CommercePickup {
      __typename
    }
  }
  lineItems(first: 1) {
    edges {
      node {
        artwork {
          shippingOrigin
          id
        }
        fulfillments(first: 1) {
          edges {
            node {
              estimatedDelivery
              id
            }
          }
        }
        id
      }
    }
  }
}

fragment SummarySection_section on CommerceOrder {
  __isCommerceOrder: __typename
  buyerTotal(precision: 2)
  taxTotal(precision: 2)
  shippingTotal(precision: 2)
  totalListPrice(precision: 2)
  lineItems(first: 1) {
    edges {
      node {
        selectedShippingQuote {
          displayName
          id
        }
        id
      }
    }
  }
}

fragment TrackOrderSection_section on CommerceOrder {
  __isCommerceOrder: __typename
  state
  lineItems(first: 1) {
    edges {
      node {
        shipment {
          status
          trackingUrl
          trackingNumber
          deliveryStart
          deliveryEnd
          estimatedDeliveryWindow
          id
        }
        fulfillments(first: 1) {
          edges {
            node {
              createdAt
              trackingId
              estimatedDelivery
              id
            }
          }
        }
        id
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
    "value": "order-id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
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
  "name": "addressLine1",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "addressLine2",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "city",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "country",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phoneNumber",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "postalCode",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "region",
  "storageKey": null
},
v10 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v13 = [
  {
    "kind": "Literal",
    "name": "precision",
    "value": 2
  }
],
v14 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v15 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v16 = {
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
    "name": "OrderDetailsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "commerceOrder",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "OrderDetails_order"
          }
        ],
        "storageKey": "commerceOrder(id:\"order-id\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "OrderDetailsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "commerceOrder",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "TypeDiscriminator",
            "abstractKey": "__isCommerceOrder"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "requestedFulfillment",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/)
                ],
                "type": "CommerceShip",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/)
                ],
                "type": "CommerceShipArta",
                "abstractKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v10/*: any*/),
            "concreteType": "CommerceLineItemConnection",
            "kind": "LinkedField",
            "name": "lineItems",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "CommerceLineItemEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CommerceLineItem",
                    "kind": "LinkedField",
                    "name": "node",
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
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Partner",
                            "kind": "LinkedField",
                            "name": "partner",
                            "plural": false,
                            "selections": [
                              (v2/*: any*/),
                              (v11/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v11/*: any*/),
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
                            "kind": "ScalarField",
                            "name": "editionOf",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "dimensions",
                            "kind": "LinkedField",
                            "name": "dimensions",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "in",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "cm",
                                "storageKey": null
                              }
                            ],
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
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "version",
                                    "value": "square60"
                                  }
                                ],
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": "url(version:\"square60\")"
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
                            "name": "artistNames",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "shippingOrigin",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "CommerceShipment",
                        "kind": "LinkedField",
                        "name": "shipment",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "status",
                            "storageKey": null
                          },
                          (v11/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "trackingUrl",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "trackingNumber",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "deliveryStart",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "deliveryEnd",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "estimatedDeliveryWindow",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "CommerceShippingQuote",
                        "kind": "LinkedField",
                        "name": "selectedShippingQuote",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "displayName",
                            "storageKey": null
                          },
                          (v11/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": (v10/*: any*/),
                        "concreteType": "CommerceFulfillmentConnection",
                        "kind": "LinkedField",
                        "name": "fulfillments",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "CommerceFulfillmentEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "CommerceFulfillment",
                                "kind": "LinkedField",
                                "name": "node",
                                "plural": false,
                                "selections": [
                                  (v12/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "trackingId",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "estimatedDelivery",
                                    "storageKey": null
                                  },
                                  (v11/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "fulfillments(first:1)"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "lineItems(first:1)"
          },
          (v12/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "code",
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
            "args": (v13/*: any*/),
            "kind": "ScalarField",
            "name": "buyerTotal",
            "storageKey": "buyerTotal(precision:2)"
          },
          {
            "alias": null,
            "args": (v13/*: any*/),
            "kind": "ScalarField",
            "name": "taxTotal",
            "storageKey": "taxTotal(precision:2)"
          },
          {
            "alias": null,
            "args": (v13/*: any*/),
            "kind": "ScalarField",
            "name": "shippingTotal",
            "storageKey": "shippingTotal(precision:2)"
          },
          {
            "alias": null,
            "args": (v13/*: any*/),
            "kind": "ScalarField",
            "name": "totalListPrice",
            "storageKey": "totalListPrice(precision:2)"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "CreditCard",
            "kind": "LinkedField",
            "name": "creditCard",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "brand",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "lastDigits",
                "storageKey": null
              },
              (v11/*: any*/)
            ],
            "storageKey": null
          },
          (v11/*: any*/)
        ],
        "storageKey": "commerceOrder(id:\"order-id\")"
      }
    ]
  },
  "params": {
    "id": "a4aa5614acfbf5403705fd5458f368be",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "commerceOrder": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceOrder"
        },
        "commerceOrder.__isCommerceOrder": (v14/*: any*/),
        "commerceOrder.__typename": (v14/*: any*/),
        "commerceOrder.buyerTotal": (v15/*: any*/),
        "commerceOrder.code": (v14/*: any*/),
        "commerceOrder.createdAt": (v14/*: any*/),
        "commerceOrder.creditCard": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CreditCard"
        },
        "commerceOrder.creditCard.brand": (v14/*: any*/),
        "commerceOrder.creditCard.id": (v16/*: any*/),
        "commerceOrder.creditCard.lastDigits": (v14/*: any*/),
        "commerceOrder.id": (v16/*: any*/),
        "commerceOrder.lineItems": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceLineItemConnection"
        },
        "commerceOrder.lineItems.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "CommerceLineItemEdge"
        },
        "commerceOrder.lineItems.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceLineItem"
        },
        "commerceOrder.lineItems.edges.node.artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "commerceOrder.lineItems.edges.node.artwork.artistNames": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.date": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.dimensions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "dimensions"
        },
        "commerceOrder.lineItems.edges.node.artwork.dimensions.cm": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.dimensions.in": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.editionOf": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.id": (v16/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "commerceOrder.lineItems.edges.node.artwork.image.url": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.medium": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "commerceOrder.lineItems.edges.node.artwork.partner.id": (v16/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.partner.name": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.shippingOrigin": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.artwork.title": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.fulfillments": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceFulfillmentConnection"
        },
        "commerceOrder.lineItems.edges.node.fulfillments.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "CommerceFulfillmentEdge"
        },
        "commerceOrder.lineItems.edges.node.fulfillments.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceFulfillment"
        },
        "commerceOrder.lineItems.edges.node.fulfillments.edges.node.createdAt": (v14/*: any*/),
        "commerceOrder.lineItems.edges.node.fulfillments.edges.node.estimatedDelivery": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.fulfillments.edges.node.id": (v16/*: any*/),
        "commerceOrder.lineItems.edges.node.fulfillments.edges.node.trackingId": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.id": (v16/*: any*/),
        "commerceOrder.lineItems.edges.node.selectedShippingQuote": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceShippingQuote"
        },
        "commerceOrder.lineItems.edges.node.selectedShippingQuote.displayName": (v14/*: any*/),
        "commerceOrder.lineItems.edges.node.selectedShippingQuote.id": (v16/*: any*/),
        "commerceOrder.lineItems.edges.node.shipment": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceShipment"
        },
        "commerceOrder.lineItems.edges.node.shipment.deliveryEnd": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.shipment.deliveryStart": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.shipment.estimatedDeliveryWindow": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.shipment.id": (v16/*: any*/),
        "commerceOrder.lineItems.edges.node.shipment.status": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.shipment.trackingNumber": (v15/*: any*/),
        "commerceOrder.lineItems.edges.node.shipment.trackingUrl": (v15/*: any*/),
        "commerceOrder.requestedFulfillment": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceRequestedFulfillmentUnion"
        },
        "commerceOrder.requestedFulfillment.__typename": (v14/*: any*/),
        "commerceOrder.requestedFulfillment.addressLine1": (v15/*: any*/),
        "commerceOrder.requestedFulfillment.addressLine2": (v15/*: any*/),
        "commerceOrder.requestedFulfillment.city": (v15/*: any*/),
        "commerceOrder.requestedFulfillment.country": (v15/*: any*/),
        "commerceOrder.requestedFulfillment.name": (v15/*: any*/),
        "commerceOrder.requestedFulfillment.phoneNumber": (v15/*: any*/),
        "commerceOrder.requestedFulfillment.postalCode": (v15/*: any*/),
        "commerceOrder.requestedFulfillment.region": (v15/*: any*/),
        "commerceOrder.shippingTotal": (v15/*: any*/),
        "commerceOrder.state": {
          "enumValues": [
            "ABANDONED",
            "APPROVED",
            "CANCELED",
            "FULFILLED",
            "PENDING",
            "REFUNDED",
            "SUBMITTED"
          ],
          "nullable": false,
          "plural": false,
          "type": "CommerceOrderStateEnum"
        },
        "commerceOrder.taxTotal": (v15/*: any*/),
        "commerceOrder.totalListPrice": (v15/*: any*/)
      }
    },
    "name": "OrderDetailsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '76f7f61c266d40b4bf94126da71e5bb3';
export default node;
