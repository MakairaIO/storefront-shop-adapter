import {
  BadHttpStatusError,
  MakairaCreateReview,
  MakairaGetReviews,
  MakairaReview,
  MakairaShopProviderReview,
  ReviewCreateEvent,
} from '@makaira/storefront-types'
import { REVIEW_ACTION_GET, PRODUCT_PATH, REVIEW_ACTION_CREATE } from '../paths'
import {
  ShopwareCreateReviewAdditionalInput,
  ShopwareCreateReviewRaw,
  ShopwareCreateReviewRes,
  ShopwareGetReviewsRaw,
  ShopwareGetReviewsRes,
  ShopwareSearchBody,
} from '../types'
import { StorefrontShopAdapterShopware6 } from './main'

export class StorefrontShopAdapterShopware6Review
  implements MakairaShopProviderReview
{
  constructor(private mainAdapter: StorefrontShopAdapterShopware6) {}

  /**
   * Get Review of product
   *
   * @example
   *
   * // Example 1: Get review of product with pagination
   * getReviews({
   *    input: {
   *      product: { id: '<product id>' },
   *      pagination: {
   *        limit: 20,
   *        offset: 0
   *      },
   *    }
   *  })
   *
   *  //Example 2: Get visible review of product
   *  getReviews({
   *    input: {
   *      product: { id: '<product id>' },
   *      pagination: {
   *        limit: 20,
   *        offset: 0
   *      },
   *      filter: [
   *        {
   *          field: 'status',
   *          type: 'equals',
   *          value: true
   *        }
   *      ]
   *    }
   *  })
   */
  getReviews: MakairaGetReviews<
    ShopwareSearchBody,
    ShopwareGetReviewsRaw,
    Error
  > = async ({ input: { product, pagination, ...rest } }) => {
    const paginationWithDefaults = Object.assign(
      { limit: 20, offset: 0 },
      pagination
    )

    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareGetReviewsRes>({
          path: `${PRODUCT_PATH}/${product.id}/${REVIEW_ACTION_GET}`,
          method: 'POST',
          body: {
            page:
              Math.ceil(
                paginationWithDefaults.offset / paginationWithDefaults.limit
              ) + 1,
            limit: paginationWithDefaults.limit,
            ...rest,
          },
        })

      if (
        status !== 200 ||
        (Array.isArray(response.errors) && response.errors.length > 0)
      ) {
        return {
          data: undefined,
          raw: { getReviews: response },
          error:
            Array.isArray(response.errors) && response.errors.length > 0
              ? new Error(response.errors[0].detail)
              : new BadHttpStatusError(),
        }
      }

      const items: { review: MakairaReview }[] = response.elements.map(
        (item) => ({
          review: {
            id: item.id,
            product: { id: product.id },
            rating: item.points,
            text: item.content,
          },
        })
      )

      return {
        data: { items },
        raw: { getReviews: response },
        error: undefined,
      }
    } catch (e) {
      return {
        data: undefined,
        raw: { getReviews: undefined },
        error: e as Error,
      }
    }
  }

  createReview: MakairaCreateReview<
    ShopwareCreateReviewAdditionalInput,
    ShopwareCreateReviewRaw,
    Error
  > = async ({ input: { review, email, title, name } }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareCreateReviewRes>({
          path: `${PRODUCT_PATH}/${review.product.id}/${REVIEW_ACTION_CREATE}`,
          method: 'POST',
          body: {
            content: review.text,
            points: review.rating,
            name,
            title: title || review.text?.split('\n')[0],
            email,
          },
        })

      if (
        ![200, 204, 201].includes(status) ||
        (response &&
          Array.isArray(response.errors) &&
          response.errors.length > 0)
      ) {
        return {
          data: undefined,
          raw: { getReviews: response },
          error:
            Array.isArray(response.errors) && response.errors.length > 0
              ? new Error(response.errors[0].detail)
              : new BadHttpStatusError(),
        }
      }

      const raw: ShopwareCreateReviewRaw = {
        createReview: response,
      }

      const data: { review: MakairaReview } = {
        review: {
          id: '', // TODO
          product: { id: review.product.id },
          rating: review.rating,
          text: review.text,
        },
      }

      this.mainAdapter.dispatchEvent(
        new ReviewCreateEvent<ShopwareCreateReviewRaw>(data, raw)
      )

      return { data, raw, error: undefined }
    } catch (e) {
      return {
        data: undefined,
        raw: { createReview: undefined },
        error: e as Error,
      }
    }
  }
}
