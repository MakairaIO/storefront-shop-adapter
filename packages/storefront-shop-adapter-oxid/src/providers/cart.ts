import {
  MakairaAddItemToCart,
  MakairaGetCart,
  MakairaRemoveItemFromCart,
  MakairaShopProviderCart,
  MakairaUpdateItemFromCart,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterOxid } from './main'
import { CART_GET } from '../paths'

type OxidProduct = {
  cart_item_id: string
  name: string
  price: number
  base_price: string
  quantity: number
  image_path: string
}

export class StorefrontShopAdapterOxidCart implements MakairaShopProviderCart {
  constructor(private mainAdapter: StorefrontShopAdapterOxid) {}

  getCart: MakairaGetCart<unknown, unknown, Error> = async () => {
    try {
      const { response, status } = await this.mainAdapter.fetchFromShop({
        path: CART_GET,
      })

      if (status !== 200) {
        return {
          data: { items: [], raw: undefined },
          error: new Error(
            response.message ?? 'API responded with status != 200'
          ),
        }
      }

      const items = response.map((item: OxidProduct) => ({
        quantity: item.quantity,
        ean: item.cart_item_id,
        price: item.price,
        name: item.name,
      }))

      return { data: { items, raw: response }, error: undefined }
    } catch (e) {
      return { data: { items: [], raw: undefined }, error: e as Error }
    }
  }

  addItem: MakairaAddItemToCart<unknown, unknown, Error> = async ({
    input: { product, quantity },
  }) => {
    return { data: { items: [], raw: undefined }, error: undefined }
  }

  removeItem: MakairaRemoveItemFromCart<unknown, unknown, Error> = async ({
    input: { product },
  }) => {
    return { data: { items: [], raw: undefined }, error: undefined }
  }

  updateItem: MakairaUpdateItemFromCart<unknown, unknown, Error> = async ({
    input: { product, quantity },
  }) => {
    return { data: { items: [], raw: undefined }, error: undefined }
  }
}
