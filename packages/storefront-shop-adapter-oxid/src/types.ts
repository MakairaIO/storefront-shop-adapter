//#region general oxid types
export type OxidProduct = {
  cart_item_id: string
  name: string
  price: number
  base_price: string
  quantity: number
  image_path: string
}

export type OxidUser = {
  id: string
  firstname: string
  lastname: string
  email: string
}

export type OxidReview = {
  id: string
  text: string
  rating: number
}

//#endregion

//#region cart provider

//#region getCart method

export type OxidGetCartRes = OxidProduct[] | { success: false; message: string }

export type OxidGetCartRaw = { getCart: OxidGetCartRes }

//#endregion

//#region addItem method

export type OxidAddItemRes =
  | { success: true }
  | { success: false; message: string }

export type OxidAddItemRaw = {
  addItem: OxidAddItemRes
  getCart?: OxidGetCartRaw['getCart']
}

//#endregion

//#region addItem method

export type OxidRemoveItemRes =
  | { success: true }
  | { success: false; message: string }

export type OxidRemoveItemRaw = {
  removeItem: OxidRemoveItemRes
  getCart?: OxidGetCartRaw['getCart']
}

//#endregion

//#region updateItem method

export type OxidUpdateItemRes =
  | { success: true }
  | { success: false; message: string }

export type OxidUpdateItemRaw = {
  updateItem: OxidUpdateItemRes
  getCart?: OxidGetCartRaw['getCart']
}

//#endregion

//#endregion

//#region user provider

//#region getUser method

export type OxidGetUserRes = OxidUser | { message: string }

export type OxidGetUserRaw = { getUser: OxidGetUserRes }

//#endregion

//#region logout method

export type OxidLogoutRes = { success: true }

export type OxidLogoutRaw = {
  logout: OxidAddItemRes
}

//#endregion

//#region login method

export type OxidLoginRes =
  | { success: true }
  | { success: false; message: string }

export type OxidLoginRaw = {
  login: OxidRemoveItemRes
  getUser?: OxidGetUserRaw['getUser']
}

//#endregion

//#endregion

//#endregion

//#region review provider

//#region getReviews method

export type OxidGetReviewsRes =
  | OxidReview[]
  | { success: false; message: string }

export type OxidGetReviewsRaw = { getReviews: OxidGetReviewsRes }

//#endregion

//#region createReview method

export type OxidCreateReviewRes =
  | { success: true }
  | { success: false; message: string }

export type OxidCreateReviewRaw = {
  createReview: OxidCreateReviewRes
}

//#endregion

//#endregion

export type AdditionalInputLoginOxid = {
  // asd
  rememberLogin: boolean
}

export type AdditionalOxidOptions = {
  url: string
}

export type FetchParameters = {
  path: string
  body?: object
}

export type FetchResponse<Response = any> = {
  response: Response
  status: number
}
