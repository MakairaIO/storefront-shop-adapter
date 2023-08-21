import {
  BadHttpStatusError,
  CartAddItemEvent,
  CartRemoveItemEvent,
  CartUpdateItemEvent,
  MakairaAddItemToCart,
  MakairaAddItemToCartResData,
  MakairaGetCart,
  MakairaRemoveItemFromCart,
  MakairaRemoveItemFromCartResData,
  MakairaShopProviderCart,
  MakairaUpdateItemFromCart,
  MakairaUpdateItemFromCartResData,
} from '@makaira/storefront-types'
import {
  CART_ACTION_ADD,
  CART_ACTION_GET,
  CART_ACTION_REMOVE,
  CART_ACTION_UPDATE,
  CART_PATH,
} from '../paths'
import {
  ShopwareAddItemRaw,
  ShopwareAddItemRes,
  ShopwareGetCartRaw,
  ShopwareGetCartRes,
  ShopwareRemoveItemRaw,
  ShopwareRemoveItemRes,
  ShopwareUpdateItemRaw,
  ShopwareUpdateItemRes,
} from '../types'

import { StorefrontShopAdapterShopware6 } from './main'

export class StorefrontShopAdapterShopware6Cart
  implements MakairaShopProviderCart
{
  constructor(private mainAdapter: StorefrontShopAdapterShopware6) {}

  getCart: MakairaGetCart<unknown, ShopwareGetCartRaw, Error> = async () => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareGetCartRes>({
          path: CART_PATH,
        })

      if (status !== 200) {
        return {
          data: undefined,
          raw: { getCart: response },
          error: new BadHttpStatusError(),
        }
      }

      const items = response.map((item) => ({
        quantity: item.quantity,
        product: {
          id: item.id,
          price: item.price,
          title: item.name,
          images: [item.image_path],
          url: '',
        },
      }))

      return { data: { items }, raw: { getCart: response }, error: undefined }
    } catch (e) {
      console.log('getCart', e)
      return { data: undefined, raw: { getCart: undefined }, error: e as Error }
    }
  }

  addItem: MakairaAddItemToCart<unknown, ShopwareAddItemRaw, Error> = async ({
    input: { product, quantity },
  }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareAddItemRes>({
          path: CART_PATH,
          body: {
            article_id: product.id,
            quantity,
          },
        })

      if (status !== 200 || !Array.isArray(response)) {
        return {
          data: undefined,
          raw: { addItem: response },
          error:
            (response as { ok: boolean }).ok === false
              ? new Error((response as { message: string }).message)
              : new BadHttpStatusError(),
        }
      }

      const raw: ShopwareAddItemRaw = {
        addItem: response,
      }

      const data: MakairaAddItemToCartResData = {
        items: response.map((item) => ({
          product: {
            id: item.id,
            images: [item.image_path],
            price: item.price,
            title: item.name,
            url: '',
          },
          quantity: item.quantity,
        })),
      }

      this.mainAdapter.dispatchEvent(
        new CartAddItemEvent<ShopwareAddItemRaw>(data, raw)
      )

      return { data, raw, error: undefined }
    } catch (e) {
      return { data: undefined, raw: { addItem: undefined }, error: e as Error }
    }
  }

  removeItem: MakairaRemoveItemFromCart<unknown, ShopwareRemoveItemRaw, Error> =
    async ({ input: { product } }) => {
      try {
        const { response, status } =
          await this.mainAdapter.fetchFromShop<ShopwareRemoveItemRes>({
            path: CART_PATH,
            body: {
              cart_item_id: product.id,
            },
          })

        if (status !== 200 || !Array.isArray(response)) {
          return {
            data: undefined,
            raw: { removeItem: response },
            error:
              (response as { ok: boolean }).ok === false
                ? new Error((response as { message: string }).message)
                : new BadHttpStatusError(),
          }
        }

        const data: MakairaRemoveItemFromCartResData = {
          items: response.map((item) => ({
            product: {
              id: item.id,
              images: [item.image_path],
              price: item.price,
              title: item.name,
              url: '',
            },
            quantity: item.quantity,
          })),
        }

        const raw: ShopwareRemoveItemRaw = { removeItem: response }

        this.mainAdapter.dispatchEvent(
          new CartRemoveItemEvent<ShopwareRemoveItemRaw>(data, raw)
        )

        return { data, raw, error: undefined }
      } catch (e) {
        return {
          data: undefined,
          raw: { removeItem: undefined },
          error: e as Error,
        }
      }
    }

  updateItem: MakairaUpdateItemFromCart<unknown, ShopwareUpdateItemRaw, Error> =
    async ({ input: { product, quantity } }) => {
      try {
        const { response, status } =
          await this.mainAdapter.fetchFromShop<ShopwareUpdateItemRes>({
            path: CART_PATH,
            body: {
              cart_item_id: product.id,
              quantity,
            },
          })

        if (status !== 200 || !Array.isArray(response)) {
          return {
            data: undefined,
            raw: { updateItem: response },
            error:
              (response as { ok: boolean }).ok === false
                ? new Error((response as { message: string }).message)
                : new BadHttpStatusError(),
          }
        }

        const raw: ShopwareUpdateItemRaw = {
          updateItem: response,
        }

        const data: MakairaUpdateItemFromCartResData = {
          items: response.map((item) => ({
            product: {
              id: item.id,
              images: [item.image_path],
              price: item.price,
              title: item.name,
              url: '',
            },
            quantity: item.quantity,
          })),
        }

        this.mainAdapter.dispatchEvent(
          new CartUpdateItemEvent<ShopwareUpdateItemRaw>(data, raw)
        )

        return { data, raw, error: undefined }
      } catch (e) {
        return {
          data: undefined,
          raw: { updateItem: undefined },
          error: e as Error,
        }
      }
    }
}
