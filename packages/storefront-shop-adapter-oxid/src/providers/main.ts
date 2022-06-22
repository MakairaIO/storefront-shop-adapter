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
      cart: CartProvider = StorefrontShopAdapterOxidCart,
      checkout: CheckoutProvider = StorefrontShopAdapterOxidCheckout,
      user: UserProvider = StorefrontShopAdapterOxidUser,
      wishlist: WishlistProvider = StorefrontShopAdapterOxidWishlist,
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
