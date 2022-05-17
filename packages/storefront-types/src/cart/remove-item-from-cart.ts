import { MakairaShopProviderInteractor } from "../general/shop-provider-interactor";
import { MakairaProduct } from "../product/product";

export type MakairaRemoveItemFromCart<
  AdditionalInput = unknown,
  RawResponse = undefined,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  { product: MakairaProduct } & AdditionalInput,
  { raw: RawResponse },
  ResError
>;
