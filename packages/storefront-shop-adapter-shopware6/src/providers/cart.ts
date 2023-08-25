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
import { CART_ACTION_UPDATE, CART_PATH } from '../paths'
import {
  ShopwareUpdateCartItemAdditionalInput,
  ShopwareAddItemRaw,
  ShopwareAddItemRes,
  ShopwareCartRes,
  ShopwareGetCartRaw,
  ShopwareGetCartRes,
  ShopwareRemoveItemRaw,
  ShopwareRemoveItemRes,
  ShopwareUpdateItemRaw,
  ShopwareUpdateItemRes,
  ShopwareErrorArray,
  ShopwareErrorObject,
} from '../types'

import { StorefrontShopAdapterShopware6 } from './main'
import { lineItemsToMakairaCartItems } from '../utils/lineItemsToMakairaCartItems'

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
          error: this.getError(response) || new BadHttpStatusError(),
        }
      }

      return {
        data: { items: lineItemsToMakairaCartItems(response.lineItems) },
        raw: { getCart: response },
        error: this.getError(response),
      }
    } catch (e) {
      return { data: undefined, raw: { getCart: undefined }, error: e as Error }
    }
  }

  /**
   * Support add item to cart (product/promotion)
   *
   * @example
   * // Example 1: add product to cart
   * addItem({
   *    input: {
   *        product: {
   *            id: ""
   *        },
   *        quantity: 1,
   *        referencedId: "", // should be same with product's id
   *        good: true/false,
   *        type: "product",
   *    }
   * })
   *
   * // Example 2: add promotion to cart
   * addItem({
   *    input: {
   *        product: {
   *            id: ""
   *        },
   *        referencedId: "", // should be same with product's id
   *        good: false,
   *        type: "promotion",
   *    }
   * })
   */
  addItem: MakairaAddItemToCart<
    ShopwareUpdateCartItemAdditionalInput,
    ShopwareAddItemRaw,
    Error
  > = async ({ input }) => {
    try {
      const {
        good,
        product,
        quantity,
        referencedId,
        type,
        description,
        label,
        removable = true,
        stackable = true,
      } = input

      const rawItem: any = {
        id: product.id,
        referencedId: referencedId ?? product.id,
        quantity,
        type,
        good,
        description,
        removable,
        stackable,
      }

      if (label) {
        rawItem.label = label
      }

      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareAddItemRes>({
          path: CART_ACTION_UPDATE,
          method: 'POST',
          body: {
            apiAlias: 'cart',
            items: [rawItem],
          },
        })

      if (status !== 200) {
        return {
          data: undefined,
          raw: { addItem: response },
          error: this.getError(response) || new BadHttpStatusError(),
        }
      }

      const raw: ShopwareAddItemRaw = {
        addItem: response,
      }

      const data: MakairaAddItemToCartResData = {
        items: lineItemsToMakairaCartItems(response.lineItems),
      }

      this.mainAdapter.dispatchEvent(
        new CartAddItemEvent<ShopwareAddItemRaw>(data, raw)
      )

      return { data, raw, error: this.getError(response) }
    } catch (e) {
      return { data: undefined, raw: { addItem: undefined }, error: e as Error }
    }
  }

  /**
   * @deprecated
   * Supporting for <= Shopware 6.5
   */
  removeItem: MakairaRemoveItemFromCart<unknown, ShopwareRemoveItemRaw, Error> =
    async ({ input: { product } }) => {
      try {
        const { response, status } =
          await this.mainAdapter.fetchFromShop<ShopwareRemoveItemRes>({
            path: CART_ACTION_UPDATE + `?ids[0]=${product.id}`,
            method: 'DELETE',
          })

        if (status !== 200) {
          return {
            data: undefined,
            raw: { removeItem: response },
            error: this.getError(response) || new BadHttpStatusError(),
          }
        }

        const data: MakairaRemoveItemFromCartResData = {
          items: lineItemsToMakairaCartItems(response.lineItems),
        }

        const raw: ShopwareRemoveItemRaw = { removeItem: response }

        this.mainAdapter.dispatchEvent(
          new CartRemoveItemEvent<ShopwareRemoveItemRaw>(data, raw)
        )

        return { data, raw, error: this.getError(response) }
      } catch (e) {
        return {
          data: undefined,
          raw: { removeItem: undefined },
          error: e as Error,
        }
      }
    }

  updateItem: MakairaUpdateItemFromCart<
    Partial<ShopwareUpdateCartItemAdditionalInput>,
    ShopwareUpdateItemRaw,
    Error
  > = async ({ input }) => {
    try {
      const { product, quantity, ...remaining } = input

      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareUpdateItemRes>({
          path: CART_ACTION_UPDATE,
          method: 'PATCH',
          body: {
            apiAlias: 'cart',
            items: [{ quantity: quantity, id: product.id, ...remaining }],
          },
        })

      if (status !== 200) {
        return {
          data: undefined,
          raw: { updateItem: response },
          error: this.getError(response) || new BadHttpStatusError(),
        }
      }

      const raw: ShopwareUpdateItemRaw = {
        updateItem: response,
      }

      const data: MakairaUpdateItemFromCartResData = {
        items: lineItemsToMakairaCartItems(response.lineItems),
      }

      this.mainAdapter.dispatchEvent(
        new CartUpdateItemEvent<ShopwareUpdateItemRaw>(data, raw)
      )

      return { data, raw, error: this.getError(response) }
    } catch (e) {
      return {
        data: undefined,
        raw: { updateItem: undefined },
        error: e as Error,
      }
    }
  }

  private getError(response: ShopwareCartRes) {
    const { errors } = response
    for (const key of Object.keys(errors)) {
      if (!Array.isArray(errors)) {
        const err = errors[key as keyof typeof errors]
        if ((err as ShopwareErrorObject).resolved === false) {
          return new Error((err as ShopwareErrorObject).messageKey)
        }
      } else {
        const err: ShopwareErrorArray = errors[parseInt(key)]
        return new Error(err.code)
      }
    }
    return undefined
  }
}
