//#region general plentymarkets types

export type PlentymarketsProduct = {
  quantity: number
  name: string
  previewURL: string
  price: number
  variantId: string
}

// We use two different API endpoints. One from the plentymarkets-IO and one from
// the Makaira plugin. They return different structures for the products, so we need
// to specify also multiple product types here.
export type PlentymarketsIOProduct = {
  texts: {
    name1: string
    name2: string
    name3: string
    description: string
    lang: string
    urlPath: string
    shortDescription: string
  }
  images: {
    all: [
      {
        urlPreview: string
        url: string
        urlMiddle: string
        urlSecondPreview: string
        path: string
        cleanImageName: string
        position: number
      }
    ]
    variation: []
  }
  prices: {
    default: {
      price: {
        value: number
        formatted: string
      }
      unitPrice: {
        value: number
        formatted: string
      }
      basePrice: string
    }
  }
}

export type PlentymarketsUser = {
  id: string
  firstName: string
  lastName: string
  gender: string
  title: string
  lang: string
  email: string
  fullName: string
}

//#endregion

//#region getCart method

export type PlentymarketsGetCartRes = {
  items: PlentymarketsProduct[]
  shippingAmount: number
  total: number
}

export type PlentymarketsGetCartRaw = { getCart: PlentymarketsGetCartRes }

//#endregion

//#region addItem method

export type PlentymarketsAddItemRes =
  | { success: true; cart: PlentymarketsGetCartRes }
  | { success: false; message: string }

export type PlentymarketsAddItemRaw = {
  addItem: PlentymarketsAddItemRes
}

//#endregion

//#region removeItem method

export type PlentymarketsRemoveItemRes = {
  success: false
  message: string
  variantId: string
}

export type PlentymarketsRemoveItemRaw = {
  removeItem: PlentymarketsRemoveItemRes
  getCart?: PlentymarketsGetCartRaw['getCart']
}

//#endregion

//#region updateItem method

export type PlentymarketsUpdateItemRes =
  | { success: true; cart: PlentymarketsGetCartRes }
  | { success: false; message: string }

export type PlentymarketsUpdateItemRaw = {
  updateItem: PlentymarketsUpdateItemRes
}

//#endregion

//#region getWishlist method

export type PlentymarketsGetWishlistRes = {
  events: []
  data: {
    total: number
    documents: [
      {
        data: PlentymarketsIOProduct
        id: string
      }
    ]
  }
}

export type PlentymarketsGetWishlistRaw = {
  getWishlist: PlentymarketsGetWishlistRes
}

//#endregion

//#region addWishlist method

export type PlentymarketsAddWishlistRes = {
  events: []
  data: {
    id: string
    contactId: string
    plentyId: string
    variationId: string
    quantity: number
    createdAt: string
  }
}

export type PlentymarketsAddWishlistRaw = {
  addWishlist: PlentymarketsAddWishlistRes
  getWishlist?: PlentymarketsGetWishlistRaw['getWishlist']
}

//#endregion

//#region removeWishlist method

export type PlentymarketsRemoveWishlistRes = {
  events: []
  data: boolean
}

export type PlentymarketsRemoveWishlistRaw = {
  removeWishlist: PlentymarketsRemoveWishlistRes
  getWishlist?: PlentymarketsGetWishlistRaw['getWishlist']
}

//#endregion

//#region login method
export type PlentymarketsLoginRes = {
  error?: {
    message: string
    code: number
  }
  events: {
    AfterAccountAuthentication: {
      isSuccess: boolean
      accountContact?: PlentymarketsUser
    }
  }
}

export type PlentymarketsLoginRaw = {
  login: PlentymarketsLoginRes
}
//#endregion

//#region logout method
export type PlentymarketsLogoutRes = {
  events: {
    AfterAccountContactLogout: []
  }
  data: number
}

export type PlentymarketsLogoutRaw = {
  logout: PlentymarketsLogoutRes
}
//#endregion

//#region getUser method
export type PlentymarketsGetUserRes = {
  events: []
  data?: PlentymarketsUser
}

export type PlentymarketsGetUserRaw = {
  getUser: PlentymarketsGetUserRes
}

//#endregion

export type AdditionalPlentymarketsOptions = {
  url: string
}

export type FetchParameters = {
  path: string
  body?: object
  method?: string
}

export type FetchResponse<Response = any> = {
  response: Response
  status: number
}
