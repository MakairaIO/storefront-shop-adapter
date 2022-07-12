import { MakairaShopProvider } from '@makaira/storefront-types'

type MergeBy<T, K> = Omit<T, keyof K> & K

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StorefrontReactCustomClient {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StorefrontReactCustomTypes {}

export type StorefrontReactClient = MergeBy<
  { client: MakairaShopProvider },
  StorefrontReactCustomClient
>

export type StorefrontReactTypes = MergeBy<
  {
    cart: Awaited<
      ReturnType<StorefrontReactClient['client']['cart']['getCart']>
    >['data']
    user: Awaited<
      ReturnType<StorefrontReactClient['client']['user']['getUser']>
    >['data']
    wishlist: Awaited<
      ReturnType<StorefrontReactClient['client']['wishlist']['getWishlist']>
    >['data']
  },
  StorefrontReactCustomTypes
>
