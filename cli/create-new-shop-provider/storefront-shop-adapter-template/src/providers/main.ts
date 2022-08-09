import {
  MakairaShopProvider,
  MakairaShopProviderCart,
  MakairaShopProviderCheckout,
  MakairaShopProviderOptions,
  MakairaShopProviderReview,
  MakairaShopProviderUser,
  MakairaShopProviderWishlist,
} from '@makaira/storefront-types'
import { StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Cart } from './cart'
import { StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Checkout } from './checkout'
import { StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Review } from './review'
import { StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__User } from './user'
import { StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Wishlist } from './wishlist'

export class StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__<
    CartProviderType extends MakairaShopProviderCart = StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Cart,
    CheckoutProviderType extends MakairaShopProviderCheckout = StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Checkout,
    UserProviderType extends MakairaShopProviderUser = StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__User,
    WishlistProviderType extends MakairaShopProviderWishlist = StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Wishlist,
    ReviewProviderType extends MakairaShopProviderReview = StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Review
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

  constructor(
    options: MakairaShopProviderOptions<
      CartProviderType,
      CheckoutProviderType,
      UserProviderType,
      WishlistProviderType,
      ReviewProviderType
    > = {}
  ) {
    super()

    const {
      cart: CartProvider = StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Cart,
      checkout:
        CheckoutProvider = StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Checkout,
      user: UserProvider = StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__User,
      wishlist:
        WishlistProvider = StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Wishlist,
      review:
        ReviewProvider = StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__Review,
    } = options.providers ?? {}

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
}
