import { MakairaResponse } from '@makaira/storefront-types'
import { useCallback, useContext } from 'react'
import { ShopContext, ShopContextData } from '../context'

export type UseShopWishlistData = {
  /**
   * The current wishlist with the products
   */
  wishlist: ShopContextData['wishlist']
  /**
   *
   */
  isProductInWishlist: (id: string) => MakairaResponse<boolean, Error>
}

export function useShopWishlist(): UseShopWishlistData {
  const { wishlist } = useContext(ShopContext)

  const isProductInWishlist = useCallback(
    (id: string): MakairaResponse<boolean, Error> => {
      if (wishlist?.items) {
        return {
          data: wishlist.items.some(({ product }) => product.id === id),
          error: undefined,
        }
      }

      return { data: undefined, error: new Error('Wishlist is not loaded') }
    },
    [wishlist]
  )

  return { wishlist, isProductInWishlist }
}
