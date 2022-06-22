import { MakairaShopProviderInteractor } from "../general/shop-provider-interactor";

//#region type definition: get-checkout
export type MakairaGetCheckoutInput<AdditionalInput = unknown> =
  AdditionalInput;

export type MakairaGetCheckoutResData<RawResponse = unknown> = {
  raw: RawResponse;
};

export type MakairaGetCheckout<
  AdditionalInput = unknown,
  RawResponse = unknown,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaGetCheckoutInput<AdditionalInput>,
  MakairaGetCheckoutResData<RawResponse>,
  ResError
>;
//#endregion

//#region type definition: submit-checkout
export type MakairaSubmitCheckoutInput<AdditionalInput = unknown> =
  AdditionalInput;

export type MakairaSubmitCheckoutResData<RawResponse = unknown> = {
  raw: RawResponse;
};

export type MakairaSubmitCheckout<
  AdditionalInput = unknown,
  RawResponse = unknown,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaSubmitCheckoutInput<AdditionalInput>,
  { raw: RawResponse },
  ResError
>;
//#endregion

//#region type definition: provider checkout
export type MakairaShopProviderCheckout = {
  getCheckout: MakairaGetCheckout;
  submit: MakairaSubmitCheckout;
};
