import { useContext } from 'react'
import { ShopContext, ShopContextData } from '../context'

export type UseShopClientData = {
  /**
   * The current client passed to the ShopProvider.
   */
  client: ShopContextData['client']
}

export function useShopClient(): UseShopClientData {
  const { client } = useContext(ShopContext)

  return { client }
}
