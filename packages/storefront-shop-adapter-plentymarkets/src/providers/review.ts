import {
  MakairaCreateReview,
  MakairaGetReviews,
  MakairaShopProviderReview,
  NotImplementedError,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterPlentymarkets } from './main'

export class StorefrontShopAdapterPlentymarketsReview
  implements MakairaShopProviderReview
{
  constructor(private mainAdapter: StorefrontShopAdapterPlentymarkets) {}

  getReviews: MakairaGetReviews<unknown, unknown, Error> = async () => {
    return { error: new NotImplementedError() }
  }

  createReview: MakairaCreateReview<unknown, unknown, Error> = async () => {
    return { error: new NotImplementedError() }
  }
}
