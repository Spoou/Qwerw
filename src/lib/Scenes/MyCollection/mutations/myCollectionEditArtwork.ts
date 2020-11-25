import {
  myCollectionEditArtworkMutation,
  myCollectionEditArtworkMutationResponse,
  myCollectionEditArtworkMutationVariables,
} from "__generated__/myCollectionEditArtworkMutation.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { commitMutation, graphql } from "react-relay"

export function myCollectionEditArtwork(input: myCollectionEditArtworkMutationVariables["input"]) {
  return new Promise<myCollectionEditArtworkMutationResponse>((resolve, reject) => {
    commitMutation<myCollectionEditArtworkMutation>(defaultEnvironment, {
      mutation: graphql`
        mutation myCollectionEditArtworkMutation($input: MyCollectionUpdateArtworkInput!) {
          myCollectionUpdateArtwork(input: $input) {
            artworkOrError {
              ... on MyCollectionArtworkMutationSuccess {
                artwork {
                  ...MyCollectionArtwork_sharedProps
                }
              }
              ... on MyCollectionArtworkMutationFailure {
                mutationError {
                  message
                }
              }
            }
          }
        }
      `,
      variables: {
        input,
      },

      onCompleted: (response, errors) => {
        if (errors?.length) {
          reject(errors)
        } else if (response.myCollectionUpdateArtwork?.artworkOrError?.mutationError) {
          reject(response.myCollectionUpdateArtwork?.artworkOrError?.mutationError.message)
        } else {
          resolve(response)
        }
      },
      onError: reject,
    })
  })
}
