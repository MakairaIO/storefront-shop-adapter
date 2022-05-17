import {
  MakairaShopUtilInteractor,
  MakairaSignup,
} from "@makaira/storefront-types";
import { StorefrontShopAdapterLocal } from "../provider";

export type MakairaSignupLocal = MakairaSignup;

export const signup: MakairaShopUtilInteractor<
  StorefrontShopAdapterLocal,
  MakairaSignupLocal
> = async (_provider, { input: { username, password } }) => {
  return { data: { raw: undefined } };
};
