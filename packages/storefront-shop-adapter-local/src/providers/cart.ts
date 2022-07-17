import {
  MakairaAddItemToCart,
  MakairaGetCart,
  MakairaRemoveItemFromCart,
  MakairaShopProviderCart,
  MakairaUpdateItemFromCart,
  CartAddItemEvent,
  CartRemoveItemEvent,
  CartUpdateItemEvent,
} from '@makaira/storefront-types'
import {
  CartStoreVersioned,
  LocalAddItemRaw,
  LocalGetCartRaw,
  LocalRemoveItemRaw,
  LocalUpdateItemRaw,
} from '../types'
import { StorefrontShopAdapterLocal } from './main'

export class StorefrontShopAdapterLocalCart implements MakairaShopProviderCart {
  LOCAL_STORAGE_STORE = 'makaira-shop-local-cart'

  constructor(private mainAdapter: StorefrontShopAdapterLocal) {}

  getCart: MakairaGetCart<unknown, LocalGetCartRaw, Error> = async () => {
    const cartStore = this.getStore()

    return {
      data: { items: cartStore.items },
      raw: { store: cartStore },
      error: undefined,
    }
  }

  addItem: MakairaAddItemToCart<
    {
      title: string
      url: string
      price: number
      images: string[]
    },
    LocalAddItemRaw,
    Error
  > = async ({ input: { product, quantity, images, price, title, url } }) => {
    const cartStore = this.getStore()

    const itemExistsIndex = cartStore.items.findIndex(
      (item) => item.product.id === product.id
    )

    if (itemExistsIndex > -1) {
      cartStore.items[itemExistsIndex].quantity += quantity
    } else {
      cartStore.items.push({
        product: {
          id: product.id,
          attributes: product.attributes,
          images,
          price,
          title,
          url,
        },
        quantity,
      })
    }

    this.setStore(cartStore)

    const data = { items: cartStore.items }
    const raw: LocalAddItemRaw = { store: cartStore }

    this.mainAdapter.dispatchEvent(
      new CartAddItemEvent<LocalAddItemRaw>(data, raw)
    )

    return { data, raw, error: undefined }
  }

  removeItem: MakairaRemoveItemFromCart<unknown, LocalRemoveItemRaw, Error> =
    async ({ input: { product } }) => {
      const cartStore = this.getStore()

      const itemExistsIndex = cartStore.items.findIndex(
        (item) => item.product.id === product.id
      )

      if (itemExistsIndex === -1) {
        return {
          data: undefined,
          error: new Error('product not found in cart'),
        }
      }

      cartStore.items.splice(itemExistsIndex, 1)

      this.setStore(cartStore)

      const data = { items: cartStore.items }
      const raw: LocalRemoveItemRaw = { store: cartStore }

      this.mainAdapter.dispatchEvent(
        new CartRemoveItemEvent<LocalRemoveItemRaw>(data, raw)
      )

      return { data, raw, error: undefined }
    }

  updateItem: MakairaUpdateItemFromCart<unknown, LocalUpdateItemRaw, Error> =
    async ({ input: { product, quantity } }) => {
      const cartStore = this.getStore()

      const itemExistsIndex = cartStore.items.findIndex(
        (item) => item.product.id === product.id
      )

      if (itemExistsIndex === -1) {
        return {
          data: undefined,
          error: new Error('product not found in cart'),
        }
      }

      cartStore.items[itemExistsIndex].quantity = quantity

      this.setStore(cartStore)

      const data = { items: cartStore.items }
      const raw: LocalUpdateItemRaw = { store: cartStore }

      this.mainAdapter.dispatchEvent(
        new CartUpdateItemEvent<LocalUpdateItemRaw>(data, raw)
      )

      return { data, raw, error: undefined }
    }

  private getStore(): CartStoreVersioned {
    const rawStore = localStorage.getItem(this.LOCAL_STORAGE_STORE)

    if (!rawStore) {
      return { version: 'v1', items: [] }
    }

    return JSON.parse(rawStore) as CartStoreVersioned
  }

  private async setStore(store: CartStoreVersioned) {
    localStorage.setItem(this.LOCAL_STORAGE_STORE, JSON.stringify(store))
  }
}
