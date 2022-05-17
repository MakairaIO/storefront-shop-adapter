import {
  MakairaGetCustomer,
  MakairaShopUtilInteractor,
} from "@makaira/storefront-types";
import { StorefrontShopAdapterLocal } from "../provider";

export type MakairaGetCustomerLocal = MakairaGetCustomer;

export const getCustomer: MakairaShopUtilInteractor<
  StorefrontShopAdapterLocal,
  MakairaGetCustomerLocal
> = async (_provider) => {
  return { data: { raw: undefined } };
};
