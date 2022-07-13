import { MakairaShopProviderInteractor } from '../general/shop-provider-interactor'

//#region type definition: get-checkout
export type MakairaGetCheckoutInput<AdditionalInput = unknown> = AdditionalInput

export type MakairaGetCheckoutResData = undefined

export type MakairaGetCheckout<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaGetCheckoutInput<AdditionalInput>,
  MakairaGetCheckoutResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: submit-checkout
export type MakairaSubmitCheckoutInput<AdditionalInput = unknown> =
  AdditionalInput

export type MakairaSubmitCheckoutResData = undefined

export type MakairaSubmitCheckout<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaSubmitCheckoutInput<AdditionalInput>,
  MakairaSubmitCheckoutResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: provider checkout
export type MakairaShopProviderCheckout = {
  getCheckout: MakairaGetCheckout
  submit: MakairaSubmitCheckout
}
