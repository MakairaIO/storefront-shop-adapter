import { MakairaProduct } from '../product'
import { MakairaShopProviderInteractor } from '../general'

//#region type definition: getWishlist
export type MakairaGetWishlistInput<AdditionalInput = unknown> = AdditionalInput

export type MakairaGetWishlistResData<RawResponse = unknown> = {
  items: { product: MakairaProduct }[]
  raw: RawResponse
}

export type MakairaGetWishlist<
  AdditionalInput = any,
  RawResponse = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaGetWishlistInput<AdditionalInput>,
  MakairaGetWishlistResData<RawResponse>,
  ResError
>
//#endregion

//#region type definition: add-to-wishlist
export type MakairaAddItemToWishlistInput<AdditionalInput = unknown> = {
  product: { id: string; attributes?: { key: string; value: string }[] }
} & AdditionalInput

export type MakairaAddItemToWishlistResData<RawResponse = unknown> = {
  items: { product: MakairaProduct }[]
  raw: RawResponse
}

export type MakairaAddItemToWishlist<
  AdditionalInput = any,
  RawResponse = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaAddItemToWishlistInput<AdditionalInput>,
  MakairaAddItemToWishlistResData<RawResponse>,
  ResError
>
//#endregion

//#region type definition: remove-item-from-wishlist
export type MakairaRemoveItemFromWishlistInput<AdditionalInput = unknown> = {
  product: { id: string; attributes?: { key: string; value: string }[] }
} & AdditionalInput

export type MakairaRemoveItemFromWishlistResData<RawResponse = unknown> = {
  items: { product: MakairaProduct }[]
  raw: RawResponse
}

export type MakairaRemoveItemFromWishlist<
  AdditionalInput = any,
  RawResponse = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaRemoveItemFromWishlistInput<AdditionalInput>,
  MakairaRemoveItemFromWishlistResData<RawResponse>,
  ResError
>
//#endregion

//#region type definition: provider wishlist
export type MakairaShopProviderWishlist = {
  getWishlist: MakairaGetWishlist
  addItem: MakairaAddItemToWishlist
  removeItem: MakairaRemoveItemFromWishlist
}
