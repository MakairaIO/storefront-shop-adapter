import {
  MakairaGetWishlist,
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
}
