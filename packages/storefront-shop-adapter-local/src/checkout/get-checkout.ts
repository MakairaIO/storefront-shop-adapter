import {
  MakairaGetCheckout,
  MakairaShopUtilInteractor,
} from "@makaira/storefront-types";
import { StorefrontShopAdapterLocal } from "../provider";

export type MakairaGetCheckoutLocal = MakairaGetCheckout;

export const getCheckout: MakairaShopUtilInteractor<
  StorefrontShopAdapterLocal,
  MakairaGetCheckoutLocal
> = async (_provider) => {
  return { data: { raw: undefined } };
};
