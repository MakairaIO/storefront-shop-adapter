import { MakairaShopProviderInteractor } from "../general/shop-provider-interactor";

export type MakairaSignup<
  AdditionalInput = unknown,
  RawResponse = undefined,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  { username: string; password: string } & AdditionalInput,
  { raw: RawResponse },
  ResError
>;
