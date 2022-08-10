import {
  MakairaCreateReview,
  MakairaGetReviews,
  MakairaShopProviderReview,
  NotImplementedError,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterShopify } from './main'

export class StorefrontShopAdapterShopifyReview
  implements MakairaShopProviderReview
{
  constructor(private mainAdapter: StorefrontShopAdapterShopify) {}

  getReviews: MakairaGetReviews<unknown, undefined, Error> = async () => {
    return { error: new NotImplementedError(), raw: undefined }
  }

  createReview: MakairaCreateReview<unknown, unknown, Error> = async () => {
    return { error: new NotImplementedError(), raw: undefined }
  }
}
