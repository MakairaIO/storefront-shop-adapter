import {
  LocalStorageSsrSafe,
  MakairaAddItemToWishlist,
  MakairaGetWishlist,
  MakairaRemoveItemFromWishlist,
  MakairaShopProviderWishlist,
  WishlistAddItemEvent,
  WishlistRemoveItemEvent,
} from '@makaira/storefront-types'
import {
  LocalGetWishlistRaw,
  LocalWishlistAddItemRaw,
  LocalWishlistRemoveItemRaw,
  WishlistStoreVersioned,
} from '../types'
import { StorefrontShopAdapterLocal } from './main'

export class StorefrontShopAdapterLocalWishlist
  implements MakairaShopProviderWishlist
{
  LOCAL_STORAGE_STORE = 'makaira-shop-local-wishlist'

  constructor(private mainAdapter: StorefrontShopAdapterLocal) {}

  getWishlist: MakairaGetWishlist<unknown, LocalGetWishlistRaw, Error> =
    async () => {
      const wishlistStore = this.getStore()

      return {
        data: { items: wishlistStore.items },
        raw: { store: wishlistStore },
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
    LocalWishlistAddItemRaw,
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

    return { data, raw: { store: wishlistStore }, error: undefined }
  }

  removeItem: MakairaRemoveItemFromWishlist<
    unknown,
    LocalWishlistRemoveItemRaw,
    Error
  > = async ({ input: { product } }) => {
    const wishlistStore = this.getStore()

    const itemExistsIndex = wishlistStore.items.findIndex(
      (item) => item.product.id === product.id
    )

    if (itemExistsIndex === -1) {
      return {
        data: undefined,
        raw: { store: wishlistStore },
        error: new Error('product not found in wishlist'),
      }
    }

    wishlistStore.items.splice(itemExistsIndex, 1)

    this.setStore(wishlistStore)

    const data = { items: wishlistStore.items }

    this.mainAdapter.dispatchEvent(
      new WishlistRemoveItemEvent<WishlistStoreVersioned>(data, wishlistStore)
    )

    return { data, raw: { store: wishlistStore }, error: undefined }
  }

  private getStore(): WishlistStoreVersioned {
    const rawStore = LocalStorageSsrSafe.getItem(this.LOCAL_STORAGE_STORE)

    if (!rawStore) {
      return { version: 'v1', items: [] }
    }

    return JSON.parse(rawStore) as WishlistStoreVersioned
  }

  private async setStore(store: WishlistStoreVersioned) {
    LocalStorageSsrSafe.setItem(this.LOCAL_STORAGE_STORE, JSON.stringify(store))
  }
}
