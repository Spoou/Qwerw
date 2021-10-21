/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Partner_partner = {
    readonly id: string;
    readonly internalID: string;
    readonly slug: string;
    readonly partnerType: string | null;
    readonly displayFullPartnerPage: boolean | null;
    readonly profile: {
        readonly id: string;
        readonly isFollowed: boolean | null;
        readonly internalID: string;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"PartnerArtwork_partner" | "PartnerOverview_partner" | "PartnerShows_partner" | "PartnerHeader_partner" | "PartnerSubscriberBanner_partner">;
    readonly " $refType": "Partner_partner";
};
export type Partner_partner$data = Partner_partner;
export type Partner_partner$key = {
    readonly " $data"?: Partner_partner$data;
    readonly " $fragmentRefs": FragmentRefs<"Partner_partner">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Partner_partner",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
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
      "name": "partnerType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "displayFullPartnerPage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Profile",
      "kind": "LinkedField",
      "name": "profile",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isFollowed",
          "storageKey": null
        },
        (v1/*: any*/)
      ],
      "storageKey": null
    },
    {
      "args": [
        {
          "kind": "Literal",
          "name": "input",
          "value": {
            "dimensionRange": "*-*",
            "sort": "-partner_updated_at"
          }
        }
      ],
      "kind": "FragmentSpread",
      "name": "PartnerArtwork_partner"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PartnerOverview_partner"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PartnerShows_partner"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PartnerHeader_partner"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PartnerSubscriberBanner_partner"
    }
  ],
  "type": "Partner",
  "abstractKey": null
};
})();
(node as any).hash = 'e5e9c69ebb368e05baef4c0b8b0d7467';
export default node;
