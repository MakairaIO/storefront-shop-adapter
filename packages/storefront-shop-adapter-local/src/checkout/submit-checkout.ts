import {
  MakairaShopUtilInteractor,
  MakairaSubmitCheckout,
} from "@makaira/storefront-types";
import { StorefrontShopAdapterLocal } from "../provider";

export type MakairaSubmitCheckoutLocal = MakairaSubmitCheckout;

export const submitCheckout: MakairaShopUtilInteractor<
  StorefrontShopAdapterLocal,
  MakairaSubmitCheckoutLocal
> = async (_provider) => {
  return { data: { raw: undefined } };
};
