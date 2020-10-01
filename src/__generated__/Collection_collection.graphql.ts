/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Collection_collection = {
    readonly id: string;
    readonly slug: string;
    readonly isDepartment: boolean;
    readonly linkedCollections: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"CollectionHubsRails_linkedCollections">;
    }>;
    readonly " $fragmentRefs": FragmentRefs<"CollectionHeader_collection" | "CollectionArtworks_collection" | "FeaturedArtists_collection" | "CollectionHubsRails_collection">;
    readonly " $refType": "Collection_collection";
};
export type Collection_collection$data = Collection_collection;
export type Collection_collection$key = {
    readonly " $data"?: Collection_collection$data;
    readonly " $fragmentRefs": FragmentRefs<"Collection_collection">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": 500,
      "kind": "LocalArgument",
      "name": "screenWidth"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "Collection_collection",
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
      "name": "isDepartment",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "MarketingCollectionGroup",
      "kind": "LinkedField",
      "name": "linkedCollections",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "CollectionHubsRails_linkedCollections"
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CollectionHeader_collection"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CollectionArtworks_collection"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FeaturedArtists_collection"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CollectionHubsRails_collection"
    }
  ],
  "type": "MarketingCollection",
  "abstractKey": null
};
(node as any).hash = '772fca1c6419295f14c6a3689e3e626c';
export default node;
