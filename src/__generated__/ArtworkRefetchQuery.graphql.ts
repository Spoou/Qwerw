/* tslint:disable */
/* eslint-disable */
/* @relayHash d2ceab5938663976e5306f924139d74c */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkRefetchQueryVariables = {
    artworkID: string;
};
export type ArtworkRefetchQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"Artwork_artworkAboveTheFold" | "Artwork_artworkBelowTheFold">;
    } | null;
};
export type ArtworkRefetchQuery = {
    readonly response: ArtworkRefetchQueryResponse;
    readonly variables: ArtworkRefetchQueryVariables;
};



/*
query ArtworkRefetchQuery(
  $artworkID: String!
) {
  artwork(id: $artworkID) {
    ...Artwork_artworkAboveTheFold
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

fragment ArtworkActions_artwork on Artwork {
  id
  internalID
  slug
  title
  href
  is_saved: isSaved
  is_hangable: isHangable
  artists {
    name
    id
  }
  image {
    url
  }
  sale {
    isAuction
    isClosed
    id
  }
  widthCm
  heightCm
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

fragment ArtworkExtraLinks_artwork on Artwork {
  isAcquireable
  isInAuction
  isOfferable
  title
  isForSale
  sale {
    isClosed
    isBenefit
    partner {
      name
      id
    }
    id
  }
  artists {
    isConsignable
    name
    id
  }
  artist {
    name
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

fragment ArtworkHeader_artwork on Artwork {
  ...ArtworkActions_artwork
  ...ArtworkTombstone_artwork
  images {
    ...ImageCarousel_images
  }
}

fragment ArtworkHistory_artwork on Artwork {
  provenance
  exhibition_history: exhibitionHistory
  literature
}

fragment ArtworkTombstone_artwork on Artwork {
  title
  isInAuction
  medium
  date
  cultural_maker: culturalMaker
  saleArtwork {
    lotLabel
    estimate
    id
  }
  partner {
    name
    id
  }
  sale {
    isClosed
    id
  }
  artists {
    name
    href
    ...FollowArtistButton_artist
    id
  }
  dimensions {
    in
    cm
  }
  edition_of: editionOf
  attribution_class: attributionClass {
    shortDescription
    id
  }
}

fragment Artwork_artworkAboveTheFold on Artwork {
  ...ArtworkHeader_artwork
  ...CommercialInformation_artwork
  slug
  internalID
  id
  is_acquireable: isAcquireable
  is_offerable: isOfferable
  is_biddable: isBiddable
  is_inquireable: isInquireable
  availability
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

fragment AuctionPrice_artwork on Artwork {
  sale {
    internalID
    isWithBuyersPremium
    isClosed
    isLiveOpen
    id
  }
  saleArtwork {
    reserveMessage
    currentBid {
      display
    }
    counts {
      bidderPositions
    }
    id
  }
  myLotStanding(live: true) {
    activeBid {
      isWinning
      id
    }
    mostRecentBid {
      maxBid {
        display
      }
      id
    }
  }
}

fragment BidButton_artwork on Artwork {
  slug
  sale {
    slug
    registrationStatus {
      qualifiedForBidding
      id
    }
    isPreview
    isLiveOpen
    isClosed
    isRegistrationClosed
    requireIdentityVerification
    id
  }
  myLotStanding(live: true) {
    mostRecentBid {
      maxBid {
        cents
      }
      id
    }
  }
  saleArtwork {
    increments {
      cents
    }
    id
  }
}

fragment BuyNowButton_artwork on Artwork {
  internalID
  saleMessage
}

fragment CollapsibleArtworkDetails_artwork on Artwork {
  image {
    url
    width
    height
  }
  internalID
  isPriceHidden
  title
  date
  medium
  dimensions {
    in
    cm
  }
  editionOf
  signatureInfo {
    details
  }
  artist {
    name
    id
  }
}

fragment CommercialButtons_artwork on Artwork {
  slug
  isAcquireable
  isOfferable
  isInquireable
  isInAuction
  isBuyNowable
  isForSale
  editionSets {
    id
  }
  sale {
    isClosed
    id
  }
  ...BuyNowButton_artwork
  ...BidButton_artwork
  ...MakeOfferButton_artwork
  ...InquiryButtons_artwork
}

fragment CommercialEditionSetInformation_artwork on Artwork {
  editionSets {
    id
    internalID
    saleMessage
    editionOf
    dimensions {
      in
      cm
    }
  }
  ...CommercialPartnerInformation_artwork
}

fragment CommercialInformation_artwork on Artwork {
  isAcquireable
  isOfferable
  isInquireable
  isInAuction
  availability
  saleMessage
  isForSale
  internalID
  slug
  artists {
    isConsignable
    id
  }
  editionSets {
    id
  }
  sale {
    internalID
    isClosed
    isAuction
    isLiveOpen
    isPreview
    liveStartAt
    endAt
    slug
    startAt
    id
  }
  ...CommercialButtons_artwork
  ...CommercialPartnerInformation_artwork
  ...CommercialEditionSetInformation_artwork
  ...ArtworkExtraLinks_artwork
  ...AuctionPrice_artwork
}

fragment CommercialPartnerInformation_artwork on Artwork {
  availability
  isAcquireable
  isForSale
  isOfferable
  shippingOrigin
  shippingInfo
  priceIncludesTaxDisplay
  partner {
    name
    id
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
      id
    }
  }
}

fragment FollowArtistButton_artist on Artist {
  id
  slug
  internalID
  is_followed: isFollowed
}

fragment GenericGrid_artworks on Artwork {
  id
  image {
    aspect_ratio: aspectRatio
  }
  ...ArtworkGridItem_artwork
}

fragment ImageCarousel_images on Image {
  url: imageURL
  width
  height
  imageVersions
  deepZoom {
    image: Image {
      tileSize: TileSize
      url: Url
      format: Format
      size: Size {
        width: Width
        height: Height
      }
    }
  }
}

fragment InquiryButtons_artwork on Artwork {
  image {
    url
    width
    height
  }
  internalID
  isPriceHidden
  title
  date
  medium
  dimensions {
    in
    cm
  }
  editionOf
  signatureInfo {
    details
  }
  artist {
    name
    id
  }
  ...InquiryModal_artwork
}

fragment InquiryModal_artwork on Artwork {
  ...CollapsibleArtworkDetails_artwork
}

fragment MakeOfferButton_artwork on Artwork {
  internalID
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
    "kind": "LocalArgument",
    "name": "artworkID",
    "type": "String!",
    "defaultValue": null
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
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": "is_followed",
  "name": "isFollowed",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "LinkedField",
  "alias": "biography_blurb",
  "name": "biographyBlurb",
  "storageKey": null,
  "args": null,
  "concreteType": "ArtistBlurb",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "text",
      "args": null,
      "storageKey": null
    }
  ]
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "initials",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v12 = [
  (v11/*: any*/)
],
v13 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v12/*: any*/)
},
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "width",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "height",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isAuction",
  "args": null,
  "storageKey": null
},
v17 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isClosed",
  "args": null,
  "storageKey": null
},
v18 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isLiveOpen",
  "args": null,
  "storageKey": null
},
v19 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "endAt",
  "args": null,
  "storageKey": null
},
v20 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": [
    (v7/*: any*/),
    (v2/*: any*/)
  ]
},
v21 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "date",
  "args": null,
  "storageKey": null
},
v22 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cents",
  "args": null,
  "storageKey": null
},
v23 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v24 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "currentBid",
  "storageKey": null,
  "args": null,
  "concreteType": "SaleArtworkCurrentBid",
  "plural": false,
  "selections": [
    (v23/*: any*/)
  ]
},
v25 = {
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
v26 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "dimensions",
  "storageKey": null,
  "args": null,
  "concreteType": "dimensions",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "in",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "cm",
      "args": null,
      "storageKey": null
    }
  ]
},
v27 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "saleMessage",
  "args": null,
  "storageKey": null
},
v28 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "editionOf",
  "args": null,
  "storageKey": null
},
v29 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "details",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "label",
    "args": null,
    "storageKey": null
  }
],
v30 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v31 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "coverImage",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v12/*: any*/)
},
v32 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "exhibitionPeriod",
  "args": null,
  "storageKey": null
},
v33 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "aspectRatio",
  "args": null,
  "storageKey": null
},
v34 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artistNames",
  "args": null,
  "storageKey": null
},
v35 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "displayTimelyAt",
  "args": null,
  "storageKey": null
},
v36 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "saleArtwork",
  "storageKey": null,
  "args": null,
  "concreteType": "SaleArtwork",
  "plural": false,
  "selections": [
    (v25/*: any*/),
    (v24/*: any*/),
    (v2/*: any*/)
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtworkRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Artwork_artworkAboveTheFold",
            "args": null
          },
          {
            "kind": "FragmentSpread",
            "name": "Artwork_artworkBelowTheFold",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtworkRefetchQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "kind": "ScalarField",
            "alias": "is_saved",
            "name": "isSaved",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "is_hangable",
            "name": "isHangable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              (v7/*: any*/),
              (v2/*: any*/),
              (v6/*: any*/),
              (v4/*: any*/),
              (v3/*: any*/),
              (v8/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isConsignable",
                "args": null,
                "storageKey": null
              },
              (v9/*: any*/),
              (v10/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "nationality",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "birthday",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "deathday",
                "args": null,
                "storageKey": null
              },
              (v13/*: any*/)
            ]
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
              (v11/*: any*/),
              (v14/*: any*/),
              (v15/*: any*/)
            ]
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
              (v16/*: any*/),
              (v17/*: any*/),
              (v2/*: any*/),
              (v3/*: any*/),
              (v18/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isPreview",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "liveStartAt",
                "args": null,
                "storageKey": null
              },
              (v19/*: any*/),
              (v4/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "startAt",
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
                  (v2/*: any*/)
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isRegistrationClosed",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "requireIdentityVerification",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isBenefit",
                "args": null,
                "storageKey": null
              },
              (v20/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isWithBuyersPremium",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isGalleryAuction",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "widthCm",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "heightCm",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isInAuction",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "medium",
            "args": null,
            "storageKey": null
          },
          (v21/*: any*/),
          {
            "kind": "ScalarField",
            "alias": "cultural_maker",
            "name": "culturalMaker",
            "args": null,
            "storageKey": null
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
                "kind": "ScalarField",
                "alias": null,
                "name": "lotLabel",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "estimate",
                "args": null,
                "storageKey": null
              },
              (v2/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "increments",
                "storageKey": null,
                "args": null,
                "concreteType": "BidIncrementsFormatted",
                "plural": true,
                "selections": [
                  (v22/*: any*/)
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "reserveMessage",
                "args": null,
                "storageKey": null
              },
              (v24/*: any*/),
              (v25/*: any*/)
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
              (v7/*: any*/),
              (v2/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "type",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "cities",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": "is_default_profile_public",
                "name": "isDefaultProfilePublic",
                "args": null,
                "storageKey": null
              },
              (v4/*: any*/),
              (v6/*: any*/),
              (v10/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "profile",
                "storageKey": null,
                "args": null,
                "concreteType": "Profile",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v8/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "icon",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Image",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "url",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "version",
                            "value": "square140"
                          }
                        ],
                        "storageKey": "url(version:\"square140\")"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          (v26/*: any*/),
          {
            "kind": "ScalarField",
            "alias": "edition_of",
            "name": "editionOf",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "attribution_class",
            "name": "attributionClass",
            "storageKey": null,
            "args": null,
            "concreteType": "AttributionClass",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "shortDescription",
                "args": null,
                "storageKey": null
              },
              (v2/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "images",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": "url",
                "name": "imageURL",
                "args": null,
                "storageKey": null
              },
              (v14/*: any*/),
              (v15/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "imageVersions",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "deepZoom",
                "storageKey": null,
                "args": null,
                "concreteType": "DeepZoom",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": "image",
                    "name": "Image",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "DeepZoomImage",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": "tileSize",
                        "name": "TileSize",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "url",
                        "name": "Url",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "format",
                        "name": "Format",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": "size",
                        "name": "Size",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "DeepZoomImageSize",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": "width",
                            "name": "Width",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "height",
                            "name": "Height",
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
            "name": "isAcquireable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isOfferable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isInquireable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "availability",
            "args": null,
            "storageKey": null
          },
          (v27/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isForSale",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "editionSets",
            "storageKey": null,
            "args": null,
            "concreteType": "EditionSet",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v27/*: any*/),
              (v28/*: any*/),
              (v26/*: any*/)
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isBuyNowable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "myLotStanding",
            "storageKey": "myLotStanding(live:true)",
            "args": [
              {
                "kind": "Literal",
                "name": "live",
                "value": true
              }
            ],
            "concreteType": "LotStanding",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "mostRecentBid",
                "storageKey": null,
                "args": null,
                "concreteType": "BidderPosition",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "maxBid",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "BidderPositionMaxBid",
                    "plural": false,
                    "selections": [
                      (v22/*: any*/),
                      (v23/*: any*/)
                    ]
                  },
                  (v2/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "activeBid",
                "storageKey": null,
                "args": null,
                "concreteType": "BidderPosition",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "isWinning",
                    "args": null,
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ]
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isPriceHidden",
            "args": null,
            "storageKey": null
          },
          (v28/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "signatureInfo",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "plural": false,
            "selections": (v29/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artist",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              (v7/*: any*/),
              (v2/*: any*/),
              (v9/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "artistSeriesConnection",
                "storageKey": "artistSeriesConnection(first:4)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 4
                  }
                ],
                "concreteType": "ArtistSeriesConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "totalCount",
                    "args": null,
                    "storageKey": null
                  },
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
                          (v4/*: any*/),
                          (v3/*: any*/),
                          (v5/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "featured",
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
                          (v13/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              },
              (v3/*: any*/)
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "shippingOrigin",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "shippingInfo",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "priceIncludesTaxDisplay",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "is_acquireable",
            "name": "isAcquireable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "is_offerable",
            "name": "isOfferable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "is_biddable",
            "name": "isBiddable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "is_inquireable",
            "name": "isInquireable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "additional_information",
            "name": "additionalInformation",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "description",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "provenance",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "exhibition_history",
            "name": "exhibitionHistory",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "literature",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "category",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "canRequestLotConditionsReport",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "conditionDescription",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "plural": false,
            "selections": (v29/*: any*/)
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "signature",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "certificateOfAuthenticity",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "plural": false,
            "selections": (v29/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "framed",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtworkInfoRow",
            "plural": false,
            "selections": (v29/*: any*/)
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "series",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "publisher",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "manufacturer",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "image_rights",
            "name": "imageRights",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "context",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              (v30/*: any*/),
              (v2/*: any*/),
              {
                "kind": "InlineFragment",
                "type": "Sale",
                "selections": [
                  (v16/*: any*/),
                  (v7/*: any*/),
                  (v18/*: any*/),
                  (v6/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "formattedStartDateTime",
                    "args": null,
                    "storageKey": null
                  },
                  (v31/*: any*/)
                ]
              },
              {
                "kind": "InlineFragment",
                "type": "Fair",
                "selections": [
                  (v7/*: any*/),
                  (v6/*: any*/),
                  (v32/*: any*/),
                  (v13/*: any*/)
                ]
              },
              {
                "kind": "InlineFragment",
                "type": "Show",
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v7/*: any*/),
                  (v6/*: any*/),
                  (v32/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "isFollowed",
                    "args": null,
                    "storageKey": null
                  },
                  (v31/*: any*/)
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "contextGrids",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": "artworks",
                "name": "artworksConnection",
                "storageKey": "artworksConnection(first:6)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 6
                  }
                ],
                "concreteType": "ArtworkConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ArtworkEdge",
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
                                "alias": "aspect_ratio",
                                "name": "aspectRatio",
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
                              },
                              (v33/*: any*/)
                            ]
                          },
                          (v5/*: any*/),
                          (v21/*: any*/),
                          (v27/*: any*/),
                          (v4/*: any*/),
                          (v3/*: any*/),
                          (v34/*: any*/),
                          (v6/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "sale",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Sale",
                            "plural": false,
                            "selections": [
                              (v16/*: any*/),
                              (v17/*: any*/),
                              (v35/*: any*/),
                              (v19/*: any*/),
                              (v2/*: any*/)
                            ]
                          },
                          (v36/*: any*/),
                          (v20/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              },
              (v30/*: any*/),
              (v5/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "ctaTitle",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "ctaHref",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artistSeriesConnection",
            "storageKey": "artistSeriesConnection(first:1)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              }
            ],
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
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "filterArtworksConnection",
                        "storageKey": "filterArtworksConnection(first:20,sort:\"-decayed_merch\")",
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
                        "plural": false,
                        "selections": [
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
                                  (v4/*: any*/),
                                  (v3/*: any*/),
                                  (v6/*: any*/),
                                  (v34/*: any*/),
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
                                        "name": "imageURL",
                                        "args": null,
                                        "storageKey": null
                                      },
                                      (v33/*: any*/)
                                    ]
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
                                      (v16/*: any*/),
                                      (v17/*: any*/),
                                      (v35/*: any*/),
                                      (v2/*: any*/)
                                    ]
                                  },
                                  (v36/*: any*/),
                                  (v27/*: any*/),
                                  (v5/*: any*/),
                                  (v21/*: any*/),
                                  (v20/*: any*/)
                                ]
                              }
                            ]
                          },
                          (v2/*: any*/)
                        ]
                      },
                      (v4/*: any*/),
                      (v3/*: any*/)
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtworkRefetchQuery",
    "id": "8280850ba027d6e5af7f5e0b48235679",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '6244b7769eb61f304692332f11e580b5';
export default node;
