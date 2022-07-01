import { useContext } from 'react'
import { ShopContext } from '../context'

export function useShopUser() {
  const { user } = useContext(ShopContext)

  return { user }
}
