/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkArtistArticles_artwork = {
    readonly internalID: string;
    readonly slug: string;
    readonly artist: {
        readonly slug: string;
        readonly name: string | null;
        readonly internalID: string;
        readonly articlesConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly slug: string | null;
                    readonly internalID: string;
                    readonly href: string | null;
                    readonly thumbnailTitle: string | null;
                    readonly author: {
                        readonly name: string | null;
                    } | null;
                    readonly publishedAt: string | null;
                    readonly thumbnailImage: {
                        readonly url: string | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
    } | null;
    readonly " $refType": "MyCollectionArtworkArtistArticles_artwork";
};
export type MyCollectionArtworkArtistArticles_artwork$data = MyCollectionArtworkArtistArticles_artwork;
export type MyCollectionArtworkArtistArticles_artwork$key = {
    readonly " $data"?: MyCollectionArtworkArtistArticles_artwork$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkArtistArticles_artwork">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkArtistArticles_artwork",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "artist",
      "plural": false,
      "selections": [
        (v1/*: any*/),
        (v2/*: any*/),
        (v0/*: any*/),
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 3
            },
            {
              "kind": "Literal",
              "name": "inEditorialFeed",
              "value": true
            },
            {
              "kind": "Literal",
              "name": "sort",
              "value": "PUBLISHED_AT_DESC"
            }
          ],
          "concreteType": "ArticleConnection",
          "kind": "LinkedField",
          "name": "articlesConnection",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "ArticleEdge",
              "kind": "LinkedField",
              "name": "edges",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Article",
                  "kind": "LinkedField",
                  "name": "node",
                  "plural": false,
                  "selections": [
                    (v1/*: any*/),
                    (v0/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "href",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "thumbnailTitle",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Author",
                      "kind": "LinkedField",
                      "name": "author",
                      "plural": false,
                      "selections": [
                        (v2/*: any*/)
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": [
                        {
                          "kind": "Literal",
                          "name": "format",
                          "value": "MMM Do, YYYY"
                        }
                      ],
                      "kind": "ScalarField",
                      "name": "publishedAt",
                      "storageKey": "publishedAt(format:\"MMM Do, YYYY\")"
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "Image",
                      "kind": "LinkedField",
                      "name": "thumbnailImage",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "url",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": "articlesConnection(first:3,inEditorialFeed:true,sort:\"PUBLISHED_AT_DESC\")"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
})();
(node as any).hash = '9bdf0cb3c9557b2b0c1601fb6ca7c71e';
export default node;
