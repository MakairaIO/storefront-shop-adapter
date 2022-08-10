import {
  MakairaGetCheckout,
  MakairaShopProviderCheckout,
  MakairaSubmitCheckout,
  NotImplementedError,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterShopify } from './main'

export class StorefrontShopAdapterShopifyCheckout
  implements MakairaShopProviderCheckout
{
  constructor(private mainAdapter: StorefrontShopAdapterShopify) {}

  getCheckout: MakairaGetCheckout<unknown, undefined, Error> = async () => {
    return { error: new NotImplementedError(), raw: undefined }
  }

  submit: MakairaSubmitCheckout<unknown, undefined, Error> = async () => {
    return { error: new NotImplementedError(), raw: undefined }
  }
}
