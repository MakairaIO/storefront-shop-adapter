import { MakairaShopProvider } from '@makaira/storefront-types'

type MergeBy<T, K> = Omit<T, keyof K> & K

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type StorefrontReactCustomClient = MakairaShopProvider

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StorefrontReactCustomTypes {}

export type StorefrontReactTypes = MergeBy<
  {
    cart: Awaited<
      ReturnType<StorefrontReactCustomClient['cart']['getCart']>
    >['data']
    user: Awaited<
      ReturnType<StorefrontReactCustomClient['user']['getUser']>
    >['data']
    wishlist: Awaited<
      ReturnType<StorefrontReactCustomClient['wishlist']['getWishlist']>
    >['data']
  },
  StorefrontReactCustomTypes
>
