import { MakairaResponse } from './response'

export type MakairaShopProviderInteractorContext<Input> = {
  input: Input
}

export type MakairaShopProviderInteractor<
  Input = unknown,
  ResData = unknown,
  ResRawData = unknown,
  ResError extends Error = Error
> = (
  context: MakairaShopProviderInteractorContext<Input>
) => Promise<MakairaResponse<ResData, ResRawData, ResError>>
