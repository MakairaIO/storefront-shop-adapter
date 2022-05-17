import {
  MakairaShopUtilInteractor,
  MakairaUpdateItemFromCart,
} from "@makaira/storefront-types";
import { StorefrontShopAdapterLocal } from "../provider";

export type MakairaUpdateItemFromCartLocal = MakairaUpdateItemFromCart;

export const updateItemFromCart: MakairaShopUtilInteractor<
  StorefrontShopAdapterLocal,
  MakairaUpdateItemFromCartLocal
> = async (_provider) => {
  return { data: { raw: undefined } };
};
