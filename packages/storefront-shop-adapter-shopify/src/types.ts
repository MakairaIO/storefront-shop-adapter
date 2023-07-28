import { MakairaStorage } from '@makaira/storefront-types'
import {
  CheckoutCreateMutationData,
  CheckoutFragmentData,
  CheckoutGetQueryData,
  CheckoutLineItemsAddMutationData,
  CheckoutLineItemsRemoveMutationData,
  CheckoutLineItemsUpdateMutationData,
  CheckoutUserErrorFragmentData,
} from './providers/cart.queries'
import {
  CustomerAccessTokenCreateMutationData,
  CustomerAccessTokenDeleteMutationData,
  CustomerCreateMutationData,
  CustomerFragmentData,
  CustomerQueryData,
  CustomerRecoverMutationData,
  CustomerUpdateMutationData,
  CustomerUserErrorFragmentData,
  UserErrorFragmentData,
} from './providers/user.queries'

type MergeBy<T, K> = Omit<T, keyof K> & K

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StorefrontShopifyCustomFragments {}

export type StorefrontShopifyFragments = MergeBy<
  {
    checkoutFragment: CheckoutFragmentData
    checkoutUserErrorFragment: CheckoutUserErrorFragmentData
    customerFragment: CustomerFragmentData
    userErrorFragment: UserErrorFragmentData
    customerUserErrorFragment: CustomerUserErrorFragmentData
  },
  StorefrontShopifyCustomFragments
>

//#region general shopify types
export type GraphqlResWithError<GraphqlData> = {
  data?: GraphqlData
  errors?: { message: string }[]
}

//#endregion

//#region cart provider

//#region getCart method

export type ShopifyGetCartRaw = {
  createCheckout?: GraphqlResWithError<CheckoutCreateMutationData>
  getCheckout?: GraphqlResWithError<CheckoutGetQueryData>
}

//#endregion

//#region addItem method

export type ShopifyAddItemRaw = {
  checkoutLineItemsAdd?: GraphqlResWithError<CheckoutLineItemsAddMutationData>
  checkoutCreate?: GraphqlResWithError<CheckoutCreateMutationData>
}

//#endregion

//#region removeItem method

export type ShopifyRemoveItemRaw = {
  checkoutLineItemsRemove?: GraphqlResWithError<CheckoutLineItemsRemoveMutationData>
  checkoutCreate?: GraphqlResWithError<CheckoutCreateMutationData>
}

export type ShopifyRemoveItemInput = {
  // Shopify enforces to send the lineItemId instead of the variant id. Therefore we enforce this too.
  lineItemIds: string[]
  // Disable products in shopify because we need the line item ids instead of the variant id.
  product: never
}

//#endregion

//#region updateItem method

export type ShopifyUpdateItemRaw = {
  checkoutLineItemsUpdate?: GraphqlResWithError<CheckoutLineItemsUpdateMutationData>
  checkoutCreate?: GraphqlResWithError<CheckoutCreateMutationData>
}

//#endregion

//#endregion

//#region user provider

//#region getUser method

export type ShopifyGetUserRaw = {
  getUser?: GraphqlResWithError<CustomerQueryData>
}

//#endregion

//#region logout method

export type ShopifyLogoutRaw = {
  logout?: GraphqlResWithError<CustomerAccessTokenDeleteMutationData>
}

//#endregion

//#region signup method

export type ShopifySignupRaw = {
  customerAccessToken?: GraphqlResWithError<CustomerAccessTokenCreateMutationData>
  signup?: GraphqlResWithError<CustomerCreateMutationData>
}

//#endregion

//#region login method

export type ShopifyLoginRaw = {
  login?: GraphqlResWithError<CustomerAccessTokenCreateMutationData>
  getUser?: GraphqlResWithError<CustomerQueryData>
}

//#endregion

//#region getUser method

export type ShopifyForgotPasswordRaw = {
  forgotPassword?: GraphqlResWithError<CustomerRecoverMutationData>
}

//#endregion

//#region update method
export type ShopifyUpdateUserRaw = {
  update?: GraphqlResWithError<CustomerUpdateMutationData>
}
//endregion

//#endregion

//#endregion

export type AdditionalShopifyOptions = {
  /**
   * The url of the shopify graphql api
   */
  url: string
  /**
   * The access token to make authenticated requests against shopify
   */
  accessToken: string
  /**
   * The storage engine to store and receive persistent data. This is
   * for example used to store the checkoutId.
   */
  storage?: MakairaStorage
  /**
   *
   */
  fragments?: {
    checkoutFragment?: string
    checkoutUserErrorFragment?: string
    customerFragment?: string
    userErrorFragment?: string
    customerUserErrorFragment?: string
  }
  /**
   * <p>
   * If set will change the `@inContext` graphql directive during the creation of a checkout.
   * Can be used if you want to change the language or country of a checkout.
   * The currency of the checkout will be determined by shopify from the country.
   * <p/>
   * <p>
   * More information about the @inContext GraphQL directive at <a href="https://shopify.dev/changelog/storefront-api-incontext-directive-supports-languages">Shopify Docs</a>
   * <p/>
   * <p>
   * Sets the default value for client.getContextOptions() <br />
   * Can be changed later on with client.setContextOptions({ input: MakairaUpdateContextOptionsInput }).
   * <p/>
   */
  contextOptions?: ContextOptions | null
}

export type FetchParameters<GraphqlInputVariables = any> = {
  query: string
  variables?: GraphqlInputVariables
}

export type ContextOptions = Partial<
  Record<'language' | 'country', string | null>
>

export type MakairaUpdateContextOptionsInput = {
  lineItems?: {
    product: { id: string; attributes?: { key: string; value?: string }[] }
    quantity: number
  }[]
  options: ContextOptions
}
