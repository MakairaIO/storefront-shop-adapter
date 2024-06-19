import { MakairaStorage } from '@makaira/storefront-types'
import {
  CartCreateInput,
  CartCreateMutationData,
  CartFragmentData,
  CartGetQueryData,
  CartLinesAddMutationData,
  CartLinesRemoveMutationData,
  CartLinesUpdateMutationData,
  CartUserErrorFragmentData,
} from './providers/cart.queries'
import {
  AddressUpdateMutationData,
  AddressCreateMutationData,
  CustomerAccessTokenCreateMutationData,
  CustomerAccessTokenDeleteMutationData,
  CustomerActivateMutationData,
  CustomerCreateMutationData,
  CustomerFragmentData,
  CustomerQueryData,
  CustomerRecoverMutationData,
  CustomerUpdateMutationData,
  CustomerUserErrorFragmentData,
  PasswordUpdateMutationData,
  UserErrorFragmentData,
  PasswordResetMutationData,
} from './providers/user.queries'

type MergeBy<T, K> = Omit<T, keyof K> & K

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StorefrontShopifyCustomFragments {}

export type StorefrontShopifyFragments = MergeBy<
  {
    cartFragment: CartFragmentData
    checkoutUserErrorFragment: CartUserErrorFragmentData
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

//#region getCheckout method

export type ShopifyGetCartRaw = {
  createCart?: GraphqlResWithError<CartCreateMutationData>
  getCart?: GraphqlResWithError<CartGetQueryData> // TODO: change this for cart get
}

//#endregion

//#region addItem method

export type ShopifyAddItemRaw = {
  cartLinesAdd?: GraphqlResWithError<CartLinesAddMutationData> // TODO
  cartCreate?: GraphqlResWithError<CartCreateMutationData>
}

//#endregion

//#region removeItem method

export type ShopifyRemoveItemRaw = {
  cartLinesRemove?: GraphqlResWithError<CartLinesRemoveMutationData>
  cartCreate?: GraphqlResWithError<CartCreateMutationData>
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
  cartLinesUpdate?: GraphqlResWithError<CartLinesUpdateMutationData>
  cartCreate?: GraphqlResWithError<CartCreateMutationData>
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

//#region update address method
export type ShopifyAddressUpdateRaw = {
  update?: GraphqlResWithError<AddressUpdateMutationData>
}
//endregion

//#region create address method
export type ShopifyAddressCreateRaw = {
  update?: GraphqlResWithError<AddressCreateMutationData>
}
//endregion

//#region updatePassword method
export type ShopifyUpdatePasswordRaw = {
  update?: GraphqlResWithError<PasswordUpdateMutationData>
}
//endregion

//#region resetPassword method
export type ShopifyResetPasswordRaw = {
  update?: GraphqlResWithError<PasswordResetMutationData>
}
//endregion

//#region activate method
export type ShopifyActivateUserRaw = {
  activate?: GraphqlResWithError<CustomerActivateMutationData>
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
    cartFragment?: string
    customerFragment?: string
    userErrorFragment?: string
    customerUserErrorFragment?: string
  }

  buyerIdentity?: CartCreateInput['buyerIdentity'] | null

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

export type ShopifyAttribute = { key: string; value: string }
