import {
  MakairaGetCheckout,
  MakairaShopProviderCheckout,
  MakairaSubmitCheckout,
} from '@makaira/storefront-types'
import { StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__ } from './main'

export class StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Checkout
  implements MakairaShopProviderCheckout
{
  constructor(
    private mainAdapter: StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__
  ) {}

  getCheckout: MakairaGetCheckout<unknown, undefined, Error> = async () => {}

  submit: MakairaSubmitCheckout<unknown, undefined, Error> = async () => {}
}
