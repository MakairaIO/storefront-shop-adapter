import {
  MakairaAddItemToCart,
  MakairaShopUtilInteractor,
} from "@makaira/storefront-types";
import { StorefrontShopAdapterLocal } from "../provider";

export type MakairaAddItemToCartLocal = MakairaAddItemToCart;

export const addItemToCart: MakairaShopUtilInteractor<
  StorefrontShopAdapterLocal,
  MakairaAddItemToCartLocal
> = async (_provider, { input: { product } }) => {
  return { data: { raw: undefined } };
};
