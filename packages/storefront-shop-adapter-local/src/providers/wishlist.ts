import { MakairaShopProviderWishlist } from "@makaira/storefront-types";
import { StorefrontShopAdapterLocal } from "./main";

export class StorefrontShopAdapterLocalWishlist
  implements MakairaShopProviderWishlist
{
  constructor(private mainAdapter: StorefrontShopAdapterLocal) {}
}
