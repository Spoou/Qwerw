/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InquiryModal_artwork = {
    readonly inquiryQuestions: ReadonlyArray<{
        readonly id: string;
        readonly question: string;
    } | null> | null;
    readonly " $fragmentRefs": FragmentRefs<"CollapsibleArtworkDetails_artwork">;
    readonly " $refType": "InquiryModal_artwork";
};
export type InquiryModal_artwork$data = InquiryModal_artwork;
export type InquiryModal_artwork$key = {
    readonly " $data"?: InquiryModal_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"InquiryModal_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "InquiryModal_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "InquiryQuestion",
      "kind": "LinkedField",
      "name": "inquiryQuestions",
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
          "name": "question",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CollapsibleArtworkDetails_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '33b45bc61de2efc8692d652a1873f1de';
export default node;
