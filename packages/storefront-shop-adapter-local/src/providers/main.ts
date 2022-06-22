import {
  MakairaShopProvider,
  MakairaShopProviderCart,
  MakairaShopProviderCheckout,
  MakairaShopProviderOptions,
  MakairaShopProviderUser,
  MakairaShopProviderWishlist,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterLocalCart } from './cart'
import { StorefrontShopAdapterLocalCheckout } from './checkout'
import { StorefrontShopAdapterLocalUser } from './user'
import { StorefrontShopAdapterLocalWishlist } from './wishlist'

export class StorefrontShopAdapterLocal<
    CartProviderType extends MakairaShopProviderCart = StorefrontShopAdapterLocalCart,
    CheckoutProviderType extends MakairaShopProviderCheckout = StorefrontShopAdapterLocalCheckout,
    UserProviderType extends MakairaShopProviderUser = StorefrontShopAdapterLocalUser,
    WishlistProviderType extends MakairaShopProviderWishlist = StorefrontShopAdapterLocalWishlist
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
      cart: CartProvider = StorefrontShopAdapterLocalCart,
      checkout: CheckoutProvider = StorefrontShopAdapterLocalCheckout,
      user: UserProvider = StorefrontShopAdapterLocalUser,
      wishlist: WishlistProvider = StorefrontShopAdapterLocalWishlist,
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
