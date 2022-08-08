//#region Customer fragment

import { StorefrontShopifyFragments } from '../types'

export const CustomerFragment = `
    fragment CustomerFragment on Customer {
        id
        firstName
        lastName
        email
    }
`

export type CustomerFragmentData = {
  id: string
  firstName?: string
  lastName?: string
  email?: string
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
  input: { email: string; password: string }
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
