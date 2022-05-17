import {
  MakairaLogin,
  MakairaLoginEvent,
  MakairaShopUtilInteractor,
} from "@makaira/storefront-types";
import { StorefrontShopAdapterLocal } from "../provider";

export type MakairaLoginLocal = MakairaLogin;

export const login: MakairaShopUtilInteractor<
  StorefrontShopAdapterLocal,
  MakairaLoginLocal
> = async (provider, { input: { password, username }, header }) => {
  provider.dispatchEvent(new MakairaLoginEvent());

  return { data: { user: { id: "123" }, raw: undefined } };
};
