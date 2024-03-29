export const CONTEXT = '/store-api/context'

export const USER_LOGIN = '/store-api/account/login'
export const USER_LOGOUT = '/store-api/account/logout'
export const USER_GET = '/store-api/account/customer'
export const USER_PASSWORD_RECOVERY = '/store-api/account/recovery-password'
export const USER_SIGNUP = '/store-api/account/register'

export const CART_PATH = '/store-api/checkout/cart'
export const CART_ACTION_GET = CART_PATH
export const CART_ACTION_UPDATE = CART_PATH + '/line-item'

export const PRODUCT_PATH = '/store-api/product'
export const REVIEW_ACTION_GET = 'reviews'
export const REVIEW_ACTION_CREATE = 'review'

export const WISHLIST_GET = '/store-api/customer/wishlist'
export const WISHLIST_ADD = '/store-api/customer/wishlist/add'
export const WISHLIST_REMOVE = '/store-api/customer/wishlist/delete'
export const WISHLIST_CREATE = '/store-api/customer/wishlist/merge'
