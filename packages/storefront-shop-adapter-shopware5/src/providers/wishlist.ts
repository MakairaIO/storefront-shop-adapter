import {
  MakairaAddItemToWishlist,
  MakairaGetWishlist,
  MakairaRemoveItemFromWishlist,
  MakairaShopProviderWishlist,
  NotImplementedError,
} from '@makaira/storefront-types'

import { StorefrontShopAdapterShopware5 } from './main'

export class StorefrontShopAdapterShopware5Wishlist
  implements MakairaShopProviderWishlist
{
  constructor(private mainAdapter: StorefrontShopAdapterShopware5) {}

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
