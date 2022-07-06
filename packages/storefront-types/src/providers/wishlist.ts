import { MakairaProduct } from '../product'
import { MakairaShopProviderInteractor } from '../general'

//#region type definition: getWishlist
export type MakairaGetWishlistInput<AdditionalInput = unknown> = AdditionalInput

export type MakairaGetWishlistResData<RawResponse = unknown> = {
  items: { product: MakairaProduct; quantity: number }[]
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

//#region type definition: provider wishlist
export type MakairaShopProviderWishlist = {
  getWishlist: MakairaGetWishlist
}
