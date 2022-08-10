import {
  MakairaGetCheckout,
  MakairaShopProviderCheckout,
  MakairaSubmitCheckout,
  NotImplementedError,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterLocal } from './main'

export class StorefrontShopAdapterLocalCheckout
  implements MakairaShopProviderCheckout
{
  constructor(private mainAdapter: StorefrontShopAdapterLocal) {}

  getCheckout: MakairaGetCheckout<unknown, undefined, Error> = async () => {
    return { error: new NotImplementedError(), raw: undefined }
  }

  submit: MakairaSubmitCheckout<unknown, undefined, Error> = async () => {
    return { error: new NotImplementedError(), raw: undefined }
  }
}
