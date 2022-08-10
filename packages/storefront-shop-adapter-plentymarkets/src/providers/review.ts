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

  getReviews: MakairaGetReviews<unknown, undefined, Error> = async () => {
    return { error: new NotImplementedError(), raw: undefined }
  }

  createReview: MakairaCreateReview<unknown, undefined, Error> = async () => {
    return { error: new NotImplementedError(), raw: undefined }
  }
}
