import { MakairaResponse } from "./response";

export type MakairaShopProviderInteractorContext<Input> = {
  input: Input;
  header?: Headers;
};

export type MakairaShopProviderInteractor<
  Input = unknown,
  ResData = unknown,
  ResError extends Error = Error
> = (
  context: MakairaShopProviderInteractorContext<Input>
) => Promise<MakairaResponse<ResData, ResError>>;
