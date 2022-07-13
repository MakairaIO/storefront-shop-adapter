import { MakairaShopProviderInteractor } from '../general/shop-provider-interactor'
import { MakairaProduct } from '../product'

//#region type definition: add-to-cart
export type MakairaAddItemToCartInput<AdditionalInput = unknown> = {
  product: { id: string; attributes?: { key: string; value: string }[] }
  quantity: number
} & AdditionalInput

export type MakairaAddItemToCartResData = {
  items: { product: MakairaProduct; quantity: number }[]
}

export type MakairaAddItemToCart<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaAddItemToCartInput<AdditionalInput>,
  MakairaAddItemToCartResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: get-cart
export type MakairaGetCartInput<AdditionalInput = unknown> = AdditionalInput

export type MakairaGetCartResData = {
  items: { product: MakairaProduct; quantity: number }[]
}

export type MakairaGetCart<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaGetCartInput<AdditionalInput>,
  MakairaGetCartResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: remove-item-from-cart
export type MakairaRemoveItemFromCartInput<AdditionalInput = unknown> = {
  product: { id: string; attributes?: { key: string; value: string }[] }
} & AdditionalInput

export type MakairaRemoveItemFromCartResData = {
  items: { product: MakairaProduct; quantity: number }[]
}

export type MakairaRemoveItemFromCart<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaRemoveItemFromCartInput<AdditionalInput>,
  MakairaRemoveItemFromCartResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: update-item
export type MakairaUpdateItemFromCartInput<AdditionalInput = unknown> = {
  product: { id: string; attributes?: { key: string; value: string }[] }
  quantity: number
} & AdditionalInput

export type MakairaUpdateItemFromCartResData = {
  items: { product: MakairaProduct; quantity: number }[]
}

export type MakairaUpdateItemFromCart<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaUpdateItemFromCartInput<AdditionalInput>,
  MakairaUpdateItemFromCartResData,
  ResRawData,
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
