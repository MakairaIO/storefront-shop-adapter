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
    rawCart: Awaited<
      ReturnType<StorefrontReactClient['client']['cart']['getCart']>
    >['raw']
    user: Awaited<
      ReturnType<StorefrontReactClient['client']['user']['getUser']>
    >['data']
    rawUser: Awaited<
      ReturnType<StorefrontReactClient['client']['user']['getUser']>
    >['raw']
    wishlist: Awaited<
      ReturnType<StorefrontReactClient['client']['wishlist']['getWishlist']>
    >['data']
    rawWishlist: Awaited<
      ReturnType<StorefrontReactClient['client']['wishlist']['getWishlist']>
    >['raw']
  },
  StorefrontReactCustomTypes
>
