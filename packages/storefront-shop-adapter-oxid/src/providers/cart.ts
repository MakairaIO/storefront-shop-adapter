import {
  MakairaAddItemToCart,
  MakairaGetCart,
  MakairaRemoveItemFromCart,
  MakairaShopProviderCart,
  MakairaUpdateItemFromCart,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterOxid } from './main'

export class StorefrontShopAdapterOxidCart implements MakairaShopProviderCart {
  constructor(private mainAdapter: StorefrontShopAdapterOxid) {}

  getCart: MakairaGetCart<unknown, unknown, Error> = async () => {
    return { data: { items: [], raw: undefined }, error: undefined }
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
