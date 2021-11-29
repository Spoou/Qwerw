/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SavedSearchButton_me = {
    readonly savedSearch: {
        readonly internalID: string;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ContentRefetchContainer_me">;
    readonly " $refType": "SavedSearchButton_me";
};
export type SavedSearchButton_me$data = SavedSearchButton_me;
export type SavedSearchButton_me$key = {
    readonly " $data"?: SavedSearchButton_me$data;
    readonly " $fragmentRefs": FragmentRefs<"SavedSearchButton_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "criteria"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "SavedSearchButton_me",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "criteria",
          "variableName": "criteria"
        }
      ],
      "concreteType": "SearchCriteria",
      "kind": "LinkedField",
      "name": "savedSearch",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "internalID",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ContentRefetchContainer_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'ce8ceb250107eaa44583e0f20e8a297a';
export default node;
