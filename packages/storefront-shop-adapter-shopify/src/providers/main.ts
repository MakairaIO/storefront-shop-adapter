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
import { StorefrontShopAdapterShopifyCart } from './cart'
import { StorefrontShopAdapterShopifyCheckout } from './checkout'
import { StorefrontShopAdapterShopifyUser } from './user'
import { StorefrontShopAdapterShopifyWishlist } from './wishlist'

import fetch from 'isomorphic-unfetch'
import {
  AdditionalShopifyOptions,
  ContextOptions,
  FetchParameters,
  GraphqlResWithError,
} from '../types'
import { StorefrontShopAdapterShopifyReview } from './review'
import { CheckoutFragment, CheckoutUserErrorFragment } from './cart.queries'
import {
  CustomerFragment,
  CustomerUserErrorFragment,
  UserErrorFragment,
} from './user.queries'

export class StorefrontShopAdapterShopify<
    CartProviderType extends MakairaShopProviderCart = StorefrontShopAdapterShopifyCart,
    CheckoutProviderType extends MakairaShopProviderCheckout = StorefrontShopAdapterShopifyCheckout,
    UserProviderType extends MakairaShopProviderUser = StorefrontShopAdapterShopifyUser,
    WishlistProviderType extends MakairaShopProviderWishlist = StorefrontShopAdapterShopifyWishlist,
    ReviewProviderType extends MakairaShopProviderReview = StorefrontShopAdapterShopifyReview
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

  additionalOptions: Required<AdditionalShopifyOptions> & {
    fragments: Required<AdditionalShopifyOptions['fragments']>
  }

  private STORAGE_KEY_CHECKOUT_OPTIONS = 'makaira-shop-shopify-checkout-options'

  constructor(
    options: MakairaShopProviderOptions<
      CartProviderType,
      CheckoutProviderType,
      UserProviderType,
      WishlistProviderType,
      ReviewProviderType,
      AdditionalShopifyOptions
    >
  ) {
    super()

    const {
      cart: CartProvider = StorefrontShopAdapterShopifyCart,
      checkout: CheckoutProvider = StorefrontShopAdapterShopifyCheckout,
      user: UserProvider = StorefrontShopAdapterShopifyUser,
      wishlist: WishlistProvider = StorefrontShopAdapterShopifyWishlist,
      review: ReviewProvider = StorefrontShopAdapterShopifyReview,
    } = options.providers ?? {}

    this.additionalOptions = {
      url: options.url,
      accessToken: options.accessToken,
      storage: options.storage ?? LocalStorageSsrSafe,
      fragments: {
        checkoutFragment:
          options.fragments?.checkoutFragment ?? CheckoutFragment,
        checkoutUserErrorFragment:
          options.fragments?.checkoutUserErrorFragment ??
          CheckoutUserErrorFragment,
        customerFragment:
          options.fragments?.customerFragment ?? CustomerFragment,
        customerUserErrorFragment:
          options.fragments?.customerUserErrorFragment ??
          CustomerUserErrorFragment,
        userErrorFragment:
          options.fragments?.userErrorFragment ?? UserErrorFragment,
      },
      currency: options.currency ?? null,
      contextOptions: options.contextOptions ?? null,
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

  public async fetchFromShop<GraphqlData, GraphqlInputVariables = any>({
    query,
    variables,
  }: FetchParameters<GraphqlInputVariables>): Promise<
    GraphqlResWithError<GraphqlData>
  > {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': this.additionalOptions.accessToken,
    }

    const response = await fetch(this.additionalOptions.url, {
      method: 'POST',
      body: JSON.stringify({ query, variables }),
      headers,
    })

    return response.json()
  }

  // public setCurrency(currency: string | null): void {
  //   this.additionalOptions.currency = currency

  //   if (currency === null) {
  //     this.additionalOptions.storage.removeItem(
  //       this.STORAGE_KEY_CHECKOUT_CURRENCY_ID
  //     )
  //   } else {
  //     this.additionalOptions.storage.setItem(
  //       this.STORAGE_KEY_CHECKOUT_CURRENCY_ID,
  //       currency
  //     )
  //   }
  // }

  // public getCurrency(): string | null {
  //   const storageCurrency = this.additionalOptions.storage.getItem(
  //     this.STORAGE_KEY_CHECKOUT_CURRENCY_ID
  //   )

  //   if (storageCurrency) return storageCurrency

  //   return this.additionalOptions.currency
  // }

  public setContextOptions(options: ContextOptions) {
    this.additionalOptions.contextOptions = options

    if (options === null) {
      this.additionalOptions.storage.removeItem(
        this.STORAGE_KEY_CHECKOUT_OPTIONS
      )
    } else {
      this.additionalOptions.storage.setItem(
        this.STORAGE_KEY_CHECKOUT_OPTIONS,
        JSON.stringify(options)
      )
    }

    // this.cart.createCheckoutAndStoreId()
  }

  public getContextOptions(): ContextOptions {
    const storageContextOptions = this.additionalOptions.storage.getItem(
      this.STORAGE_KEY_CHECKOUT_OPTIONS
    )

    if (!storageContextOptions) return this.additionalOptions.contextOptions

    return JSON.parse(storageContextOptions) as ContextOptions
  }
}
