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
  firstname: string
  lastname: string
  email: string
}

export type ShopwareReview = {
  id: string
  productId: string
  productVersionId: string
  salesChannelId: string
  languageId: string
  title: string
  content: string
  points: number
  status: boolean
  comment: string
  customFields: object
  createdAt: Date
  updatedAt: Date
}

export type ShopwareBaseResponse = Record<string, unknown> & {
  token?: string
  contextToken?: string
}

export type ShopwareFilter = {
  type: string
  field: string
  value: unknown
}

export type ShopwareSort = {
  field: string
  order?: string
  naturalSorting?: boolean
}

export type ShopwareAggregation = {
  name: string
  type: string
  field: string
}

export type ShopwareError = {
  status: number | string
  detail: string
  title: string
  code: string
}

export type ShopwareSearchBody = {
  filter?: ShopwareFilter[]
  sort?: ShopwareSort[]
  'post-filter'?: ShopwareFilter[]
  associations?: object
  aggregations?: ShopwareAggregation[]
  grouping?: string[]
  fields?: string[]
  'total-count-mode'?: 'none' | 'exact' | 'next-pages'
}

export type ShopwareSearchResponse<T> = {
  elements: T[]
  apiAlias: string
  entity: string
  total: number
  aggregations: ShopwareAggregation[]
  page: number
  limit: number
  currentFilters?: object
  availableSortings?: ShopwareSort[]
  errors?: ShopwareError[]
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

export type ShopwareGetReviewsRes = ShopwareSearchResponse<ShopwareReview>

export type ShopwareGetReviewsRaw = { getReviews?: ShopwareGetReviewsRes }

//#endregion

//#region createReview method

export type ShopwareCreateReviewAdditionalInput = {
  name?: string
  title: string
  email?: string
}

export type ShopwareCreateReviewRes = { errors?: ShopwareError[] }

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
