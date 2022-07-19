export const USER_LOGIN = '/index.php?cl=MakairaUserController&fnc=login'
export const USER_GET_CURRENT =
  '/index.php?cl=MakairaUserController&fnc=getCurrentLoggedInUser'
export const USER_LOGOUT = '/index.php?cl=MakairaUserController&fnc=logout'

export const CART_GET = '/index.php?cl=MakairaCartController&fnc=getCartItems'
export const CART_ADD =
  '/index.php?cl=MakairaCartController&fnc=addProductToCart'
export const CART_REMOVE =
  '/index.php?cl=MakairaCartController&fnc=removeCartItem'
export const CART_UPDATE =
  '/index.php?cl=MakairaCartController&fnc=updateCartItem'

export const REVIEW_GET = '/index.php?cl=MakairaReviewController&fnc=getReviews'
export const REVIEW_CREATE =
  '/index.php?cl=MakairaReviewController&fnc=createReview'