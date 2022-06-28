import { useContext } from 'react'
import { ShopContext } from '../context'

export function useShopCart() {
  const { cart } = useContext(ShopContext)

  return { cart }
}
