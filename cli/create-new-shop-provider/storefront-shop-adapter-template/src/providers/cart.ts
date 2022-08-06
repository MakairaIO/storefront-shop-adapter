import {
  MakairaAddItemToCart,
  MakairaGetCart,
  MakairaRemoveItemFromCart,
  MakairaShopProviderCart,
  MakairaUpdateItemFromCart,
} from '@makaira/storefront-types'

import { StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__ } from './main'

export class StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Cart
  implements MakairaShopProviderCart
{
  constructor(
    private mainAdapter: StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__
  ) {}

  getCart: MakairaGetCart<unknown, undefined, Error> = async () => {}

  addItem: MakairaAddItemToCart<unknown, undefined, Error> = async () => {}

  removeItem: MakairaRemoveItemFromCart<unknown, undefined, Error> =
    async () => {}

  updateItem: MakairaUpdateItemFromCart<unknown, undefined, Error> =
    async () => {}
}
