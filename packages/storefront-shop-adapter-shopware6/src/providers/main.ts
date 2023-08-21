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
  AdditionalShopware6Options,
  FetchParameters,
  FetchResponse,
} from '../types'
import { StorefrontShopAdapterShopware6Cart } from './cart'
import { StorefrontShopAdapterShopware6Checkout } from './checkout'
import { StorefrontShopAdapterShopware6Review } from './review'
import { StorefrontShopAdapterShopware6User } from './user'
import { StorefrontShopAdapterShopware6Wishlist } from './wishlist'

export class StorefrontShopAdapterShopware6<
    CartProviderType extends MakairaShopProviderCart = StorefrontShopAdapterShopware6Cart,
    CheckoutProviderType extends MakairaShopProviderCheckout = StorefrontShopAdapterShopware6Checkout,
    UserProviderType extends MakairaShopProviderUser = StorefrontShopAdapterShopware6User,
    WishlistProviderType extends MakairaShopProviderWishlist = StorefrontShopAdapterShopware6Wishlist,
    ReviewProviderType extends MakairaShopProviderReview = StorefrontShopAdapterShopware6Review
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

  additionalOptions: AdditionalShopware6Options

  constructor(
    options: MakairaShopProviderOptions<
      CartProviderType,
      CheckoutProviderType,
      UserProviderType,
      WishlistProviderType,
      ReviewProviderType,
      AdditionalShopware6Options
    >
  ) {
    super()

    const {
      cart: CartProvider = StorefrontShopAdapterShopware6Cart,
      checkout: CheckoutProvider = StorefrontShopAdapterShopware6Checkout,
      user: UserProvider = StorefrontShopAdapterShopware6User,
      wishlist: WishlistProvider = StorefrontShopAdapterShopware6Wishlist,
      review: ReviewProvider = StorefrontShopAdapterShopware6Review,
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
