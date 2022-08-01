import {
  MakairaAddItemToWishlist,
  MakairaGetWishlist,
  MakairaProduct,
  MakairaRemoveItemFromWishlist,
  MakairaShopProviderWishlist,
  WishlistAddItemEvent,
  WishlistRemoveItemEvent,
} from '@makaira/storefront-types'
import { ShopAdapterLocalStorageVersioned } from '../types'
import { StorefrontShopAdapterLocal } from './main'

type WishlistStore = {
  items: Array<{ product: MakairaProduct }>
}

type WishlistStoreVersioned = ShopAdapterLocalStorageVersioned<
  'v1',
  WishlistStore
>

export class StorefrontShopAdapterLocalWishlist
  implements MakairaShopProviderWishlist
{
  LOCAL_STORAGE_STORE = 'makaira-shop-local-wishlist'

  constructor(private mainAdapter: StorefrontShopAdapterLocal) {}

  getWishlist: MakairaGetWishlist<unknown, WishlistStore, Error> = async () => {
    const wishlistStore = this.getStore()

    return {
      data: { items: wishlistStore.items },
      raw: wishlistStore,
      error: undefined,
    }
  }

  addItem: MakairaAddItemToWishlist<
    {
      title: string
      url: string
      price: number
      images: string[]
    },
    WishlistStoreVersioned,
    Error
  > = async ({ input: { product, images, price, title, url } }) => {
    const wishlistStore = this.getStore()

    const itemExistsIndex = wishlistStore.items.findIndex(
      (item) => item.product.id === product.id
    )

    if (itemExistsIndex === -1) {
      wishlistStore.items.push({
        product: {
          id: product.id,
          attributes: product.attributes,
          images,
          price,
          title,
          url,
        },
      })
    }

    this.setStore(wishlistStore)

    const data = { items: wishlistStore.items }

    this.mainAdapter.dispatchEvent(
      new WishlistAddItemEvent<WishlistStoreVersioned>(data, wishlistStore)
    )

    return { data, raw: wishlistStore, error: undefined }
  }

  removeItem: MakairaRemoveItemFromWishlist<
    unknown,
    WishlistStoreVersioned,
    Error
  > = async ({ input: { product } }) => {
    const wishlistStore = this.getStore()

    const itemExistsIndex = wishlistStore.items.findIndex(
      (item) => item.product.id === product.id
    )

    if (itemExistsIndex === -1) {
      return {
        data: undefined,
        error: new Error('product not found in wishlist'),
      }
    }

    wishlistStore.items.splice(itemExistsIndex, 1)

    this.setStore(wishlistStore)

    const data = { items: wishlistStore.items }

    this.mainAdapter.dispatchEvent(
      new WishlistRemoveItemEvent<WishlistStoreVersioned>(data, wishlistStore)
    )

    return { data, raw: wishlistStore, error: undefined }
  }

  private getStore(): WishlistStoreVersioned {
    const rawStore = localStorage.getItem(this.LOCAL_STORAGE_STORE)

    if (!rawStore) {
      return { version: 'v1', items: [] }
    }

    return JSON.parse(rawStore) as WishlistStoreVersioned
  }

  private async setStore(store: WishlistStoreVersioned) {
    localStorage.setItem(this.LOCAL_STORAGE_STORE, JSON.stringify(store))
  }
}
