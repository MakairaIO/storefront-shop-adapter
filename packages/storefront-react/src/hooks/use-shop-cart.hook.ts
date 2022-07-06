import { useContext } from 'react'
import { ShopContext, ShopContextData } from '../context'

export type UseShopCartData = {
  /**
   * The current cart with the products.
   */
  cart: ShopContextData['cart']
  /**
   * The current amount of products in the cart.
   * It counts the number of unique products but not
   * their quantity in the cart.
   *
   * When in the cart product A and product B with each
   * have a quantity set to 3 is, productsInCart will 2.
   */
  productsInCart: number
  /**
   * The current total amount of products with their
   * quantity.
   *
   * When in the cart product A and product B with each
   * have a quantity set to 3 is, quantityInCart will 6.
   */
  quantityInCart: number
}

export function useShopCart(): UseShopCartData {
  const { cart } = useContext(ShopContext)

  const productsInCart = cart?.items.length ?? 0

  const quantityInCart =
    cart?.items.reduce((quantity, product) => quantity + product.quantity, 0) ??
    0

  return { cart, productsInCart, quantityInCart }
}
