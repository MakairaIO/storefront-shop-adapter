import {
  MakairaShopProvider,
  MakairaShopProviderCart,
  MakairaShopProviderCheckout,
  MakairaShopProviderOptions,
  MakairaShopProviderReview,
  MakairaShopProviderUser,
  MakairaShopProviderWishlist,
} from '@makaira/storefront-types'
import fetch from 'isomorphic-unfetch'
import {
  AdditionalShopware5Options,
  FetchParameters,
  FetchResponse,
} from '../types'
import { StorefrontShopAdapterShopware5Cart } from './cart'
import { StorefrontShopAdapterShopware5Checkout } from './checkout'
import { StorefrontShopAdapterShopware5Review } from './review'
import { StorefrontShopAdapterShopware5User } from './user'
import { StorefrontShopAdapterShopware5Wishlist } from './wishlist'

export class StorefrontShopAdapterShopware5<
    CartProviderType extends MakairaShopProviderCart = StorefrontShopAdapterShopware5Cart,
    CheckoutProviderType extends MakairaShopProviderCheckout = StorefrontShopAdapterShopware5Checkout,
    UserProviderType extends MakairaShopProviderUser = StorefrontShopAdapterShopware5User,
    WishlistProviderType extends MakairaShopProviderWishlist = StorefrontShopAdapterShopware5Wishlist,
    ReviewProviderType extends MakairaShopProviderReview = StorefrontShopAdapterShopware5Review
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

  additionalOptions: AdditionalShopware5Options

  constructor(
    options: MakairaShopProviderOptions<
      CartProviderType,
      CheckoutProviderType,
      UserProviderType,
      WishlistProviderType,
      ReviewProviderType,
      AdditionalShopware5Options
    >
  ) {
    super()

    const {
      cart: CartProvider = StorefrontShopAdapterShopware5Cart,
      checkout: CheckoutProvider = StorefrontShopAdapterShopware5Checkout,
      user: UserProvider = StorefrontShopAdapterShopware5User,
      wishlist: WishlistProvider = StorefrontShopAdapterShopware5Wishlist,
      review: ReviewProvider = StorefrontShopAdapterShopware5Review,
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

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.review = new ReviewProvider(this)
  }

  public async fetchFromShop<Response = any>({
    path,
    action,
    body = {},
  }: FetchParameters): Promise<FetchResponse<Response>> {
    let requestUrl = this.additionalOptions.url

    if (!requestUrl?.endsWith('/') && !path.startsWith('/')) {
      requestUrl += '/'
    }

    requestUrl += path

    const response = await fetch(requestUrl, {
      method: 'POST',
      body: JSON.stringify({ action, ...body }),
    })

    return {
      response: await response.json(),
      status: response.status,
    }
  }
}
