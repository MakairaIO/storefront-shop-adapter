import { MakairaShopProviderInteractor } from "../general/shop-provider-interactor";

export type MakairaGetCustomer<
  AdditionalInput = unknown,
  RawResponse = undefined,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  AdditionalInput,
  { raw: RawResponse },
  ResError
>;
