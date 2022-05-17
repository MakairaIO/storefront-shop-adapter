import {
  MakairaLogout,
  MakairaShopUtilInteractor,
} from "@makaira/storefront-types";
import { StorefrontShopAdapterLocal } from "../provider";

export type MakairaLogoutLocal = MakairaLogout;

export const logout: MakairaShopUtilInteractor<
  StorefrontShopAdapterLocal,
  MakairaLogoutLocal
> = async () => {
  return { data: { raw: undefined } };
};
