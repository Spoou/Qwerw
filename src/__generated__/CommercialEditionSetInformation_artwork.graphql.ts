/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommercialEditionSetInformation_artwork = {
    readonly editionSets: ReadonlyArray<{
        readonly id: string;
        readonly internalID: string;
        readonly saleMessage: string | null;
        readonly editionOf: string | null;
        readonly dimensions: {
            readonly in: string | null;
            readonly cm: string | null;
        } | null;
    } | null> | null;
    readonly " $fragmentRefs": FragmentRefs<"CommercialPartnerInformation_artwork">;
    readonly " $refType": "CommercialEditionSetInformation_artwork";
};
export type CommercialEditionSetInformation_artwork$data = CommercialEditionSetInformation_artwork;
export type CommercialEditionSetInformation_artwork$key = {
    readonly " $data"?: CommercialEditionSetInformation_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"CommercialEditionSetInformation_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CommercialEditionSetInformation_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "EditionSet",
      "kind": "LinkedField",
      "name": "editionSets",
      "plural": true,
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
          "name": "internalID",
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
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CommercialPartnerInformation_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'e8a7c66739dcb5af490a7dddbdc52d07';
export default node;
