import { useContext } from 'react'
import { ShopContext, ShopContextData } from '../context'

export type UseShopWishlistData = {
  /**
   * The current wishlist with the products
   */
  wishlist: ShopContextData['wishlist']
}

export function useShopWishlist(): UseShopWishlistData {
  const { wishlist } = useContext(ShopContext)

  return { wishlist }
}
