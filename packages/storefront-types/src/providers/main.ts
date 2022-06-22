import { Constructor } from '../general'
import { MakairaShopProviderCart } from './cart'
import { MakairaShopProviderCheckout } from './checkout'
import { MakairaShopProviderUser } from './user'
import { MakairaShopProviderWishlist } from './wishlist'

export type MakairaShopProviderOptions<
  CartProviderType = MakairaShopProviderCart,
  CheckoutProviderType = MakairaShopProviderCheckout,
  UserProviderType = MakairaShopProviderUser,
  WishlistProviderType = MakairaShopProviderWishlist,
  AdditionalOptions = unknown
> = {
  providers?: {
    cart?: Constructor<CartProviderType>
    checkout?: Constructor<CheckoutProviderType>
    user?: Constructor<UserProviderType>
    wishlist?: Constructor<WishlistProviderType>
  }
} & AdditionalOptions

export interface MakairaShopProvider<
  CartProviderType extends MakairaShopProviderCart,
  CheckoutProviderType extends MakairaShopProviderCheckout,
  UserProviderType extends MakairaShopProviderUser,
  WishlistProviderType extends MakairaShopProviderWishlist
> {
  cart: CartProviderType

  checkout: CheckoutProviderType

  user: UserProviderType

  wishlist: WishlistProviderType
}
