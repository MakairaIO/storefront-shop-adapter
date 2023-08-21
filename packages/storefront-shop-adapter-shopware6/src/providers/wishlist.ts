import {
  MakairaAddItemToWishlist,
  MakairaGetWishlist,
  MakairaRemoveItemFromWishlist,
  MakairaShopProviderWishlist,
  NotImplementedError,
} from '@makaira/storefront-types'

import { StorefrontShopAdapterShopware6 } from './main'

export class StorefrontShopAdapterShopware6Wishlist
  implements MakairaShopProviderWishlist
{
  constructor(private mainAdapter: StorefrontShopAdapterShopware6) {}

  getWishlist: MakairaGetWishlist<unknown, undefined, Error> = async () => {
    return { error: new NotImplementedError(), raw: undefined }
  }

  addItem: MakairaAddItemToWishlist<unknown, undefined, Error> = async () => {
    return { error: new NotImplementedError(), raw: undefined }
  }

  removeItem: MakairaRemoveItemFromWishlist<unknown, undefined, Error> =
    async () => {
      return { error: new NotImplementedError(), raw: undefined }
    }
}
