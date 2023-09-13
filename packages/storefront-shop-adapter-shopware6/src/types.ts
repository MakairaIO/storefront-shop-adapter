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
  groupId: string
  defaultPaymentMethodId: string
  salesChannelId: string
  languageId: string
  defaultBillingAddressId: string
  defaultShippingAddressId: string
  customerNumber: string
  firstName: string
  lastName: string
  email: string
  accountType: string
  createdAt: string
  id?: string
  lastPaymentMethodId?: string
  salutationId?: string
  company?: string
  title?: string
  vatId?: string[]
  affiliateCode?: string
  campaignCode?: string
  active?: boolean
  doubleOptInRegistration?: boolean
  doubleOptInEmailSentDate?: string
  doubleOptInConfirmDate?: string
  hash?: string
  guest?: boolean
  firstLogin?: string
  lastLogin?: string
  birthday?: string
  lastOrderDate?: string
  orderCount?: number
  orderTotalAmount?: number
  reviewCount?: number
  customFields?: Record<string, any>
  tagIds?: string[]
  createdById?: string
  updatedById?: string
  updatedAt?: string
  extensions?: Record<string, any>
  group?: Record<string, any>
  defaultPaymentMethod?: Record<string, any>
  language?: Record<string, any>
  lastPaymentMethod?: Record<string, any>
  defaultBillingAddress?: Record<string, any>
  defaultShippingAddress?: Record<string, any>
  salutation?: Record<string, any>
  addresses?: Record<string, any>
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
  type?: string
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

export type ShopwareGetUserRes = ShopwareUser & { errors: ShopwareError[] }

export type ShopwareGetUserRaw = { getUser?: ShopwareGetUserRes }

//#endregion

//#region logout method

export type ShopwareLogoutRequest = {
  /**
   * @deprecated Deprecated since v6.6.0.0. The context token added in header instead.
   */
  contextToken?: string

  /**
   * Define the URL which browser will be redirected to
   * @default window.location.origin
   */
  redirectUrl?: string
}

export type ShopwareLogoutRes = {
  contextToken: string
  redirectUrl?: string
  errors?: ShopwareError[]
}

export type ShopwareLogoutRaw = {
  logout?: ShopwareLogoutRes
}

//#endregion

//#region forgot password method

export type ShopwareForgotPasswordRes = {
  success: boolean
  errors?: ShopwareError[]
}

export type ShopwareForgotPasswordAdditionalInput = {
  storefrontUrl?: string
}

export type ShopwareForgotPasswordRaw = {
  forgotPassword?: ShopwareForgotPasswordRes
}

//#endregion

//#region forgot password method

export type ShopwareSignupRes = ShopwareUser & { errors?: ShopwareError[] }

