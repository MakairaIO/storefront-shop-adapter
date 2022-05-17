import {
  MakairaGetCart,
  MakairaShopUtilInteractor,
} from "@makaira/storefront-types";
import { StorefrontShopAdapterLocal } from "../provider";

export type MakairaGetCartLocal = MakairaGetCart;

export const getCart: MakairaShopUtilInteractor<
  StorefrontShopAdapterLocal,
  MakairaGetCartLocal
> = async (_provider) => {
  return { data: { raw: undefined } };
};
