import {
  MakairaShopProvider,
  MakairaShopProviderCart,
  MakairaShopProviderCheckout,
  MakairaShopProviderOptions,
  MakairaShopProviderReview,
  MakairaShopProviderUser,
  MakairaShopProviderWishlist,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterPlentymarketsCart } from './cart'
import { StorefrontShopAdapterPlentymarketsCheckout } from './checkout'
import { StorefrontShopAdapterPlentymarketsUser } from './user'
import { StorefrontShopAdapterPlentymarketsWishlist } from './wishlist'
import { StorefrontShopAdapterPlentymarketsReview } from './review'
import {
  AdditionalPlentymarketsOptions,
  FetchParameters,
  FetchResponse,
} from '../types'

export class StorefrontShopAdapterPlentymarkets<
    CartProviderType extends MakairaShopProviderCart = StorefrontShopAdapterPlentymarketsCart,
    CheckoutProviderType extends MakairaShopProviderCheckout = StorefrontShopAdapterPlentymarketsCheckout,
    UserProviderType extends MakairaShopProviderUser = StorefrontShopAdapterPlentymarketsUser,
    WishlistProviderType extends MakairaShopProviderWishlist = StorefrontShopAdapterPlentymarketsWishlist,
    ReviewProviderType extends MakairaShopProviderReview = StorefrontShopAdapterPlentymarketsReview
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

  review: ReviewProviderType

  additionalOptions: AdditionalPlentymarketsOptions

  constructor(
    options: MakairaShopProviderOptions<
      CartProviderType,
      CheckoutProviderType,
      UserProviderType,
      WishlistProviderType,
      ReviewProviderType,
      AdditionalPlentymarketsOptions
    >
  ) {
    super()

    const {
      cart: CartProvider = StorefrontShopAdapterPlentymarketsCart,
      checkout: CheckoutProvider = StorefrontShopAdapterPlentymarketsCheckout,
      user: UserProvider = StorefrontShopAdapterPlentymarketsUser,
      wishlist: WishlistProvider = StorefrontShopAdapterPlentymarketsWishlist,
      review: ReviewProvider = StorefrontShopAdapterPlentymarketsReview,
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
    body = {},
    method = 'POST',
  }: FetchParameters): Promise<FetchResponse<Response>> {
    let requestUrl = this.additionalOptions.url

    if (!requestUrl?.endsWith('/') && !path.startsWith('/')) {
      requestUrl += '/'
    }

    requestUrl += path

    const options: {
      method: string
      body?: string
      headers: { 'Content-Type': string }
    } = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (method === 'POST' || method === 'PUT') {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(requestUrl, options)

    return {
      response: await response.json(),
      status: response.status,
    }
  }
}
