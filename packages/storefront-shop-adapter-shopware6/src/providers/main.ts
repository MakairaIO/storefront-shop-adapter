import {
  LocalStorageSsrSafe,
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
  ShopwareBaseResponse,
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

  private STORAGE_KEY_CONTEXT_TOKEN = 'makaira-shop-shopware-context-token'

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
      accessToken: options.accessToken,
      storage: options.storage ?? LocalStorageSsrSafe,
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
    method = 'GET',
    path,
    body = {},
  }: FetchParameters): Promise<FetchResponse<Response>> {
    let requestUrl = this.additionalOptions.url

    if (!requestUrl?.endsWith('/') && !path.startsWith('/')) {
      requestUrl += '/'
    }

    requestUrl += path

    const headers = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'sw-access-key': this.additionalOptions.accessToken,
    })

    const contextIds = this.getContextIds()
    if (contextIds) {
      headers.append('sw-context-token', contextIds)
    }

    const options: any = {
      method,
      headers,
    }

    if (method !== 'GET') {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(requestUrl, options)
    const json: ShopwareBaseResponse = await response.json()

    if (json.contextToken) {
      this.setContextIds(json.contextToken, contextIds)
    } else if (json.token) {
      this.setContextIds(json.token, contextIds)
    }

    return {
      response: json as Response,
      status: response.status,
    }
  }

  private getContextIds() {
    return (
      this.additionalOptions.storage?.getItem(this.STORAGE_KEY_CONTEXT_TOKEN) ||
      ''
    )
  }

  private setContextIds(newContextId: string, oldContextIdStr: string) {
    const items = [newContextId]
    const oldIds = oldContextIdStr.split(', ').filter((value) => !!value)
    if (oldIds.includes(newContextId)) {
      this.additionalOptions.storage?.setItem(
        this.STORAGE_KEY_CONTEXT_TOKEN,
        oldIds.join(', ')
      )
    } else {
      items.push(...oldIds)
      this.additionalOptions.storage?.setItem(
        this.STORAGE_KEY_CONTEXT_TOKEN,
        items.join(', ')
      )
    }
  }
}
