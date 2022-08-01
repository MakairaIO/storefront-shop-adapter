import { Constructor } from '../general'
import { MakairaShopProviderCart } from './cart'
import { MakairaShopProviderCheckout } from './checkout'
import { MakairaShopProviderReview } from './review'
import { MakairaShopProviderUser } from './user'
import { MakairaShopProviderWishlist } from './wishlist'

export type MakairaShopProviderOptions<
  CartProviderType = MakairaShopProviderCart,
  CheckoutProviderType = MakairaShopProviderCheckout,
  UserProviderType = MakairaShopProviderUser,
  WishlistProviderType = MakairaShopProviderWishlist,
  ReviewProviderType = MakairaShopProviderReview,
  AdditionalOptions = unknown
> = {
  providers?: {
    cart?: Constructor<CartProviderType>
    checkout?: Constructor<CheckoutProviderType>
    user?: Constructor<UserProviderType>
    wishlist?: Constructor<WishlistProviderType>
    review?: Constructor<ReviewProviderType>
  }
} & AdditionalOptions

export interface MakairaShopProvider<
  CartProviderType extends MakairaShopProviderCart = MakairaShopProviderCart,
  CheckoutProviderType extends MakairaShopProviderCheckout = MakairaShopProviderCheckout,
  UserProviderType extends MakairaShopProviderUser = MakairaShopProviderUser,
  WishlistProviderType extends MakairaShopProviderWishlist = MakairaShopProviderWishlist,
  ReviewProviderType extends MakairaShopProviderReview = MakairaShopProviderReview
> extends EventTarget {
  cart: CartProviderType

  checkout: CheckoutProviderType

  user: UserProviderType

  wishlist: WishlistProviderType

  review: ReviewProviderType
}
