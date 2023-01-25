import {
  MakairaShopProvider,
  MakairaShopProviderCart,
  MakairaShopProviderCheckout,
  MakairaShopProviderOptions,
  MakairaShopProviderReview,
  MakairaShopProviderUser,
  MakairaShopProviderWishlist,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterOxidCart } from './cart'
import { StorefrontShopAdapterOxidCheckout } from './checkout'
import { StorefrontShopAdapterOxidUser } from './user'
import { StorefrontShopAdapterOxidWishlist } from './wishlist'

import fetch from 'isomorphic-unfetch'
import {
  AdditionalOxidOptions,
  FetchParameters,
  FetchResponse,
  OxidPaths,
} from '../types'
import { StorefrontShopAdapterOxidReview } from './review'
import { PATHS } from '../paths'

export class StorefrontShopAdapterOxid<
    CartProviderType extends MakairaShopProviderCart = StorefrontShopAdapterOxidCart,
    CheckoutProviderType extends MakairaShopProviderCheckout = StorefrontShopAdapterOxidCheckout,
    UserProviderType extends MakairaShopProviderUser = StorefrontShopAdapterOxidUser,
    WishlistProviderType extends MakairaShopProviderWishlist = StorefrontShopAdapterOxidWishlist,
    ReviewProviderType extends MakairaShopProviderReview = StorefrontShopAdapterOxidReview
  >
  extends EventTarget
  implements
    MakairaShopProvider<
      CartProviderType,
      CheckoutProviderType,
      UserProviderType,
      WishlistProviderType,
      ReviewProviderType
    >
{
  cart: CartProviderType

  checkout: CheckoutProviderType

  user: UserProviderType

  wishlist: WishlistProviderType

  review: ReviewProviderType

  additionalOptions: AdditionalOxidOptions

  paths: OxidPaths

  constructor(
    options: MakairaShopProviderOptions<
      CartProviderType,
      CheckoutProviderType,
      UserProviderType,
      WishlistProviderType,
      ReviewProviderType,
      AdditionalOxidOptions
    >
  ) {
    super()

    const {
      cart: CartProvider = StorefrontShopAdapterOxidCart,
      checkout: CheckoutProvider = StorefrontShopAdapterOxidCheckout,
      user: UserProvider = StorefrontShopAdapterOxidUser,
      wishlist: WishlistProvider = StorefrontShopAdapterOxidWishlist,
      review: ReviewProvider = StorefrontShopAdapterOxidReview,
    } = options.providers ?? {}

    this.additionalOptions = {
      url: options.url,
      customPaths: options.customPaths,
    }

    this.paths = {
      ...PATHS,
      ...this.additionalOptions.customPaths,
    }

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.cart = new CartProvider(this)

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.checkout = new CheckoutProvider(this)

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.user = new UserProvider(this)

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.wishlist = new WishlistProvider(this)

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.review = new ReviewProvider(this)
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
