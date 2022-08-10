import {
  MakairaCreateReview,
  MakairaGetReviews,
  MakairaShopProviderReview,
} from '@makaira/storefront-types'
import { StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__ } from './main'

export class StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Review
  implements MakairaShopProviderReview
{
  constructor(
    private mainAdapter: StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__
  ) {}

  getReviews: MakairaGetReviews<unknown, undefined, Error> = async () => {}

  createReview: MakairaCreateReview<unknown, undefined, Error> = async () => {}
}
