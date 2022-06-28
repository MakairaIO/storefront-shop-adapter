import { useContext } from 'react'
import { ShopContext } from '../context'

export function useShopWishlist() {
  const { wishlist } = useContext(ShopContext)

  return { wishlist }
}
