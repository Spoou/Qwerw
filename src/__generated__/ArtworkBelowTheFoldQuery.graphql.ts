/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash c7eefbb6fd7876631a78682a781bc8e1 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkBelowTheFoldQueryVariables = {
    artworkID: string;
};
export type ArtworkBelowTheFoldQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"Artwork_artworkBelowTheFold">;
    } | null;
};
export type ArtworkBelowTheFoldQuery = {
    readonly response: ArtworkBelowTheFoldQueryResponse;
    readonly variables: ArtworkBelowTheFoldQueryVariables;
};



/*
query ArtworkBelowTheFoldQuery(
  $artworkID: String!
) {
  artwork(id: $artworkID) {
    ...Artwork_artworkBelowTheFold
    id
  }
}

fragment AboutArtist_artwork on Artwork {
  artists {
    id
    biography_blurb: biographyBlurb {
      text
    }
    ...ArtistListItem_artist
  }
}

fragment AboutWork_artwork on Artwork {
  additional_information: additionalInformation
  description
  isInAuction
}

fragment ArtistListItem_artist on Artist {
  id
  internalID
  slug
  name
  initials
  href
  is_followed: isFollowed
  nationality
  birthday
  deathday
  image {
    url
  }
}

fragment ArtistSeriesMoreSeries_artist on Artist {
  internalID
  artistSeriesConnection(first: 4) {
    totalCount
    edges {
      node {
        slug
        internalID
        title
        featured
        artworksCountMessage
        image {
          url
        }
      }
    }
  }
}

fragment ArtworkDetails_artwork on Artwork {
  slug
  category
  conditionDescription {
    label
    details
  }
  signatureInfo {
    label
    details
  }
  certificateOfAuthenticity {
    label
    details
  }
  framed {
    label
    details
  }
  series
  publisher
  manufacturer
  image_rights: imageRights
  canRequestLotConditionsReport
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

fragment ArtworkHistory_artwork on Artwork {
  provenance
  exhibition_history: exhibitionHistory
  literature
}

fragment Artwork_artworkBelowTheFold on Artwork {
  additional_information: additionalInformation
  description
  provenance
  exhibition_history: exhibitionHistory
  literature
  partner {
    type
    id
  }
  artist {
    biography_blurb: biographyBlurb {
      text
    }
    artistSeriesConnection(first: 4) {
      totalCount
    }
    ...ArtistSeriesMoreSeries_artist
    id
  }
  sale {
    id
    isBenefit
    isGalleryAuction
  }
  category
  canRequestLotConditionsReport
  conditionDescription {
    details
  }
  signature
  signatureInfo {
    details
  }
  certificateOfAuthenticity {
    details
  }
  framed {
    details
  }
  series
  publisher
  manufacturer
  image_rights: imageRights
  context {
    __typename
    ... on Sale {
      isAuction
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
  contextGrids {
    __typename
    artworks: artworksConnection(first: 6) {
      edges {
        node {
          id
        }
      }
    }
  }
  artistSeriesConnection(first: 1) {
    edges {
      node {
        filterArtworksConnection(sort: "-decayed_merch", first: 20) {
          edges {
            node {
              id
            }
          }
          id
        }
      }
    }
  }
  ...PartnerCard_artwork
  ...AboutWork_artwork
  ...OtherWorks_artwork
  ...AboutArtist_artwork
  ...ArtworkDetails_artwork
  ...ContextCard_artwork
  ...ArtworkHistory_artwork
  ...ArtworksInSeriesRail_artwork
}

fragment ArtworksInSeriesRail_artwork on Artwork {
  internalID
  slug
  artistSeriesConnection(first: 1) {
    edges {
      node {
        slug
        internalID
        filterArtworksConnection(sort: "-decayed_merch", first: 20) {
          edges {
            node {
              slug
              internalID
              href
              artistNames
              image {
                imageURL
                aspectRatio
              }
              sale {
                isAuction
                isClosed
                displayTimelyAt
                id
              }
              saleArtwork {
                counts {
                  bidderPositions
                }
                currentBid {
                  display
                }
                id
              }
              saleMessage
              title
              date
              partner {
                name
                id
              }
              id
            }
          }
          id
        }
      }
    }
  }
}

fragment ContextCard_artwork on Artwork {
  id
  context {
    __typename
    ... on Sale {
      id
      name
      isLiveOpen
      href
      formattedStartDateTime
      isAuction
      coverImage {
        url
      }
    }
    ... on Fair {
      id
      name
      href
      exhibitionPeriod
      image {
        url
      }
    }
    ... on Show {
      id
      internalID
      slug
      name
      href
      exhibitionPeriod
      isFollowed
      coverImage {
        url
      }
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
}

fragment GenericGrid_artworks on Artwork {
  id
  image {
    aspect_ratio: aspectRatio
  }
  ...ArtworkGridItem_artwork
}

fragment OtherWorks_artwork on Artwork {
  contextGrids {
    __typename
    title
    ctaTitle
    ctaHref
    artworks: artworksConnection(first: 6) {
      edges {
        node {
          ...GenericGrid_artworks
          id
        }
      }
    }
  }
}

fragment PartnerCard_artwork on Artwork {
  sale {
    isBenefit
    isGalleryAuction
    id
  }
  partner {
    cities
    is_default_profile_public: isDefaultProfilePublic
    type
    name
    slug
    id
    href
    initials
    profile {
      id
      internalID
      is_followed: isFollowed
      icon {
        url(version: "square140")
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artworkID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artworkID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "initials",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v8 = {
  "alias": "is_followed",
  "args": null,
  "kind": "ScalarField",
  "name": "isFollowed",
  "storageKey": null
},
v9 = {
  "alias": "biography_blurb",
  "args": null,
  "concreteType": "ArtistBlurb",
  "kind": "LinkedField",
  "name": "biographyBlurb",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "text",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v11 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "url",
    "storageKey": null
  }
],
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "image",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v13 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "details",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "label",
    "storageKey": null
  }
],
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAuction",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "coverImage",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "exhibitionPeriod",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "aspectRatio",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleMessage",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isClosed",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTimelyAt",
  "storageKey": null
},
v24 = {
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
v25 = {
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
v26 = {
  "alias": null,
  "args": null,
  "concreteType": "Partner",
  "kind": "LinkedField",
  "name": "partner",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v2/*: any*/)
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtworkBelowTheFoldQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Artwork_artworkBelowTheFold"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtworkBelowTheFoldQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "alias": "additional_information",
            "args": null,
            "kind": "ScalarField",
            "name": "additionalInformation",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "provenance",
            "storageKey": null
          },
          {
            "alias": "exhibition_history",
            "args": null,
            "kind": "ScalarField",
            "name": "exhibitionHistory",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "literature",
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "type",
                "storageKey": null
              },
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cities",
                "storageKey": null
              },
              {
                "alias": "is_default_profile_public",
                "args": null,
                "kind": "ScalarField",
                "name": "isDefaultProfilePublic",
                "storageKey": null
              },
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
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
                            "value": "square140"
                          }
                        ],
                        "kind": "ScalarField",
                        "name": "url",
                        "storageKey": "url(version:\"square140\")"
                      }
                    ],
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
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artist",
            "plural": false,
            "selections": [
              (v9/*: any*/),
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 4
                  }
                ],
                "concreteType": "ArtistSeriesConnection",
                "kind": "LinkedField",
                "name": "artistSeriesConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "totalCount",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArtistSeriesEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ArtistSeries",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          (v7/*: any*/),
                          (v10/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "featured",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "artworksCountMessage",
                            "storageKey": null
                          },
                          (v12/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "artistSeriesConnection(first:4)"
              },
              (v7/*: any*/),
              (v2/*: any*/)
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
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isBenefit",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isGalleryAuction",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "category",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "canRequestLotConditionsReport",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "kind": "LinkedField",
            "name": "conditionDescription",
            "plural": false,
            "selections": (v13/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "signature",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "kind": "LinkedField",
            "name": "signatureInfo",
            "plural": false,
            "selections": (v13/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "kind": "LinkedField",
            "name": "certificateOfAuthenticity",
            "plural": false,
            "selections": (v13/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "kind": "LinkedField",
            "name": "framed",
            "plural": false,
            "selections": (v13/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "series",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "publisher",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "manufacturer",
            "storageKey": null
          },
          {
            "alias": "image_rights",
            "args": null,
            "kind": "ScalarField",
            "name": "imageRights",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "context",
            "plural": false,
            "selections": [
              (v14/*: any*/),
              {
                "kind": "InlineFragment",
                "selections": [
                  (v15/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isLiveOpen",
                    "storageKey": null
                  },
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "formattedStartDateTime",
                    "storageKey": null
                  },
                  (v16/*: any*/)
                ],
                "type": "Sale",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v2/*: any*/)
                ],
                "type": "Node",
                "abstractKey": "__isNode"
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v5/*: any*/),
                  (v17/*: any*/),
                  (v12/*: any*/)
                ],
                "type": "Fair",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v2/*: any*/),
                  (v7/*: any*/),
                  (v4/*: any*/),
                  (v3/*: any*/),
                  (v5/*: any*/),
                  (v17/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isFollowed",
                    "storageKey": null
                  },
                  (v16/*: any*/)
                ],
                "type": "Show",
                "abstractKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "contextGrids",
            "plural": true,
            "selections": [
              (v14/*: any*/),
              {
                "alias": "artworks",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 6
                  }
                ],
                "concreteType": "ArtworkConnection",
                "kind": "LinkedField",
                "name": "artworksConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArtworkEdge",
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
                          (v2/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": [
                              {
                                "alias": "aspect_ratio",
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
                              },
                              (v18/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v10/*: any*/),
                          (v19/*: any*/),
                          (v20/*: any*/),
                          (v4/*: any*/),
                          (v7/*: any*/),
                          (v21/*: any*/),
                          (v5/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              (v15/*: any*/),
                              (v22/*: any*/),
                              (v23/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "endAt",
                                "storageKey": null
                              },
                              (v2/*: any*/)
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
                              (v24/*: any*/),
                              (v25/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "lotLabel",
                                "storageKey": null
                              },
                              (v2/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v26/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "artworksConnection(first:6)"
              },
              (v10/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "ctaTitle",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "ctaHref",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              }
            ],
            "concreteType": "ArtistSeriesConnection",
            "kind": "LinkedField",
            "name": "artistSeriesConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ArtistSeriesEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArtistSeries",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "first",
                            "value": 20
                          },
                          {
                            "kind": "Literal",
                            "name": "sort",
                            "value": "-decayed_merch"
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
                                  (v2/*: any*/),
                                  (v4/*: any*/),
                                  (v7/*: any*/),
                                  (v5/*: any*/),
                                  (v21/*: any*/),
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
                                      (v18/*: any*/)
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
                                      (v15/*: any*/),
                                      (v22/*: any*/),
                                      (v23/*: any*/),
                                      (v2/*: any*/)
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
                                      (v24/*: any*/),
                                      (v25/*: any*/),
                                      (v2/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v20/*: any*/),
                                  (v10/*: any*/),
                                  (v19/*: any*/),
                                  (v26/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ],
                        "storageKey": "filterArtworksConnection(first:20,sort:\"-decayed_merch\")"
                      },
                      (v4/*: any*/),
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "artistSeriesConnection(first:1)"
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isInAuction",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artists",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v9/*: any*/),
              (v7/*: any*/),
              (v4/*: any*/),
              (v3/*: any*/),
              (v6/*: any*/),
              (v5/*: any*/),
              (v8/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "nationality",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "birthday",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "deathday",
                "storageKey": null
              },
              (v12/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/),
          (v2/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "c7eefbb6fd7876631a78682a781bc8e1",
    "metadata": {},
    "name": "ArtworkBelowTheFoldQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '72cb482f87d89456b64301d0e0fe0405';
export default node;
