//#region Customer fragment

import { StorefrontShopifyFragments } from '../types'

export const CustomerFragment = `
    fragment CustomerFragment on Customer {
        id
        firstName
        lastName
        email
        phone
        defaultAddress {
            id
         }
    }
`

export type CustomerFragmentData = {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  defaultAddress?: {
    id: string
  }
}

//#endregion

//#region UserError fragment

export const UserErrorFragment = `
    fragment UserErrorFragment on UserError {
        field
        message
    }
`

export type UserErrorFragmentData = {
  field?: string[]
  message: string
}

//#endregion

//#region UserError fragment

export const CustomerUserErrorFragment = `
    fragment CustomerUserErrorFragment on CustomerUserError {
        field
        message
    }
`

export type CustomerUserErrorFragmentData = {
  field?: string[]
  code?: string
  message: string
}

//#endregion

//#region login

export const CustomerAccessTokenCreateMutation = ({
  customerUserErrorFragment,
}: {
  customerUserErrorFragment: string
}) => `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!){
        customerAccessTokenCreate(input: $input) {
            customerAccessToken {
                accessToken
                expiresAt
            }
            customerUserErrors {
                ...CustomerUserErrorFragment
            }
        }
    }
    ${customerUserErrorFragment}
`

export type CustomerAccessTokenCreateMutationVariables = {
  input: {
    email: string
    password: string
  }
}

export type CustomerAccessTokenCreateMutationData = {
  customerAccessTokenCreate: {
    customerAccessToken: {
      accessToken: string
      expiresAt: string
    }
    customerUserErrors: StorefrontShopifyFragments['customerUserErrorFragment'][]
  }
}

//#endregion

//#region logout

export const CustomerAccessTokenDeleteMutation = ({
  userErrorFragment,
}: {
  userErrorFragment: string
}) => `
    mutation customerAccessTokenDelete($customerAccessToken: String!){
        customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
            userErrors {
                ...UserErrorFragment
            }
        }
    }
    ${userErrorFragment}
`

export type CustomerAccessTokenDeleteMutationVariables = {
  customerAccessToken: string
}

export type CustomerAccessTokenDeleteMutationData = {
  customerAccessTokenDelete: {
    userErrors: StorefrontShopifyFragments['userErrorFragment'][]
  }
}

//#endregion

//#region signup

export const CustomerCreateMutation = ({
  customerFragment,
  customerUserErrorFragment,
}: {
  customerFragment: string
  customerUserErrorFragment: string
}) => `
    mutation customerCreate($input: CustomerCreateInput!){
        customerCreate(input: $input) {
            customer {
                ...CustomerFragment
            }
            customerUserErrors {
                ...CustomerUserErrorFragment
            }
        }
    }
    ${customerFragment}
    ${customerUserErrorFragment}
`

export type CustomerCreateMutationVariables = {
  input: {
    firstName: string
    lastName: string
    email: string
    password: string
  }
}

export type CustomerCreateMutationData = {
  customerCreate: {
    customer: StorefrontShopifyFragments['customerFragment']
    customerUserErrors: StorefrontShopifyFragments['customerUserErrorFragment'][]
  }
}

//#endregion

//#region getUser

export const CustomerQuery = ({
  customerFragment,
}: {
  customerFragment: string
}) => `
    query customer($customerAccessToken: String!){
        customer(customerAccessToken: $customerAccessToken) {
            ...CustomerFragment
            addresses(first:5){
              edges{
                node{
                  id
                  firstName
                  lastName
                  company
                  address1
                  address2
                  city
                  zip
                }
              }
            }
            orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
              edges {
                node {
                  id
                  name
                  processedAt
                  orderNumber
                  cancelReason
                  fulfillmentStatus
                  totalShippingPriceV2{
                    amount
                    currencyCode
                  }
                  successfulFulfillments{
                    trackingCompany
                    trackingInfo{
                      number
                      url
                    }
                  }
                  shippingAddress{
                    city
                    name
                    zip
                    address1
                    
                  }
                  totalPriceV2 {
                    amount
                    currencyCode
                  }
                  financialStatus
                  lineItems(first: 50) {
                    edges {
                      node {
                        title
                        quantity
                        originalTotalPrice{
                          amount
                          currencyCode
                        }
                        variant {
                          title
                          id
                          priceV2 {
                            amount
                            currencyCode
                          }
                          sku
                          compareAtPriceV2 {
                            amount
                            currencyCode
                          }
                          product {
                            id
                            images(first: 1) {
                              edges {
                                node {
                                  url
                                }
                              }
                            }
                          }
                        }
                        customAttributes {
                          key
                          value
                        }
                      }
                    }
                  }
                }
              }
            }
        }
    }
    ${customerFragment}
`

export type CustomerQueryVariables = {
  customerAccessToken: string
}

export type CustomerQueryData = {
  customer: StorefrontShopifyFragments['customerFragment']
}

//#endregion

//#region signup

export const CustomerRecoverMutation = ({
  customerUserErrorFragment,
}: {
  customerUserErrorFragment: string
}) => `
    mutation customerRecover($email: String!){
      customerRecover(email: $email) {
            customerUserErrors {
                ...CustomerUserErrorFragment
            }
        }
    }
    ${customerUserErrorFragment}
`

export type CustomerRecoverMutationVariables = {
  email: string
}

export type CustomerRecoverMutationData = {
  customerRecover: {
    customerUserErrors: StorefrontShopifyFragments['customerUserErrorFragment'][]
  }
}

