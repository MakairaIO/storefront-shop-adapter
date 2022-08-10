import { useContext } from 'react'
import { ShopContext, ShopContextData } from '../context'

export type UseShopUserData = {
  /**
   * The current user. Is undefined when no user is
   * logged in or when reloading the user fails.
   */
  user: ShopContextData['user']
  /**
   * The current raw user.
   */
  rawUser: ShopContextData['rawUser']
}

export function useShopUser(): UseShopUserData {
  const { user, rawUser } = useContext(ShopContext)

  return { user, rawUser }
}
