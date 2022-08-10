import {
  MakairaAddItemToWishlist,
  MakairaGetWishlist,
  MakairaRemoveItemFromWishlist,
  MakairaShopProviderWishlist,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterShopify } from './main'

export class StorefrontShopAdapterShopifyWishlist
  implements MakairaShopProviderWishlist
{
  constructor(private mainAdapter: StorefrontShopAdapterShopify) {}

  getWishlist: MakairaGetWishlist<unknown, undefined, Error> = async () => {
    return { error: new Error('Not implemented'), raw: undefined }
  }

  addItem: MakairaAddItemToWishlist<unknown, undefined, Error> = async () => {
    return { error: new Error('Not implemented'), raw: undefined }
  }

  removeItem: MakairaRemoveItemFromWishlist<unknown, undefined, Error> =
    async () => {
      return { error: new Error('Not implemented'), raw: undefined }
    }
}
