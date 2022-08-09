import {
  MakairaAddItemToWishlist,
  MakairaGetWishlist,
  MakairaRemoveItemFromWishlist,
  MakairaShopProviderWishlist,
} from '@makaira/storefront-types'

import { StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__ } from './main'

export class StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Wishlist
  implements MakairaShopProviderWishlist
{
  constructor(
    private mainAdapter: StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__
  ) {}

  getWishlist: MakairaGetWishlist<unknown, undefined, Error> = async () => {}

  addItem: MakairaAddItemToWishlist<unknown, undefined, Error> = async () => {}

  removeItem: MakairaRemoveItemFromWishlist<unknown, undefined, Error> =
    async () => {}
}
