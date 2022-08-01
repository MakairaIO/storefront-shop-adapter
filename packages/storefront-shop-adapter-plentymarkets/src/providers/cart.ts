import {
  BadHttpStatusError,
  CartAddItemEvent,
  CartRemoveItemEvent,
  CartUpdateItemEvent,
  MakairaAddItemToCart,
  MakairaGetCart,
  MakairaRemoveItemFromCart,
  MakairaShopProviderCart,
  MakairaUpdateItemFromCart,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterPlentymarkets } from './main'
import {
  PlentymarketsAddItemRaw,
  PlentymarketsAddItemRes,
  PlentymarketsGetCartRaw,
  PlentymarketsGetCartRes,
  PlentymarketsRemoveItemRaw,
  PlentymarketsRemoveItemRes,
  PlentymarketsUpdateItemRaw,
  PlentymarketsUpdateItemRes,
} from '../types'
import { CART_ADD, CART_REMOVE, CART_GET, CART_UPDATE } from '../paths'

export class StorefrontShopAdapterPlentymarketsCart
  implements MakairaShopProviderCart
{
  constructor(private mainAdapter: StorefrontShopAdapterPlentymarkets) {}

  getCart: MakairaGetCart<unknown, PlentymarketsGetCartRaw, Error> =
    async () => {
      try {
        const { response, status } =
          await this.mainAdapter.fetchFromShop<PlentymarketsGetCartRes>({
            path: CART_GET,
          })

        if (status !== 200) {
          return {
            data: undefined,
            raw: { getCart: response },
            error: new BadHttpStatusError(),
          }
        }

        const items = response.items.map((item) => ({
          quantity: item.quantity,
          product: {
            id: item.variantId,
            price: item.price,
            title: item.name,
            images: [item.previewURL],
            url: '',
          },
        }))

        return { data: { items }, raw: { getCart: response }, error: undefined }
      } catch (e) {
        return { data: undefined, error: e as Error }
      }
    }

  addItem: MakairaAddItemToCart<unknown, PlentymarketsAddItemRaw, Error> =
    async ({ input: { product, quantity } }) => {
      try {
        const { response, status } =
          await this.mainAdapter.fetchFromShop<PlentymarketsAddItemRes>({
            path: CART_ADD,
            body: {
              quantity,
              variantId: product.id,
            },
          })

        if (status !== 200 || !response.success) {
          return {
            data: undefined,
            raw: { addItem: response },
            error: !response.success
              ? new Error(response.message)
              : new BadHttpStatusError(),
          }
        }

        const items = response.cart.items.map((item) => ({
          quantity: item.quantity,
          product: {
            id: item.variantId,
            price: item.price,
            title: item.name,
            images: [item.previewURL],
            url: '',
          },
        }))

        const data = { items }
        const raw = { addItem: response }

        this.mainAdapter.dispatchEvent(
          new CartAddItemEvent<PlentymarketsAddItemRaw>(data, raw)
        )

        return { data, raw: { addItem: response }, error: undefined }
      } catch (e) {
        return { data: undefined, error: e as Error }
      }
    }

  removeItem: MakairaRemoveItemFromCart<
    unknown,
    PlentymarketsRemoveItemRaw,
    Error
  > = async ({ input: { product } }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<PlentymarketsRemoveItemRes>({
          path: `${CART_REMOVE}/${product.id}`,
          method: 'DELETE',
        })

      if (status !== 200 || !response.success) {
        return {
          data: undefined,
          raw: { removeItem: response, getCart: undefined },
          error: !response.success
            ? new Error(response.message)
            : new BadHttpStatusError(),
        }
      }

      const {
        data: dataGetCart,
        raw: rawGetCart,
        error: errorGetCart,
      } = await this.getCart({
        input: {},
      })

      const raw: PlentymarketsRemoveItemRaw = {
        removeItem: response,
        getCart: rawGetCart?.getCart,
      }

      if (dataGetCart) {
        const data = { items: dataGetCart.items }

        this.mainAdapter.dispatchEvent(
          new CartRemoveItemEvent<PlentymarketsRemoveItemRaw>(data, raw)
        )

        return { data, raw, error: undefined }
      }

      return { data: undefined, raw, error: errorGetCart }
    } catch (e) {
      return { data: undefined, error: e as Error }
    }
  }

  updateItem: MakairaUpdateItemFromCart<
    unknown,
    PlentymarketsUpdateItemRaw,
    Error
  > = async ({ input: { product, quantity } }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<PlentymarketsUpdateItemRes>({
          path: `${CART_UPDATE}/${product.id}`,
          body: {
            quantity,
          },
        })

      if (status !== 200 || !response.success) {
        return {
          data: undefined,
          raw: { updateItem: response },
          error: !response.success
            ? new Error(response.message)
            : new BadHttpStatusError(),
        }
      }

      const items = response.cart.items.map((item) => ({
        quantity: item.quantity,
        product: {
          id: item.variantId,
          price: item.price,
          title: item.name,
          images: [item.previewURL],
          url: '',
        },
      }))

      const data = { items }
      const raw = { updateItem: response }

      this.mainAdapter.dispatchEvent(
        new CartUpdateItemEvent<PlentymarketsUpdateItemRaw>(data, raw)
      )

      return { data, raw: { updateItem: response }, error: undefined }
    } catch (e) {
      return { data: undefined, error: e as Error }
    }
  }
}
