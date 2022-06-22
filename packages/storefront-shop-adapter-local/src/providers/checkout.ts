import {
  MakairaGetCheckout,
  MakairaShopProviderCheckout,
  MakairaSubmitCheckout,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterLocal } from './main'

export class StorefrontShopAdapterLocalCheckout
  implements MakairaShopProviderCheckout
{
  constructor(private mainAdapter: StorefrontShopAdapterLocal) {}

  getCheckout: MakairaGetCheckout<unknown, undefined, Error> = async () => {
    return { data: undefined, error: undefined }
  }

  submit: MakairaSubmitCheckout<unknown, undefined, Error> = async () => {
    return { data: undefined, error: undefined }
  }
}
