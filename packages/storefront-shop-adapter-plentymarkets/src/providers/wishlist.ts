import { MakairaShopProviderWishlist } from '@makaira/storefront-types'
import { StorefrontShopAdapterPlentymarket } from './main'

export class StorefrontShopAdapterPlentymarketWishlist
  implements MakairaShopProviderWishlist
{
  constructor(private mainAdapter: StorefrontShopAdapterPlentymarket) {}
}
