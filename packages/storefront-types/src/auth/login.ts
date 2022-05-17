import { MakairaShopProviderInteractor } from "../general/shop-provider-interactor";

export class MakairaLoginEvent extends CustomEvent<MakairaLoginResData> {
  static eventName = "makaira:login";
  constructor() {
    super(MakairaLoginEvent.eventName);
  }
}

export type MakairaLoginResData<RawResponse = undefined> = {
  user: { id: string };
  raw: RawResponse;
};

export type MakairaLogin<
  AdditionalInput = unknown,
  RawResponse = undefined,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  { username: string; password: string } & AdditionalInput,
  MakairaLoginResData<RawResponse>,
  ResError
>;
