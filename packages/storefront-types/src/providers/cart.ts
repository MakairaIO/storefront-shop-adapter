import { MakairaShopProviderInteractor } from '../general/shop-provider-interactor'
import { MakairaProduct } from '../product'

//#region type definition: add-to-cart
export type MakairaAddItemToCartInput<AdditionalInput = unknown> = {
  product: { id: string; attributes?: { key: string; value: string }[] }
  quantity: number
} & AdditionalInput

export type MakairaAddItemToCartResData<RawResponse = unknown> = {
  items: { product: MakairaProduct; quantity: number }[]
  raw: RawResponse
}

export type MakairaAddItemToCart<
  AdditionalInput = any,
  RawResponse = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaAddItemToCartInput<AdditionalInput>,
  MakairaAddItemToCartResData<RawResponse>,
  ResError
>
//#endregion

//#region type definition: get-cart
export type MakairaGetCartInput<AdditionalInput = unknown> = AdditionalInput

export type MakairaGetCartResData<RawResponse = unknown> = {
  items: { product: MakairaProduct; quantity: number }[]
  raw: RawResponse
}

export type MakairaGetCart<
  AdditionalInput = any,
  RawResponse = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaGetCartInput<AdditionalInput>,
  MakairaGetCartResData<RawResponse>,
  ResError
>
//#endregion

//#region type definition: remove-item-from-cart
export type MakairaRemoveItemFromCartInput<AdditionalInput = unknown> = {
  product: { id: string; attributes?: { key: string; value: string }[] }
} & AdditionalInput

export type MakairaRemoveItemFromCartResData<RawResponse = unknown> = {
  items: { product: MakairaProduct; quantity: number }[]
  raw: RawResponse
}

export type MakairaRemoveItemFromCart<
  AdditionalInput = any,
  RawResponse = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaRemoveItemFromCartInput<AdditionalInput>,
  MakairaRemoveItemFromCartResData<RawResponse>,
  ResError
>
//#endregion

//#region type definition: update-item
export type MakairaUpdateItemFromCartInput<AdditionalInput = unknown> = {
  product: { id: string; attributes?: { key: string; value: string }[] }
  quantity: number
} & AdditionalInput

export type MakairaUpdateItemFromCartResData<RawResponse = unknown> = {
  raw: RawResponse
}

export type MakairaUpdateItemFromCart<
  AdditionalInput = any,
  RawResponse = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaUpdateItemFromCartInput<AdditionalInput>,
  MakairaUpdateItemFromCartResData<RawResponse>,
  ResError
>
//#endregion

//#region type definition: provider cart
export type MakairaShopProviderCart = {
  addItem: MakairaAddItemToCart
  getCart: MakairaGetCart
  removeItem: MakairaRemoveItemFromCart
  updateItem: MakairaUpdateItemFromCart
}
