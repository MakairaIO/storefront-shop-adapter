import { getInContextAnnotation } from '../utils/getInContextAnnotation'
import {
  ContextOptions,
  ShopifyAttribute,
  StorefrontShopifyFragments,
} from '../types'

// this item input type is only to be used with Cart mutations, not with Checkout Mutations
export type LineItemInput = {
  quantity?: number
  merchandiseId: string
  attributes?: { key: string; value?: string }[]
  sellingPlanId?: string
  id: string
}

export type LineItemInputWithoutId = Omit<LineItemInput, 'id'>

//#region cartCreate

export const CartCreateMutation = ({
  cartCreateFragment,
  contextOptions = {},
}: {
  cartCreateFragment: string
  contextOptions?: ContextOptions | null
}) => {
  const inContextAnnotation = getInContextAnnotation(contextOptions)

  return `
  mutation cartCreate($input: CartInput!) ${inContextAnnotation} {
    cartCreate(input: $input) {
      cart {
        ...CartCreate
      }

      userErrors {
        field
        message
      }
    }
  }

  ${cartCreateFragment}
  `
}

export type CartCreateMutationVariables = {
  input: {
    lineItems?: LineItemInputWithoutId[]
    presentmentCurrencyCode?: string | null
  }
}

export type CartCreateMutationData = {
  cartCreate: {
    userErrors: StorefrontShopifyFragments['checkoutUserErrorFragment'][]
    cart: StorefrontShopifyFragments['cartFragment']
  }
}

export type CartCreateInput = Partial<{
  attributes: { key: string; value: string }[]
  buyerIdentity: Partial<{
    companyLocationId: string
    countryCode: string
    customerAccessToken: string
    email: string
    phone: string
    walletPreferences: string[]
  }>
  discountCodes: string[]
  lines: LineItemInputWithoutId[]
  metafields: {
    key: string
    value: string
    // see: https://shopify.dev/docs/apps/custom-data/metafields/types#supported-types
    type:
      | 'boolean'
      | 'color'
      | 'date'
      | 'date_time'
      | 'dimension'
      | 'json'
      | 'money'
      | 'multi_line_text_field'
      | 'number_decimal'
      | 'number_integer'
      | 'rating'
      | 'rich_text_field'
      | 'single_line_text_field'
      | 'url'
      | 'volume'
      | 'weight'
  }[]
  note: string
}>

//#endregion

//#region base definition of common used fragments

export const CartFragment = `
fragment CartCreate on Cart {
  id
  cost {
      totalAmount {
          amount
      }
  }
  checkoutUrl
  attributes {
      key
      value
  }
  lines(first: 50) {
      nodes {
          id
          quantity
          merchandise {
              ... on ProductVariant {
                  product {
                      id
                      title
                      featuredImage {
                          url
                      }
                  }
                  price {
                      amount
                  }
              }
          }
          attributes {
              key
              value
          }
      }
  }
}
`

export type CartFragmentData = {
  id: string
  cost: {
    totalAmount: {
      amount: number
    }
  }
  checkoutUrl: string
  attributes: ShopifyAttribute[]
  lines: {
    nodes: {
      id: string
      quantity: number
      merchandise: {
        product: {
          id: string
          title: string
          featuredImage: {
            url: string
          }
        }
        price: {
          amount: number
        }
      }
      attributes: ShopifyAttribute[]
    }[]
  }
}

export type CartUserErrorFragmentData = {
  field?: string[]
  message: string
}

//#endregion

//#region getCart

export const CartGetQuery = ({
  cartFragment,
  contextOptions = {},
}: {
  cartFragment: string
  contextOptions?: ContextOptions | null
}) => `
  query cart($id: ID!) ${getInContextAnnotation(contextOptions)} {
    cart(id: $id) {
      ...CartCreate
    }
  }
  ${cartFragment}
`

export type CartGetQueryVariables = {
  id: string
}

export type CartGetQueryData = {
  cart: StorefrontShopifyFragments['cartFragment']
}

//#endregion

//#region addItem

export const CartLineItemsAddMutation = ({
  cartFragment,
  contextOptions = {},
}: {
  cartFragment: string
  contextOptions?: ContextOptions | null
}) => `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) ${getInContextAnnotation(
      contextOptions
    )} {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
            ...CartCreate
        }
        userErrors {
          field
          message
        }
      }
    }
    ${cartFragment}
`

export type CartLinesAddMutationVariables = {
  cartId: string
  lines: LineItemInputWithoutId[]
}

export type CartLinesAddMutationData = {
  cartLinesAdd: {
    userErrors: StorefrontShopifyFragments['checkoutUserErrorFragment'][]
    cart: StorefrontShopifyFragments['cartFragment']
  }
}

//#endregion

//#region removeItem

export const CheckoutLineItemsRemoveMutation = ({
  cartFragment,
  contextOptions = {},
}: {
  cartFragment: string
  contextOptions?: ContextOptions | null
}) => `
mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) ${getInContextAnnotation(
  contextOptions
)} {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      ...CartCreate
    }
    userErrors {
      field
      message
    }
  }
}
${cartFragment}
`

export type CartLinesRemoveMutationVariables = {
  cartId: string
  lineIds: string[]
}

export type CartLinesRemoveMutationData = {
  cartLinesRemove: {
    userErrors: StorefrontShopifyFragments['checkoutUserErrorFragment'][]
    cart: StorefrontShopifyFragments['cartFragment']
  }
}

//#endregion

//#region udapteItem

export const CartLineItemsUpdateMutation = ({
  cartFragment,
  contextOptions = {},
}: {
  cartFragment: string
  contextOptions?: ContextOptions | null
}) => `
mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) ${getInContextAnnotation(
  contextOptions
)} {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      ...CartCreate
    }
    userErrors {
      field
      message
    }
  }
}
${cartFragment}
`

export type CartLinesUpdateMutationVariables = {
  cartId: string
  lines: Omit<LineItemInput, 'merchandiseId'>[]
}

export type CartLinesUpdateMutationData = {
  cartLinesUpdate: {
    userErrors: StorefrontShopifyFragments['checkoutUserErrorFragment'][]
    cart: StorefrontShopifyFragments['cartFragment']
  }
}

//#endregion
