import {
  BadHttpStatusError,
  MakairaCreateReview,
  MakairaGetReviews,
  MakairaReview,
  MakairaShopProviderReview,
  ReviewCreateEvent,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterOxid } from './main'
import { REVIEW_GET, REVIEW_CREATE } from '../paths'
import {
  OxidCreateReviewRaw,
  OxidCreateReviewRes,
  OxidGetReviewsRaw,
  OxidGetReviewsRes,
} from '../types'

export class StorefrontShopAdapterOxidReview
  implements MakairaShopProviderReview
{
  constructor(private mainAdapter: StorefrontShopAdapterOxid) {}

  getReviews: MakairaGetReviews<unknown, OxidGetReviewsRaw, Error> = async ({
    input: { product, pagination },
  }) => {
    const paginationWithDefaults = Object.assign(
      { limit: 20, offset: 0 },
      pagination
    )

    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<OxidGetReviewsRes>({
          path: REVIEW_GET,
          body: {
            id: product.id,
            limit: paginationWithDefaults.limit,
            offset: paginationWithDefaults.offset,
          },
        })

      if (status !== 200 || !Array.isArray(response)) {
        return {
          data: undefined,
          raw: { getReviews: response },
          error: !Array.isArray(response)
            ? new Error(response.message)
            : new BadHttpStatusError(),
        }
      }

      const items: { review: MakairaReview }[] = response.map((item) => ({
        review: {
          id: item.id,
          product: { id: product.id },
          rating: item.rating,
          text: item.text,
        },
      }))

      return {
        data: { items },
        raw: { getReviews: response },
        error: undefined,
      }
    } catch (e) {
      return { data: undefined, error: e as Error }
    }
  }

  createReview: MakairaCreateReview<unknown, OxidCreateReviewRaw, Error> =
    async ({ input: { review } }) => {
      try {
        const { response, status } =
          await this.mainAdapter.fetchFromShop<OxidCreateReviewRes>({
            path: REVIEW_CREATE,
            body: {
              product_id: review.product.id,
              rating: review.rating,
              text: review.text,
            },
          })

        if (status !== 200 || response.success === false) {
          return {
            data: undefined,
            raw: { createReview: response },
            error:
              response.success === false
                ? new Error(response.message)
                : new BadHttpStatusError(),
          }
        }

        const raw: OxidCreateReviewRaw = {
          createReview: response,
        }

        const data: { review: MakairaReview } = {
          review: {
            id: '',
            product: { id: review.product.id },
            rating: review.rating,
            text: review.text,
          },
        }

        this.mainAdapter.dispatchEvent(
          new ReviewCreateEvent<OxidCreateReviewRaw>(data, raw)
        )

        return { data, raw, error: undefined }
      } catch (e) {
        return { data: undefined, error: e as Error }
      }
    }
}
