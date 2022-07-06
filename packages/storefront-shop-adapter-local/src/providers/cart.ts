import {
  MakairaAddItemToCart,
  MakairaGetCart,
  MakairaRemoveItemFromCart,
  MakairaShopProviderCart,
  MakairaUpdateItemFromCart,
  MakairaProduct,
  CartAddItemEvent,
  MakairaAddItemToCartResData,
  CartRemoveItemEvent,
  MakairaRemoveItemFromCartResData,
  MakairaUpdateItemFromCartResData,
  CartUpdateItemEvent,
} from '@makaira/storefront-types'
import { ShopAdapterLocalStorageVersioned } from '../types'
import { StorefrontShopAdapterLocal } from './main'

type CartStore = {
  items: Array<{ product: MakairaProduct; quantity: number }>
}

type CartStoreVersioned = ShopAdapterLocalStorageVersioned<'v1', CartStore>

export class StorefrontShopAdapterLocalCart implements MakairaShopProviderCart {
  LOCAL_STORAGE_STORE = 'makaira-shop-local-cart'

  constructor(private mainAdapter: StorefrontShopAdapterLocal) {}

  getCart: MakairaGetCart<unknown, CartStoreVersioned, Error> = async () => {
    const cart = this.getStore()

    return { data: { items: cart.items, raw: cart }, error: undefined }
  }

  addItem: MakairaAddItemToCart<
    {
      title: string
      url: string
      price: string
      images: string[]
      attributes: []
    },
    CartStoreVersioned,
    Error
  > = async ({ input: { product, quantity, images, price, title, url } }) => {
    const cart = this.getStore()

    const itemExistsIndex = cart.items.findIndex(
      (item) => item.product.id === product.id
    )

    if (itemExistsIndex > -1) {
      cart.items[itemExistsIndex].quantity += quantity
    } else {
      cart.items.push({
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

    this.setStore(cart)

    const data = { items: cart.items, raw: cart }

    this.mainAdapter.dispatchEvent(
      new CartAddItemEvent<MakairaAddItemToCartResData<CartStoreVersioned>>(
        data
      )
    )

    return { data, error: undefined }
  }

  removeItem: MakairaRemoveItemFromCart<unknown, CartStoreVersioned, Error> =
    async ({ input: { product } }) => {
      const cart = this.getStore()

      const itemExistsIndex = cart.items.findIndex(
        (item) => item.product.id === product.id
      )

      if (itemExistsIndex > -1) {
        return {
          data: undefined,
          error: new Error('product not found in cart'),
        }
      }

      cart.items.splice(itemExistsIndex, 1)

      this.setStore(cart)

      const data = { items: cart.items, raw: cart }

      this.mainAdapter.dispatchEvent(
        new CartRemoveItemEvent<
          MakairaRemoveItemFromCartResData<CartStoreVersioned>
        >(data)
      )

      return { data, error: undefined }
    }

  updateItem: MakairaUpdateItemFromCart<unknown, CartStoreVersioned, Error> =
    async ({ input: { product, quantity } }) => {
      const cart = this.getStore()

      const itemExistsIndex = cart.items.findIndex(
        (item) => item.product.id === product.id
      )

      if (itemExistsIndex > -1) {
        return {
          data: undefined,
          error: new Error('product not found in cart'),
        }
      }

      cart.items[itemExistsIndex].quantity = quantity

      this.setStore(cart)

      const data = { items: cart.items, raw: cart }

      this.mainAdapter.dispatchEvent(
        new CartUpdateItemEvent<
          MakairaUpdateItemFromCartResData<CartStoreVersioned>
        >(data)
      )

      return { data: { items: cart.items, raw: cart }, error: undefined }
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
