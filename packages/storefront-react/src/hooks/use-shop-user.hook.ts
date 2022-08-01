import { useContext } from 'react'
import { ShopContext, ShopContextData } from '../context'

export type UseShopUserData = {
  /**
   * The current user. Is undefined when no user is
   * logged in or when reloading the user fails.
   */
  user: ShopContextData['user']
}

export function useShopUser(): UseShopUserData {
  const { user } = useContext(ShopContext)

  return { user }
}
