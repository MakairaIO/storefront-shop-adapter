import {
  MakairaShopProvider,
  MakairaShopProviderCart,
  MakairaShopProviderCheckout,
  MakairaShopProviderOptions,
  MakairaShopProviderUser,
  MakairaShopProviderWishlist,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterOxidCart } from './cart'
import { StorefrontShopAdapterOxidCheckout } from './checkout'
import { StorefrontShopAdapterOxidUser } from './user'
import { StorefrontShopAdapterOxidWishlist } from './wishlist'

import fetch from 'isomorphic-unfetch'
import { AdditionalOxidOptions, FetchParameters, FetchResponse } from '../types'

export class StorefrontShopAdapterOxid<
    CartProviderType extends MakairaShopProviderCart = StorefrontShopAdapterOxidCart,
    CheckoutProviderType extends MakairaShopProviderCheckout = StorefrontShopAdapterOxidCheckout,
    UserProviderType extends MakairaShopProviderUser = StorefrontShopAdapterOxidUser,
    WishlistProviderType extends MakairaShopProviderWishlist = StorefrontShopAdapterOxidWishlist
  >
  extends EventTarget
  implements
    MakairaShopProvider<
      CartProviderType,
      CheckoutProviderType,
      UserProviderType,
      WishlistProviderType
    >
{
  cart: CartProviderType

  checkout: CheckoutProviderType

  user: UserProviderType

  wishlist: WishlistProviderType

  additionalOptions: AdditionalOxidOptions

  constructor(
    options: MakairaShopProviderOptions<
      CartProviderType,
      CheckoutProviderType,
      UserProviderType,
      WishlistProviderType,
      AdditionalOxidOptions
    >
  ) {
    super()

    const {
      cart: CartProvider = StorefrontShopAdapterOxidCart,
      checkout: CheckoutProvider = StorefrontShopAdapterOxidCheckout,
      user: UserProvider = StorefrontShopAdapterOxidUser,
      wishlist: WishlistProvider = StorefrontShopAdapterOxidWishlist,
    } = options.providers ?? {}

    this.additionalOptions = {
      url: options.url,
    }

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.cart = new CartProvider(this)

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.checkout = new CheckoutProvider(this)

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.user = new UserProvider(this)

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.wishlist = new WishlistProvider(this)
  }

  public async fetchFromShop<Response = any>({
    path,
    body = {},
  }: FetchParameters): Promise<FetchResponse<Response>> {
    let requestUrl = this.additionalOptions.url

    if (!requestUrl?.endsWith('/') && !path.startsWith('/')) {
      requestUrl += '/'
    }

    requestUrl += path

    const response = await fetch(requestUrl, {
      method: 'POST',
      body: JSON.stringify(body),
    })

    return {
      response: await response.json(),
      status: response.status,
    }
  }
}
