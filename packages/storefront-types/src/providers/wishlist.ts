import { MakairaProduct } from '../product'
import { MakairaShopProviderInteractor } from '../general'

//#region type definition: getWishlist
export type MakairaGetWishlistInput<AdditionalInput = unknown> = AdditionalInput

export type MakairaGetWishlistResData = {
  items: { product: MakairaProduct }[]
}

export type MakairaGetWishlist<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaGetWishlistInput<AdditionalInput>,
  MakairaGetWishlistResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: add-to-wishlist
export type MakairaAddItemToWishlistInput<AdditionalInput = unknown> = {
  product: { id: string; attributes?: { key: string; value: string }[] }
} & AdditionalInput

export type MakairaAddItemToWishlistResData = {
  items: { product: MakairaProduct }[]
}

export type MakairaAddItemToWishlist<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaAddItemToWishlistInput<AdditionalInput>,
  MakairaAddItemToWishlistResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: remove-item-from-wishlist
export type MakairaRemoveItemFromWishlistInput<AdditionalInput = unknown> = {
  product: { id: string; attributes?: { key: string; value: string }[] }
} & AdditionalInput

export type MakairaRemoveItemFromWishlistResData = {
  items: { product: MakairaProduct }[]
}

export type MakairaRemoveItemFromWishlist<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaRemoveItemFromWishlistInput<AdditionalInput>,
  MakairaRemoveItemFromWishlistResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: provider wishlist
export type MakairaShopProviderWishlist = {
  getWishlist: MakairaGetWishlist
  addItem: MakairaAddItemToWishlist
  removeItem: MakairaRemoveItemFromWishlist
}
