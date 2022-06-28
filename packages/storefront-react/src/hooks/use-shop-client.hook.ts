import { useContext } from 'react'
import { ShopContext } from '../context'

export function useShopClient() {
  const { client } = useContext(ShopContext)

  return { client }
}
