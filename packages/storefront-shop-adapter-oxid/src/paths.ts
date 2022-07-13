const USER_LOGIN = '/index.php?cl=MakairaUserController&fnc=login'
const USER_GET_CURRENT =
  '/index.php?cl=MakairaUserController&fnc=getCurrentLoggedInUser'
const USER_LOGOUT = '/index.php?cl=MakairaUserController&fnc=logout'

const CART_GET = '/index.php?cl=MakairaUserController&fnc=getCartItems'
const CART_ADD = '/index.php?cl=MakairaUserController&fnc=addProductToCart'
const CART_REMOVE = '/index.php?cl=MakairaUserController&fnc=removeCartItem'
const CART_UPDATE = '/index.php?cl=MakairaUserController&fnc=updateCartItem'

export {
  USER_LOGIN,
  USER_GET_CURRENT,
  USER_LOGOUT,
  CART_GET,
  CART_ADD,
  CART_REMOVE,
  CART_UPDATE,
}
