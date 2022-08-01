import { faker } from '@faker-js/faker'
import {
  MakairaCreateReview,
  MakairaGetReviews,
  MakairaReview,
  MakairaShopProviderReview,
  ReviewCreateEvent,
} from '@makaira/storefront-types'
import { ShopAdapterLocalStorageVersioned } from '../types'
import { StorefrontShopAdapterLocal } from './main'

type ReviewStore = {
  items: Array<{ review: MakairaReview }>
}

type ReviewStoreVersioned = ShopAdapterLocalStorageVersioned<'v1', ReviewStore>

export class StorefrontShopAdapterLocalReview
  implements MakairaShopProviderReview
{
  LOCAL_STORAGE_STORE = 'makaira-shop-local-review'

  constructor(private mainAdapter: StorefrontShopAdapterLocal) {}

  getReviews: MakairaGetReviews<unknown, ReviewStore, Error> = async ({
    input: { product, pagination = {} },
  }) => {
    const paginationWithDefaults = Object.assign(
      { limit: 20, offset: 0 },
      pagination
    )

    const reviewStore = this.getStore()

    return {
      data: {
        items: reviewStore.items
          .filter(({ review }) => review.product.id === product.id)
          .slice(
            paginationWithDefaults.offset,
            paginationWithDefaults.offset + paginationWithDefaults.limit
          ),
      },
      raw: reviewStore,
      error: undefined,
    }
  }

  createReview: MakairaCreateReview<unknown, ReviewStoreVersioned, Error> =
    async ({ input: { review } }) => {
      const reviewStore = this.getStore()

      const reviewData: MakairaReview = {
        id: faker.datatype.uuid(),
        product: { id: review.product.id },
        rating: review.rating,
        text: review.text,
      }

      reviewStore.items.push({
        review: reviewData,
      })

      this.setStore(reviewStore)

      const data = { review: reviewData }

      this.mainAdapter.dispatchEvent(
        new ReviewCreateEvent<ReviewStoreVersioned>(
          { review: reviewData },
          reviewStore
        )
      )

      return { data, raw: reviewStore, error: undefined }
    }

  private getStore(): ReviewStoreVersioned {
    const rawStore = localStorage.getItem(this.LOCAL_STORAGE_STORE)

    if (!rawStore) {
      return { version: 'v1', items: [] }
    }

    return JSON.parse(rawStore) as ReviewStoreVersioned
  }

  private async setStore(store: ReviewStoreVersioned) {
    localStorage.setItem(this.LOCAL_STORAGE_STORE, JSON.stringify(store))
  }
}
