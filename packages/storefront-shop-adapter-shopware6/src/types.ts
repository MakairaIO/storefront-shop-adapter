import { MakairaStorage } from '@makaira/storefront-types'

//#region general shopware6 types
export type ShopwareTax = {
  tax: number
  taxRate: number
  price: number
}

export type ShopwareTaxRule = {
  percentage: number
  taxRate: number
}

export type ShopwareCartPrice = {
  netPrice: number
  totalPrice: number
  positionPrice: number
  taxStatus: number
  rawTotal: number
  calculatedTaxes: ShopwareTax[]
  taxRules: ShopwareTaxRule[]
}

export type ShopwareProductOption = {
  group: string
  option: string
}

export type ShopwareLineItemPayload = {
  customFields: any[]
  productNumber: string
  manufacturerId: string
  options: ShopwareProductOption[]
  stock: number
}

export type ShopwareLineItemPrice = {
  unitPrice: number
  quantity: number
  totalPrice: number
  calculatedTaxes: ShopwareTax[]
  taxRules: ShopwareTaxRule[]
}

export type ShopwareQuantityInformation = {
  minPurchase: number
  maxPurchase: number
  purchaseSteps: number
}

export type ShopwareThumbnail = {
  url: string
  width: number
  height: number
}

export type ShopwareProduct = {
  id: string
  referencedId: string
  label: string
  quantity: number
  type: string
  good: boolean
  description: string
  removable: boolean
  stackable: boolean
  modified: boolean
  payload: ShopwareLineItemPayload
  price: ShopwareLineItemPrice
  quantityInformation: ShopwareQuantityInformation
  cover: {
    url: string
    metaData: {
      width: number
      height: number
    }
    thumbnails: ShopwareThumbnail[]
  }
}

export type ShopwareUser = {
  id: string
  firstname: string
  lastname: string
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

export type ShopwareErrorArray = {
  code: string
  title: string
  detail: string
}

export type ShopwareErrorObject = {
  message: string
  messageKey: string
  resolved: boolean
}

export type ShopwareCartRes = {
  lineItems: ShopwareProduct[]
  price: ShopwareCartPrice
  errors: ShopwareErrorArray[] | Record<string, ShopwareErrorObject>
  customerComment: string
  affiliateCode: string
  campaignCode: string
}

export type ShopwareUpdateCartItemAdditionalInput = {
  referencedId: string
  type: string
  good: boolean
  description?: string
  removable?: boolean
  stackable?: boolean
  label?: string
  modified?: boolean
}

//#region getCart method

export type ShopwareGetCartRes = ShopwareCartRes

export type ShopwareGetCartRaw = { getCart?: ShopwareGetCartRes }

//#endregion

//#region addItem method

export type ShopwareAddItemRes = ShopwareCartRes
export type ShopwareAddItemRaw = {
  addItem?: ShopwareAddItemRes
}

//#endregion

//#region removeItem method

export type ShopwareRemoveItemRes = ShopwareCartRes

export type ShopwareRemoveItemRaw = {
  removeItem?: ShopwareRemoveItemRes
}

//#endregion

//#region updateItem method

export type ShopwareUpdateItemRes = ShopwareCartRes
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

export type ShopwareLogoutRes = { ok: true }

export type ShopwareLogoutRaw = {
  logout?: ShopwareLoginRes
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
