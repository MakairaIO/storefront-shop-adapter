import {
  MakairaShopProvider,
  MakairaShopProviderCart,
  MakairaShopProviderCheckout,
  MakairaShopProviderOptions,
  MakairaShopProviderUser,
  MakairaShopProviderWishlist,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterPlentymarketCart } from './cart'
import { StorefrontShopAdapterPlentymarketCheckout } from './checkout'
import { StorefrontShopAdapterPlentymarketUser } from './user'
import { StorefrontShopAdapterPlentymarketWishlist } from './wishlist'

export class StorefrontShopAdapterPlentymarket<
    CartProviderType extends MakairaShopProviderCart = StorefrontShopAdapterPlentymarketCart,
    CheckoutProviderType extends MakairaShopProviderCheckout = StorefrontShopAdapterPlentymarketCheckout,
    UserProviderType extends MakairaShopProviderUser = StorefrontShopAdapterPlentymarketUser,
    WishlistProviderType extends MakairaShopProviderWishlist = StorefrontShopAdapterPlentymarketWishlist
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

  constructor(
    options: MakairaShopProviderOptions<
      CartProviderType,
      CheckoutProviderType,
      UserProviderType,
      WishlistProviderType
    > = {}
  ) {
    super()

    const {
      cart: CartProvider = StorefrontShopAdapterPlentymarketCart,
      checkout: CheckoutProvider = StorefrontShopAdapterPlentymarketCheckout,
      user: UserProvider = StorefrontShopAdapterPlentymarketUser,
      wishlist: WishlistProvider = StorefrontShopAdapterPlentymarketWishlist,
    } = options.providers ?? {}

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.cart = new CartProvider(this)

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.checkout = new CheckoutProvider(this)

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.user = new UserProvider(this)

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.wishlist = new WishlistProvider(this)
  }
}
