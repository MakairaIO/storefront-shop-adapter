import { MakairaLogin, MakairaLogout, MakairaSignup } from "./auth";
import {
  MakairaAddItemToCart,
  MakairaGetCart,
  MakairaRemoveItemFromCart,
  MakairaUpdateItemFromCart,
} from "./cart";
import { MakairaGetCheckout, MakairaSubmitCheckout } from "./checkout";
import { MakairaGetCustomer } from "./customer";

export interface MakairaShopProvider {
  login: MakairaLogin;
  logout: MakairaLogout;
  signup: MakairaSignup;

  addItemToCart: MakairaAddItemToCart;
  getCart: MakairaGetCart;
  removeItemFromCart: MakairaRemoveItemFromCart;
  updateItemFromCart: MakairaUpdateItemFromCart;

  getCheckout: MakairaGetCheckout;
  submitCheckout: MakairaSubmitCheckout;

  getCustomer: MakairaGetCustomer;
}
