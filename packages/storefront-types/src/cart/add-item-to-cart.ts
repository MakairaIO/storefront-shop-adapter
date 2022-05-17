import { MakairaShopProviderInteractor } from "../general/shop-provider-interactor";
import { MakairaProduct } from "../product/product";

export type MakairaAddItemToCart<
  AdditionalInput = unknown,
  RawResponse = undefined,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  { product: MakairaProduct } & AdditionalInput,
  { raw: RawResponse },
  ResError
>;
