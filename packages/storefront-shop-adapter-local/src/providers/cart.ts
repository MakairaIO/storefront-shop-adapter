import {
  MakairaAddItemToCart,
  MakairaGetCart,
  MakairaRemoveItemFromCart,
  MakairaShopProviderCart,
  MakairaUpdateItemFromCart,
  MakairaProduct,
} from "@makaira/storefront-types";
import { StorefrontShopAdapterLocal } from "./main";

type CartStore = {
  version: "v1";
  items: Array<{ product: MakairaProduct; quantity: number }>;
};

export class StorefrontShopAdapterLocalCart implements MakairaShopProviderCart {
  LOCAL_STORAGE_STORE = "makaira-shop-local-cart";

  constructor(private mainAdapter: StorefrontShopAdapterLocal) {}

  getCart: MakairaGetCart<unknown, CartStore, Error> = async () => {
    const cart = this.getStore();

    return { data: { items: cart.items, raw: cart }, error: undefined };
  };

  addItem: MakairaAddItemToCart<unknown, CartStore, Error> = async ({
    input: { product, quantity },
  }) => {
    const cart = this.getStore();

    const itemExistsIndex = cart.items.findIndex(
      (item) => item.product.ean === product.ean
    );

    if (itemExistsIndex > -1) {
      cart.items[itemExistsIndex].quantity += quantity;
    } else {
      cart.items.push({ product, quantity });
    }

    this.setStore(cart);

    return { data: { items: cart.items, raw: cart }, error: undefined };
  };

  removeItem: MakairaRemoveItemFromCart<unknown, CartStore, Error> = async ({
    input: { product },
  }) => {
    const cart = this.getStore();

    const itemExistsIndex = cart.items.findIndex(
      (item) => item.product.ean === product.ean
    );

    if (itemExistsIndex > -1) {
      return { data: undefined, error: new Error("product not found in cart") };
    }

    cart.items.splice(itemExistsIndex, 1);

    this.setStore(cart);

    return { data: { items: cart.items, raw: cart }, error: undefined };
  };

  updateItem: MakairaUpdateItemFromCart<unknown, CartStore, Error> = async ({
    input: { product, quantity },
  }) => {
    const cart = this.getStore();

    const itemExistsIndex = cart.items.findIndex(
      (item) => item.product.ean === product.ean
    );

    if (itemExistsIndex > -1) {
      return {
        data: undefined,
        error: new Error("product not found in cart"),
      };
    }

    cart.items[itemExistsIndex].quantity = quantity;

    this.setStore(cart);

    return { data: { items: cart.items, raw: cart }, error: undefined };
  };

  private getStore(): CartStore {
    const rawStore = localStorage.getItem(this.LOCAL_STORAGE_STORE);

    if (!rawStore) {
      return { version: "v1", items: [] };
    }

    return JSON.parse(rawStore) as CartStore;
  }

  private async setStore(store: CartStore) {
    localStorage.setItem(this.LOCAL_STORAGE_STORE, JSON.stringify(store));
  }
}
