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

  getWishlist: MakairaGetWishlist<unknown, undefined, Error> = async () => {
    return { raw: undefined, error: new Error('Not implemented') }
  }

  addItem: MakairaAddItemToWishlist<unknown, undefined, Error> = async () => {
    return { raw: undefined, error: new Error('Not implemented') }
  }

  removeItem: MakairaRemoveItemFromWishlist<unknown, undefined, Error> =
    async () => {
      return { raw: undefined, error: new Error('Not implemented') }
    }
}
