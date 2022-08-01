import {
  MakairaGetCheckout,
  MakairaShopProviderCheckout,
  MakairaSubmitCheckout,
  NotImplementedError,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterPlentymarkets } from './main'

export class StorefrontShopAdapterPlentymarketsCheckout
  implements MakairaShopProviderCheckout
{
  constructor(private mainAdapter: StorefrontShopAdapterPlentymarkets) {}

  getCheckout: MakairaGetCheckout<unknown, undefined, Error> = async () => {
    return { error: new NotImplementedError() }
  }

  submit: MakairaSubmitCheckout<unknown, undefined, Error> = async () => {
    return { error: new NotImplementedError() }
  }
}
