import { StorefrontShopifyFragments } from '../types'

export type LineItemInput = {
  quantity: number
  variantId: string
  customAttributes?: { key: string; value: string }[]
}

//#region base definition of common used fragments

export const CheckoutFragment = `
    fragment CheckoutFragment on Checkout {
        id
        lineItems(first: 50) {
            edges {
                node {
                    id
                    title
                    quantity
                    variant {
                        priceV2 {
                            amount
                            currencyCode
                        }
                        product {
                            featuredImage {
                                url
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
        completedAt
        webUrl
    }
`

export type CheckoutFragmentData = {
  id: string
  lineItems: {
    edges: {
      node: {
        id: string
        title: string
        quantity: number
        variant?: {
          priceV2: {
            amount: number
            currencyCode: number
          }
          product: {
            featuredImage: {
              url: string
            }
          }
        }
        customAttributes: {
          key: string
          value?: string
        }[]
      }
    }[]
  }
  completedAt?: string
  webUrl: string
}

export const CheckoutUserErrorFragment = `
    fragment CheckoutUserErrorFragment on CheckoutUserError {
        field
        message
    }
`

export type CheckoutUserErrorFragmentData = {
  field?: string[]
  message: string
}

//#endregion

//#region createCheckout

export const CheckoutCreateMutation = ({
  checkoutUserErrorFragment,
  checkoutFragment,
}: {
  checkoutUserErrorFragment: string
  checkoutFragment: string
}) => `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
            checkoutUserErrors {
                ...CheckoutUserErrorFragment
            }
            checkout {
                ...CheckoutFragment
            }
        }
    }
    ${checkoutUserErrorFragment}
    ${checkoutFragment}
`

export type CheckoutCreateMutationVariables = {
  input: { lineItems?: LineItemInput[] }
}

export type CheckoutCreateMutationData = {
  checkoutCreate: {
    checkoutUserErrors: StorefrontShopifyFragments['checkoutUserErrorFragment'][]
    checkout: StorefrontShopifyFragments['checkoutFragment']
  }
}

//#endregion

//#region getCart

export const CheckoutGetQuery = ({
  checkoutFragment,
}: {
  checkoutFragment: string
}) => `
    query node($id: ID!) {
        node(id: $id) {
            ...CheckoutFragment
        }
    }
    ${checkoutFragment}
`

export type CheckoutGetQueryVariables = {
  id: string
}

export type CheckoutGetQueryData = {
  node: StorefrontShopifyFragments['checkoutFragment']
}

//#endregion

//#region addItem

export const CheckoutLineItemsAddMutation = ({
  checkoutUserErrorFragment,
  checkoutFragment,
}: {
  checkoutUserErrorFragment: string
  checkoutFragment: string
}) => `
    mutation ($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
      checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
          checkoutUserErrors {
              ...CheckoutUserErrorFragment
          }
          checkout {
              ...CheckoutFragment
          }
      }
    }
    ${checkoutUserErrorFragment}
    ${checkoutFragment}
`

export type CheckoutLineItemsAddMutationVariables = {
  checkoutId: string
  lineItems: LineItemInput[]
}

export type CheckoutLineItemsAddMutationData = {
  checkoutLineItemsAdd: {
    checkoutUserErrors: StorefrontShopifyFragments['checkoutUserErrorFragment'][]
    checkout: StorefrontShopifyFragments['checkoutFragment']
  }
}

//#endregion

//#region addItem

export const CheckoutLineItemsRemoveMutation = ({
  checkoutUserErrorFragment,
  checkoutFragment,
}: {
  checkoutUserErrorFragment: string
  checkoutFragment: string
}) => `
mutation ($checkoutId: ID!, $lineItemIds: [ID!]!) {
  checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
      checkoutUserErrors {
          ...CheckoutUserErrorFragment
      }
      checkout {
          ...CheckoutFragment
      }
  }
}
${checkoutUserErrorFragment}
${checkoutFragment}
`

export type CheckoutLineItemsRemoveMutationVariables = {
  checkoutId: string
  lineItemIds: string[]
}

export type CheckoutLineItemsRemoveMutationData = {
  checkoutLineItemsRemove: {
    checkoutUserErrors: StorefrontShopifyFragments['checkoutUserErrorFragment'][]
    checkout: StorefrontShopifyFragments['checkoutFragment']
  }
}

//#endregion

//#region udapteItem

export const CheckoutLineItemsUpdateMutation = ({
  checkoutUserErrorFragment,
  checkoutFragment,
}: {
  checkoutUserErrorFragment: string
  checkoutFragment: string
}) => `
mutation ($checkoutId: ID!, $lineItems: [CheckoutLineItemUpdateInput!]!) {
  checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
      checkoutUserErrors {
          ...CheckoutUserErrorFragment
      }
      checkout {
          ...CheckoutFragment
      }
  }
}
${checkoutUserErrorFragment}
${checkoutFragment}
`

export type CheckoutLineItemsUpdateMutationVariables = {
  checkoutId: string
  lineItems: {
    id?: string
    quantity?: number
    variantId?: string
    customAttributes?: { key: string; value: string }[]
  }[]
}

export type CheckoutLineItemsUpdateMutationData = {
  checkoutLineItemsUpdate: {
    checkoutUserErrors: StorefrontShopifyFragments['checkoutUserErrorFragment'][]
    checkout: StorefrontShopifyFragments['checkoutFragment']
  }
}

//#endregion
