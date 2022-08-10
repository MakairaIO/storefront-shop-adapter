import {
  BadHttpStatusError,
  MakairaCreateReview,
  MakairaGetReviews,
  MakairaReview,
  MakairaShopProviderReview,
  ReviewCreateEvent,
} from '@makaira/storefront-types'
import { REVIEW_ACTION_CREATE, REVIEW_ACTION_GET, REVIEW_PATH } from '../paths'
import {
  ShopwareCreateReviewAdditionalInput,
  ShopwareCreateReviewRaw,
  ShopwareCreateReviewRes,
  ShopwareGetReviewsRaw,
  ShopwareGetReviewsRes,
} from '../types'
import { StorefrontShopAdapterShopware5 } from './main'

export class StorefrontShopAdapterShopware5Review
  implements MakairaShopProviderReview
{
  constructor(private mainAdapter: StorefrontShopAdapterShopware5) {}

  getReviews: MakairaGetReviews<unknown, ShopwareGetReviewsRaw, Error> =
    async ({ input: { product } }) => {
      try {
        const { response, status } =
          await this.mainAdapter.fetchFromShop<ShopwareGetReviewsRes>({
            path: REVIEW_PATH,
            action: REVIEW_ACTION_GET,
            body: {
              article_id: product.id,
            },
          })

        if (status !== 200 || !Array.isArray(response)) {
          return {
            data: undefined,
            raw: { getReviews: response },
            error:
              !Array.isArray(response) && response?.message
                ? new Error(response.message)
                : new BadHttpStatusError(),
          }
        }

        const items: { review: MakairaReview }[] = response.map((item) => ({
          review: {
            id: '', // TODO
            product: { id: product.id },
            rating: item.points,
            text: item.comment,
          },
        }))

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
  > = async ({ input: { review, email, headline, name } }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareCreateReviewRes>({
          path: REVIEW_PATH,
          action: REVIEW_ACTION_CREATE,
          body: {
            article_id: review.product.id,
            comment: review.text,
            points: review.rating,
            name,
            headline,
            email,
          },
        })

      if (status !== 200 || response.ok === false) {
        return {
          data: undefined,
          raw: { createReview: response },
          error:
            response.ok === false
              ? new Error(response.message)
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
