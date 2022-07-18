import { StorefrontReactClient, useShopClient } from '@makaira/storefront-react'
import { ReviewCreateEvent } from '@makaira/storefront-types'
import { useCallback, useEffect, useState } from 'react'

export type UseShopUserInput = {
  /**
   * The product for which you want to get reviews
   */
  product: {
    /**
     * The product id
     */
    id: string
  }
  /**
   * Pagination options
   */
  pagination?: {
    /**
     * The pagination offset
     */
    offset?: number
    /**
     * The pagination limit
     */
    limit?: number
  }
  refetchOnReviewCreated?: boolean
}

export type UseShopReviewsData = {
  /**
   * Indicator if the reviews are loading
   */
  loading: boolean
  /**
   * Indicator if an error occured while loading the reviews
   */
  error?: Error
  /**
   * The data of the request
   */
  data?: Awaited<
    ReturnType<StorefrontReactClient['client']['review']['getReviews']>
  >['data']
  /**
   * The raw data of the request
   */
  raw?: Awaited<
    ReturnType<StorefrontReactClient['client']['review']['getReviews']>
  >['raw']
  /**
   * Method to trigger a refetch
   */
  refetch: () => void
}

export function useShopReviews({
  product,
  pagination,
  refetchOnReviewCreated = false,
}: UseShopUserInput): UseShopReviewsData {
  const { client } = useShopClient()
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<{
    error: UseShopReviewsData['error']
    data: UseShopReviewsData['data']
    raw: UseShopReviewsData['raw']
  }>({
    error: undefined,
    data: undefined,
    raw: undefined,
  })

  const getReviews = useCallback(async () => {
    if (!client) {
      return
    }

    setLoading(true)

    const { data, error, raw } = await client.review.getReviews({
      input: { product: { id: product.id }, pagination },
    })

    setState({ data, error, raw })

    setLoading(false)
  }, [client, product.id, pagination?.limit, pagination?.offset])

  const refetch = useCallback(() => {
    getReviews()
  }, [getReviews])

  useEffect(() => {
    getReviews()
  }, [product.id, pagination?.limit, pagination?.offset])

  useEffect(() => {
    if (refetchOnReviewCreated && client) {
      client.addEventListener(ReviewCreateEvent.eventName, getReviews)

      return () =>
        client.removeEventListener(ReviewCreateEvent.eventName, getReviews)
    }
  }, [getReviews, client, refetchOnReviewCreated])

  return {
    loading,
    data: state.data,
    error: state.error,
    raw: state.raw,
    refetch,
  }
}
