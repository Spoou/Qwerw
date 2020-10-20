/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkAggregation = "ARTIST" | "COLOR" | "DIMENSION_RANGE" | "FOLLOWED_ARTISTS" | "GALLERY" | "INSTITUTION" | "MAJOR_PERIOD" | "MEDIUM" | "MERCHANDISABLE_ARTISTS" | "PARTNER_CITY" | "PERIOD" | "PRICE_RANGE" | "TOTAL" | "%future added value";
export type Fair2AllFollowedArtists_fairForFilters = {
    readonly filterArtworksConnection: {
        readonly aggregations: ReadonlyArray<{
            readonly slice: ArtworkAggregation | null;
            readonly counts: ReadonlyArray<{
                readonly count: number;
                readonly name: string;
                readonly value: string;
            } | null> | null;
        } | null> | null;
        readonly counts: {
            readonly followedArtists: number | null;
        } | null;
    } | null;
    readonly " $refType": "Fair2AllFollowedArtists_fairForFilters";
};
export type Fair2AllFollowedArtists_fairForFilters$data = Fair2AllFollowedArtists_fairForFilters;
export type Fair2AllFollowedArtists_fairForFilters$key = {
    readonly " $data"?: Fair2AllFollowedArtists_fairForFilters$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2AllFollowedArtists_fairForFilters">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Fair2AllFollowedArtists_fairForFilters",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "aggregations",
          "value": [
            "COLOR",
            "DIMENSION_RANGE",
            "GALLERY",
            "INSTITUTION",
            "MAJOR_PERIOD",
            "MEDIUM",
            "PRICE_RANGE",
            "FOLLOWED_ARTISTS",
            "ARTIST"
          ]
        },
        {
          "kind": "Literal",
          "name": "first",
          "value": 0
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
          "concreteType": "ArtworksAggregationResults",
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
          "concreteType": "FilterArtworksCounts",
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
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "filterArtworksConnection(aggregations:[\"COLOR\",\"DIMENSION_RANGE\",\"GALLERY\",\"INSTITUTION\",\"MAJOR_PERIOD\",\"MEDIUM\",\"PRICE_RANGE\",\"FOLLOWED_ARTISTS\",\"ARTIST\"],first:0)"
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
(node as any).hash = '14d26078c5eab34115831f864fa04f30';
export default node;
