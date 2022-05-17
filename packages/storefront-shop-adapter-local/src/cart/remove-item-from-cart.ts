import {
  MakairaRemoveItemFromCart,
  MakairaShopUtilInteractor,
} from "@makaira/storefront-types";
import { StorefrontShopAdapterLocal } from "../provider";

export type MakairaRemoveItemFromCartLocal = MakairaRemoveItemFromCart;

export const removeItemFromCart: MakairaShopUtilInteractor<
  StorefrontShopAdapterLocal,
  MakairaRemoveItemFromCartLocal
> = async (_provider) => {
  return { data: { raw: undefined } };
};
