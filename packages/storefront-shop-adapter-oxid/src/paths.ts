import { OxidPaths } from './types'

export const PATHS: OxidPaths = {
  USER_LOGIN: '/index.php?cl=MakairaUserController&fnc=login',
  USER_GET_CURRENT:
    '/index.php?cl=MakairaUserController&fnc=getCurrentLoggedInUser',
  USER_LOGOUT: '/index.php?cl=MakairaUserController&fnc=logout',
  CART_GET: '/index.php?cl=MakairaCartController&fnc=getCartItems',
  CART_ADD: '/index.php?cl=MakairaCartController&fnc=addProductToCart',
  CART_REMOVE: '/index.php?cl=MakairaCartController&fnc=removeCartItem',
  CART_UPDATE: '/index.php?cl=MakairaCartController&fnc=updateCartItem',
  REVIEW_GET: '/index.php?cl=MakairaReviewController&fnc=getReviews',
  REVIEW_CREATE: '/index.php?cl=MakairaReviewController&fnc=createReview',
}
