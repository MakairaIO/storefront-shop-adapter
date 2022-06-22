import {
  MakairaGetCheckout,
  MakairaShopProviderCheckout,
  MakairaSubmitCheckout,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterPlentymarket } from './main'

export class StorefrontShopAdapterPlentymarketCheckout
  implements MakairaShopProviderCheckout
{
  constructor(private mainAdapter: StorefrontShopAdapterPlentymarket) {}

  getCheckout: MakairaGetCheckout<unknown, undefined, Error> = async () => {
    return { data: undefined, error: undefined }
  }

  submit: MakairaSubmitCheckout<unknown, undefined, Error> = async () => {
    return { data: undefined, error: undefined }
  }
}
