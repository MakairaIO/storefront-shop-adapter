import { MakairaStorage } from '@makaira/storefront-types'

//#region general shopware6 types
export type ShopwareProduct = {
  id: string
  name: string
  price: number
  base_price: string
  quantity: number
  image_path: string
}

export type ShopwareUser = {
  id: string
  firstName: string
  lastName: string
  email: string
}

export type ShopwareReview = {
  active: boolean
  name: string
  headline: string
  comment: string
  points: number
  date: string
}

export type ShopwareBaseResponse = Record<string, unknown> & {
  token?: string
  contextToken?: string
}

//#region cart provider

//#region getCart method

export type ShopwareGetCartRes = ShopwareProduct[]

export type ShopwareGetCartRaw = { getCart?: ShopwareGetCartRes }

//#endregion

//#region addItem method

export type ShopwareAddItemRes =
  | ShopwareProduct[]
  | { ok: false; message: string }

export type ShopwareAddItemRaw = {
  addItem?: ShopwareAddItemRes
}

//#endregion

//#region addItem method

export type ShopwareRemoveItemRes =
  | ShopwareProduct[]
  | { ok: false; message: string }

export type ShopwareRemoveItemRaw = {
  removeItem?: ShopwareRemoveItemRes
}

//#endregion

//#region updateItem method

export type ShopwareUpdateItemRes =
  | ShopwareProduct[]
  | { ok: false; message: string }

export type ShopwareUpdateItemRaw = {
  updateItem?: ShopwareUpdateItemRes
}

//#endregion

//#endregion

//#region user provider

//#region getUser method

export type ShopwareGetUserRes =
  | ShopwareUser
  | { ok: false; message?: 'Forbidden' | string }

export type ShopwareGetUserRaw = { getUser?: ShopwareGetUserRes }

//#endregion

//#region logout method

export type ShopwareLogoutRes = { ok: boolean }

export type ShopwareLogoutRaw = {
  logout?: ShopwareLogoutRes
}

//#endregion

//#region forgot password method

export type ShopwareForgotPasswordRes = { ok: boolean }

export type ShopwareForgotPasswordAdditionalInput = {
  email: string
  storefrontUrl: string
}

export type ShopwareForgotPasswordRaw = {
  forgotPassword?: ShopwareForgotPasswordRes
}

//#endregion

//#region forgot password method

export type ShopwareSignupRes = { ok: boolean } & Record<string, any>

export type ShopwareSignupAdditionalInput = {
  email: string
  password: string
  firstName: string
  lastName: string
  storefrontUrl: string
  billingAddress: {
    countryId: string
    city: string
    street: string
  } & Record<string, any>
} & Record<string, any>

export type ShopwareSignupRaw = {
  signup?: ShopwareSignupRes
}

//#endregion

//#region login method

export type ShopwareLoginRes =
  | { ok: true }
  | { ok: false; message: string }
  | { ok: false; errors: any }

export type ShopwareLoginRaw = {
  login?: ShopwareLoginRes
  getUser?: ShopwareGetUserRaw['getUser']
}

//#endregion

//#endregion

//#endregion

//#region review provider

//#region getReviews method

export type ShopwareGetReviewsRes =
  | ShopwareReview[]
  | { ok: false; message: string }

export type ShopwareGetReviewsRaw = { getReviews?: ShopwareGetReviewsRes }

//#endregion

//#region createReview method

export type ShopwareCreateReviewAdditionalInput = {
  name?: string
  headline?: string
  email?: string
}

export type ShopwareCreateReviewRes =
  | { ok: true }
  | { ok: false; message: string }

export type ShopwareCreateReviewRaw = {
  createReview?: ShopwareCreateReviewRes
}

//#endregion

//#endregion

export type AdditionalShopware6Options = {
  url: string
  /**
   * The access token to make authenticated requests against shopware6
   */
  accessToken: string
  /**
   * The storage engine to store and receive persistent data. This is
   * for example used to store the checkoutId.
   */
  storage?: MakairaStorage
}

export type FetchParameters = {
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'
  path: string
  body?: object
}

export type FetchResponse<Response = any> = {
  response: Response
  status: number
}
