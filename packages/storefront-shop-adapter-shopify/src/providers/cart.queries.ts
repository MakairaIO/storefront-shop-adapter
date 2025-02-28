import { getInContextAnnotation } from '../utils/getInContextAnnotation'
import { ContextOptions, StorefrontShopifyFragments } from '../types'

export type LineItemInput = {
  quantity: number
  merchandiseId: string
  attributes?: { key: string; value: string }[]
}

//#region base definition of common used fragments

export const CheckoutFragment = `
    fragment CheckoutFragment on Cart {
        id
        lines(first: 50) {
            edges {
                node {
                    id
                    merchandise {
                        ... on ProductVariant {
                            id
                            title
                            price {
                                amount
                                currencyCode
                            }
                            product {
                                featuredImage {
                                    url
                                }
                            }
                        }
                    }
                    quantity
                    attributes {
                        key
                        value
                    }
                }
            }
        }
        createdAt
        updatedAt
        checkoutUrl
    }
`

export type CheckoutFragmentData = {
  id: string
  lines: {
    edges: {
      node: {
        id: string
        merchandise: {
          id: string
          title: string
          price: {
            amount: number
            currencyCode: string
          }
          product: {
            featuredImage: {
              url: string
            }
          }
        }
        quantity: number
        attributes: {
          key: string
          value?: string
        }[]
      }
    }[]
  }
  createdAt: string
  updatedAt: string
  checkoutUrl: string
}

export const CheckoutUserErrorFragment = `
    fragment CheckoutUserErrorFragment on CartUserError {
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
  contextOptions = {},
}: {
  checkoutUserErrorFragment: string
  checkoutFragment: string
  contextOptions?: ContextOptions | null
}) => {
  const inContextAnnotation = getInContextAnnotation(contextOptions)

  return `
  mutation cartCreate($input: CartInput!) ${inContextAnnotation} {
      cartCreate(input: $input) {
          userErrors {
              ...CheckoutUserErrorFragment
          }
          cart {
              ...CheckoutFragment
          }
      }
  }
  ${checkoutUserErrorFragment}
  ${checkoutFragment}
`
}

export type CheckoutCreateMutationVariables = {
  input: {
    lineItems?: LineItemInput[]
    presentmentCurrencyCode?: string | null
  }
}

export type CheckoutCreateMutationData = {
  cartCreate: {
    userErrors: StorefrontShopifyFragments['checkoutUserErrorFragment'][]
    cart: StorefrontShopifyFragments['checkoutFragment']
  }
}

//#endregion

//#region getCart

export const CheckoutGetQuery = ({
  checkoutFragment,
  contextOptions = {},
}: {
  checkoutFragment: string
  contextOptions?: ContextOptions | null
}) => `
    query node($id: ID!) ${getInContextAnnotation(contextOptions)} {
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
  contextOptions = {},
}: {
  checkoutUserErrorFragment: string
  checkoutFragment: string
  contextOptions?: ContextOptions | null
}) => `
    mutation ($cartId: ID!, $lines: [CartLineInput!]!) ${getInContextAnnotation(
      contextOptions
    )} {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
          userErrors {
              ...CheckoutUserErrorFragment
          }
          cart {
              ...CheckoutFragment
          }
      }
    }
    ${checkoutUserErrorFragment}
    ${checkoutFragment}
`

export type CheckoutLineItemsAddMutationVariables = {
  cartId: string
  lines: LineItemInput[]
}

export type CheckoutLineItemsAddMutationData = {
  cartLinesAdd: {
    userErrors: StorefrontShopifyFragments['checkoutUserErrorFragment'][]
    cart: StorefrontShopifyFragments['checkoutFragment']
  }
}

//#endregion

//#region addItem

export const CheckoutLineItemsRemoveMutation = ({
  checkoutUserErrorFragment,
  checkoutFragment,
  contextOptions = {},
}: {
  checkoutUserErrorFragment: string
  checkoutFragment: string
  contextOptions?: ContextOptions | null
}) => `
mutation ($cartId: ID!, $lineIds: [ID!]!) ${getInContextAnnotation(
  contextOptions
)} {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      userErrors {
          ...CheckoutUserErrorFragment
      }
      cart {
          ...CheckoutFragment
      }
  }
}
${checkoutUserErrorFragment}
${checkoutFragment}
`

export type CheckoutLineItemsRemoveMutationVariables = {
  cartId: string
  lineIds: string[]
}

export type CheckoutLineItemsRemoveMutationData = {
  cartLinesRemove: {
    userErrors: StorefrontShopifyFragments['checkoutUserErrorFragment'][]
    cart: StorefrontShopifyFragments['checkoutFragment']
  }
}

//#endregion

//#region udapteItem

export const CheckoutLineItemsUpdateMutation = ({
  checkoutUserErrorFragment,
  checkoutFragment,
  contextOptions = {},
}: {
  checkoutUserErrorFragment: string
  checkoutFragment: string
  contextOptions?: ContextOptions | null
}) => `
mutation ($cartId: ID!, $lines: [CartLineUpdateInput!]!) ${getInContextAnnotation(
  contextOptions
)} {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
      userErrors {
          ...CheckoutUserErrorFragment
      }
      cart {
          ...CheckoutFragment
      }
  }
}
${checkoutUserErrorFragment}
${checkoutFragment}
`

export type CheckoutLineItemsUpdateMutationVariables = {
  cartId: string
  lines: {
    id?: string
    quantity?: number
    merchandiseId?: string
    customAttributes?: { key: string; value: string }[]
  }[]
}

export type CheckoutLineItemsUpdateMutationData = {
  cartLinesUpdate: {
    userErrors: StorefrontShopifyFragments['checkoutUserErrorFragment'][]
    cart: StorefrontShopifyFragments['checkoutFragment']
  }
}

//#endregion
