import {
  addNewAddressMutation,
  addNewAddressMutationResponse,
  UserAddressAttributes,
} from "__generated__/addNewAddressMutation.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { commitMutation, graphql } from "react-relay"

export const createUserAddress = (address: UserAddressAttributes) => {
  return new Promise<addNewAddressMutationResponse>((resolve, reject) => {
    commitMutation<addNewAddressMutation>(defaultEnvironment, {
      variables: {
        input: {
          attributes: address,
        },
      },
      mutation: graphql`
        mutation addNewAddressMutation($input: CreateUserAddressInput!) {
          createUserAddress(input: $input) {
            userAddressOrErrors {
              ... on UserAddress {
                id
                internalID
                addressLine1
                addressLine2
                city
                country
                isDefault
                name
                phoneNumber
                postalCode
                region
              }
              ... on Errors {
                errors {
                  message
                }
              }
            }
          }
        }
      `,
      onCompleted: (response, err) => {
        if (err?.length) {
          reject(err)
        } else if (response.createUserAddress?.userAddressOrErrors.errors) {
          reject(response.createUserAddress.userAddressOrErrors.errors)
        } else {
          resolve(response)
        }
        console.log(response, "point MyResponceData")
      },
      onError: (e) => {
        console.log(e.message, " point myerrors")
        reject(e.message)
      },
    })
  })
}