//#endregion
//#region reset

export const PasswordResetMutation = ({
  customerUserErrorFragment,
}: {
  customerUserErrorFragment: string
}) => `
     mutation customerReset($id: ID!, $input: CustomerResetInput!) {
        customerReset(id: $id, input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
              ...CustomerUserErrorFragment
          }
        }
    }
    ${customerUserErrorFragment}
`

export type PasswordResetMutationVariables = {
  id: string
  input: { password: string; resetToken: string }
}

export type PasswordResetMutationData = {
  passwordReset: {
    customerUserErrors: StorefrontShopifyFragments['customerUserErrorFragment'][]
  }
}

//#endregion
//#region update
export const CustomerUpdateMutation = ({
  customerFragment,
  customerUserErrorFragment,
}: {
  customerFragment: string
  customerUserErrorFragment: string
}) => `
    mutation customerUpdate($input: CustomerUpdateInput!,$customerAccessToken: String!){
      customerUpdate(customer: $input,customerAccessToken: $customerAccessToken) {
        customer {
          ...CustomerFragment
        }
        customerUserErrors {
            ...CustomerUserErrorFragment
        }
      }
    }
    ${customerUserErrorFragment}
    ${customerFragment}
`

export type CustomerUpdateMutationVariables = {
  input: { firstName: string; lastName: string; phone: string; email: string }
  customerAccessToken: string
}

export type CustomerUpdateMutationData = {
  customerUpdate: {
    customer: StorefrontShopifyFragments['customerFragment']
    customerUserErrors: StorefrontShopifyFragments['customerUserErrorFragment'][]
  }
}
//#endregion

//#region activateCustomer

export const CustomerActivateMutation = ({
  customerFragment,
  customerUserErrorFragment,
}: {
  customerFragment: string
  customerUserErrorFragment: string
}) => `
      mutation customerActivate($activationUrl: URL!, $password:String!){
        customerActivateByUrl(activationUrl: $activationUrl, password:$password){
          customer {
            ...CustomerFragment
          }
          customerUserErrors{
            ...CustomerUserErrorFragment
          }
        }
      }
    ${customerUserErrorFragment}
    ${customerFragment}
    `
export type CustomerActivateMutationVariables = {
  activationUrl: string
  password: string
}

export type CustomerActivateMutationData = {
  customerActivate: {
    customer: StorefrontShopifyFragments['customerFragment']
    customerUserErrors: StorefrontShopifyFragments['customerUserErrorFragment'][]
  }
}

//#endregion

//#region updatePassword

export const PasswordUpdateMutation = ({
  customerFragment,
  customerUserErrorFragment,
}: {
  customerFragment: string
  customerUserErrorFragment: string
}) => `
    mutation customerUpdate($input: CustomerUpdateInput!,$customerAccessToken: String!){
      customerUpdate(customer: $input,customerAccessToken: $customerAccessToken) {
        customer {
          ...CustomerFragment
        }
        customerUserErrors {
            ...CustomerUserErrorFragment
        }
      }
    }
    ${customerUserErrorFragment}
    ${customerFragment}
`

export type PasswordUpdateMutationVariables = {
  input: { password: string }
  customerAccessToken: string
}

export type PasswordUpdateMutationData = {
  passwordUpdate: {
    customer: StorefrontShopifyFragments['customerFragment']
    customerUserErrors: StorefrontShopifyFragments['customerUserErrorFragment'][]
  }
}

//#endregion

//#region updateAddress

export const AddressUpdateMutation = ({
  customerUserErrorFragment,
}: {
  customerUserErrorFragment: string
}) => `
      mutation customerAddressUpdate(
        $address: MailingAddressInput!
        $customerAccessToken: String!
        $id: ID!
      ) {
        customerAddressUpdate(
          address: $address
          customerAccessToken: $customerAccessToken
          id: $id
        ) {
          customerAddress {
            id
            firstName
            lastName
            company
            address1
            address2
            city
            zip
          }
          customerUserErrors {
            ...CustomerUserErrorFragment
          }
        }
      }
    ${customerUserErrorFragment}
`

export type AddressUpdateMutationVariables = {
  address: {
    firstName: string
    lastName: string
    company: string
    address1: string
    address2: string
    city: string
    zip: string
  }
  customerAccessToken: string
  id: string
}

export type AddressUpdateMutationData = {
  addressUpdate: {
    customerUserErrors: StorefrontShopifyFragments['customerUserErrorFragment'][]
  }
}

//#endregion

//#region createAddress

export const AddressCreateMutation = ({
  customerUserErrorFragment,
}: {
  customerUserErrorFragment: string
}) => `
      mutation customerAddressCreate($address: MailingAddressInput!, $customerAccessToken: String!) {
        customerAddressCreate(address: $address, customerAccessToken: $customerAccessToken) {
          customerAddress {
            id
            firstName
            lastName
            company
            address1
            address2
            city
            zip
          }
          customerUserErrors {
            ...CustomerUserErrorFragment
          }
        }
      }
    ${customerUserErrorFragment}
`

export type AddressCreateMutationVariables = {
  address: {
    firstName: string
    lastName: string
    company: string
    address1: string
    address2: string
    city: string
    zip: string
  }
  customerAccessToken: string
}

export type AddressCreateMutationData = {
  addressCreate: {
    customerUserErrors: StorefrontShopifyFragments['customerUserErrorFragment'][]
  }
}

//#endregion
