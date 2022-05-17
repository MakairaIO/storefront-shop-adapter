import { MakairaShopProvider } from "@makaira/storefront-types";
import {
  login,
  logout,
  MakairaLoginLocal,
  MakairaLogoutLocal,
  MakairaSignupLocal,
  signup,
} from "./auth";
import {
  addItemToCart,
  getCart,
  MakairaAddItemToCartLocal,
  MakairaGetCartLocal,
  MakairaRemoveItemFromCartLocal,
  MakairaUpdateItemFromCartLocal,
  removeItemFromCart,
  updateItemFromCart,
} from "./cart";
import {
  getCheckout,
  MakairaGetCheckoutLocal,
  MakairaSubmitCheckoutLocal,
  submitCheckout,
} from "./checkout";
import { getCustomer } from "./customer";

export class StorefrontShopAdapterLocal
  extends EventTarget
  implements MakairaShopProvider
{
  constructor() {
    super();
  }

  login: MakairaLoginLocal = (...args) => login(this, ...args);
  logout: MakairaLogoutLocal = (...args) => logout(this, ...args);
  signup: MakairaSignupLocal = (...args) => signup(this, ...args);

  addItemToCart: MakairaAddItemToCartLocal = (...args) =>
    addItemToCart(this, ...args);
  getCart: MakairaGetCartLocal = (...args) => getCart(this, ...args);
  removeItemFromCart: MakairaRemoveItemFromCartLocal = (...args) =>
    removeItemFromCart(this, ...args);
  updateItemFromCart: MakairaUpdateItemFromCartLocal = (...args) =>
    updateItemFromCart(this, ...args);

  getCheckout: MakairaGetCheckoutLocal = (...args) =>
    getCheckout(this, ...args);
  submitCheckout: MakairaSubmitCheckoutLocal = (...args) =>
    submitCheckout(this, ...args);

  getCustomer: MakairaGetCheckoutLocal = (...args) =>
    getCustomer(this, ...args);
}
