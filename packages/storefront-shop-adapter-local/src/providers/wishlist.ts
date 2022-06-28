import {
  MakairaGetWishlist,
  MakairaProduct,
  MakairaShopProviderWishlist,
} from '@makaira/storefront-types'
import { ShopAdapterLocalStorageVersioned } from '../types'
import { StorefrontShopAdapterLocal } from './main'

type WishlistStore = {
  items: Array<{ product: MakairaProduct; quantity: number }>
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
      data: { items: wishlistStore.items, raw: wishlistStore },
      error: undefined,
    }
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
