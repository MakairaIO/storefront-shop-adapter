import {
  MakairaGetCheckout,
  MakairaShopProviderCheckout,
  MakairaSubmitCheckout,
  NotImplementedError,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterOxid } from './main'

export class StorefrontShopAdapterOxidCheckout
  implements MakairaShopProviderCheckout
{
  constructor(private mainAdapter: StorefrontShopAdapterOxid) {}

  getCheckout: MakairaGetCheckout<unknown, undefined, Error> = async () => {
    return { error: new NotImplementedError(), raw: undefined }
  }

  submit: MakairaSubmitCheckout<unknown, undefined, Error> = async () => {
    return { error: new NotImplementedError(), raw: undefined }
  }
}