export type ShopwareSignupAdditionalInput = {
  storefrontUrl: string
  firstName: string
  lastName: string
  salutationId?: string
  acceptedDataProtection?: boolean
  billingAddress: {
    countryId: string
    city: string
    street: string
    id?: string
    customerId?: string
    countryStateId?: string
    salutationId?: string
    firstName?: string
    lastName?: string
    zipcode?: string
    company?: string
    department?: string
    title?: string
    phoneNumber?: string
    additionalAddressLine1?: string
    additionalAddressLine2?: string
    customFields?: Record<string, any>
    country?: {
      id?: string
      name?: string
      iso?: string
      position?: number
      active?: boolean
      shippingAvailable?: boolean
      iso3?: string
      displayStateInRegistration?: boolean
      forceStateInRegistration?: boolean
      checkVatIdPattern?: boolean
      vatIdRequired?: boolean
      vatIdPattern?: string
      customFields?: Record<string, any>
      customerTax?: {
        enabled?: boolean
        currencyId?: string
        amount?: number
      }
      companyTax?: {
        enabled?: boolean
        currencyId?: string
        amount?: number
      }
      postalCodeRequired?: boolean
      checkPostalCodePattern?: boolean
      checkAdvancedPostalCodePattern?: boolean
      advancedPostalCodePattern?: string
      addressFormat?: Record<string, any>
      defaultPostalCodePattern?: string
      translated?: Record<string, any>
      states?: {
        id?: string
        countryId?: string
        shortCode?: string
        name?: string
        position?: number
        active?: boolean
        customFields?: Record<string, any>
        translated?: Record<string, any>
      }
      companyTaxFree?: null
      taxFree?: null
    }
    countryState?: {
      id?: string
      countryId?: string
      shortCode?: string
      name?: string
      position?: number
      active?: boolean
      customFields?: Record<string, any>
      translated?: Record<string, any>
    }
    salutation?: {
      id?: string
      salutationKey?: string
      displayName?: string
      letterName?: string
      customFields?: Record<string, any>
      translated?: Record<string, any>
    }
  }
  shippingAddress?: {
    id?: string
    customerId?: string
    countryId?: string
    countryStateId?: string
    salutationId?: string
    firstName?: string
    lastName?: string
    zipcode?: string
    city?: string
    company?: string
    street?: string
    department?: string
    title?: string
    phoneNumber?: string
    additionalAddressLine1?: string
    additionalAddressLine2?: string
    customFields?: Record<string, any>
    country?: {
      id?: string
      name?: string
      iso?: string
      position?: number
      active?: boolean
      shippingAvailable?: boolean
      iso3?: string
      displayStateInRegistration?: boolean
      forceStateInRegistration?: boolean
      checkVatIdPattern?: boolean
      vatIdRequired?: boolean
      vatIdPattern?: string
      customFields?: Record<string, any>
      customerTax?: {
        enabled?: boolean
        currencyId?: string
        amount?: number
      }
      companyTax?: {
        enabled?: boolean
        currencyId?: string
        amount?: number
      }
      postalCodeRequired?: boolean
      checkPostalCodePattern?: boolean
      checkAdvancedPostalCodePattern?: boolean
      advancedPostalCodePattern?: string
      addressFormat?: Record<string, any>
      defaultPostalCodePattern?: string
      translated?: Record<string, any>
      states?: {
        id?: string
        countryId?: string
        shortCode?: string
        name?: string
        position?: number
        active?: boolean
        customFields?: Record<string, any>
        translated?: Record<string, any>
      }
      companyTaxFree?: null
      taxFree?: null
    }
    countryState?: {
      id?: string
      countryId?: string
      shortCode?: string
      name?: string
      position?: number
      active?: boolean
      customFields?: Record<string, any>
      translated?: Record<string, any>
    }
    salutation?: {
      id?: string
      salutationKey?: string
      displayName?: string
      letterName?: string
      customFields?: Record<string, any>
      translated?: Record<string, any>
    }
  }
  accountType?: 'private' | 'business'
  guest?: false
  birthdayDay?: number
  birthdayMonth?: number
  birthdayYear?: number
  title?: string
  affiliateCode?: string
  campaignCode?: string
}

export type ShopwareSignupRaw = {
  signup?: ShopwareSignupRes
}

//#endregion

//#region login method

export type ShopwareLoginRes = {
  contextToken: string
  redirectUrl?: string
  errors?: ShopwareError[]
}

export type ShopwareLoginRaw = {
  login?: ShopwareLoginRes
  getUser?: ShopwareGetUserRaw['getUser']
}

//#endregion

//#region wishlist method

export type ShopwareWishlistGetRes = {
  products: {
    elements: any[]
  }
  errors?: ShopwareError[]
}

export type ShopwareWishlistGetRaw = {
  wishlist?: ShopwareWishlistGetRes
}

export type ShopwareWishlistAddRes = {
  success: boolean
  errors?: ShopwareError[]
}

export type ShopwareWishlistAddRaw = {
  addItem?: ShopwareWishlistAddRes
}

export type ShopwareWishlistRemoveRes = {
  success: boolean
  errors?: ShopwareError[]
}

export type ShopwareWishlistRemoveRaw = {
  removeItem?: ShopwareWishlistRemoveRes
}

export type ShopwareWishlistCreateRes = {
  success: boolean
  errors?: ShopwareError[]
}

export type ShopwareWishlistCreateRaw = {
  createWishlist?: ShopwareWishlistCreateRes
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
   * The default storefront using for signup/forgot password/logout...
   */
  storefrontUrl: string
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
