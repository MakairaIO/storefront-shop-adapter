import {
  MakairaAddItemToWishlist,
  MakairaGetWishlist,
  MakairaRemoveItemFromWishlist,
  MakairaShopProviderWishlist,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterOxid } from './main'

export class StorefrontShopAdapterOxidWishlist
  implements MakairaShopProviderWishlist
{
  constructor(private mainAdapter: StorefrontShopAdapterOxid) {}

  getWishlist: MakairaGetWishlist = async () => {
    return {}
  }

  addItem: MakairaAddItemToWishlist<unknown, unknown, Error> = async () => {
    return { error: new Error('Not implemented') }
  }

  removeItem: MakairaRemoveItemFromWishlist<unknown, unknown, Error> =
    async () => {
      return { error: new Error('Not implemented') }
    }
}
