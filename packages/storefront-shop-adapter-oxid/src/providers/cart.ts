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
import { StorefrontShopAdapterOxid } from './main'
import {
  OxidAddItemRaw,
  OxidAddItemRes,
  OxidGetCartRaw,
  OxidGetCartRes,
  OxidRemoveItemRaw,
  OxidRemoveItemRes,
  OxidUpdateItemRaw,
  OxidUpdateItemRes,
} from '../types'

export class StorefrontShopAdapterOxidCart implements MakairaShopProviderCart {
  constructor(private mainAdapter: StorefrontShopAdapterOxid) {}

  getCart: MakairaGetCart<unknown, OxidGetCartRaw, Error> = async () => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<OxidGetCartRes>({
          path: this.mainAdapter.paths.CART_GET,
        })

      if (status !== 200 || !Array.isArray(response)) {
        return {
          data: undefined,
          raw: { getCart: response },
          error: !Array.isArray(response)
            ? new Error(response.message)
            : new BadHttpStatusError(),
        }
      }

      const items = response.map((item) => ({
        quantity: item.quantity,
        product: {
          id: item.cart_item_id,
          price: item.price,
          title: item.name,
          images: [item.image_path],
          url: '',
        },
      }))

      return { data: { items }, raw: { getCart: response }, error: undefined }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }

  addItem: MakairaAddItemToCart<unknown, OxidAddItemRaw, Error> = async ({
    input: { product, quantity },
  }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<OxidAddItemRes>({
          path: this.mainAdapter.paths.CART_ADD,
          body: {
            product_id: product.id,
            amount: quantity,
          },
        })

      if (status !== 200 || response.success === false) {
        return {
          data: undefined,
          raw: { addItem: response },
          error:
            response.success === false
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

      const raw: OxidAddItemRaw = {
        addItem: response,
        getCart: rawGetCart?.getCart,
      }

      if (dataGetCart) {
        const data = { items: dataGetCart.items }

        this.mainAdapter.dispatchEvent(
          new CartAddItemEvent<OxidAddItemRaw>(data, raw)
        )

        return { data, raw, error: undefined }
      }

      return { data: undefined, raw, error: errorGetCart }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }

  removeItem: MakairaRemoveItemFromCart<unknown, OxidRemoveItemRaw, Error> =
    async ({ input: { product } }) => {
      try {
        const { response, status } =
          await this.mainAdapter.fetchFromShop<OxidRemoveItemRes>({
            path: this.mainAdapter.paths.CART_REMOVE,
            body: {
              cart_item_id: product.id,
            },
          })

        if (status !== 200 || response.success === false) {
          return {
            data: undefined,
            raw: { removeItem: response },
            error:
              response.success === false
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

        const raw: OxidRemoveItemRaw = {
          removeItem: response,
          getCart: rawGetCart?.getCart,
        }

        if (dataGetCart) {
          const data = { items: dataGetCart.items }

          this.mainAdapter.dispatchEvent(
            new CartRemoveItemEvent<OxidRemoveItemRaw>(data, raw)
          )

          return { data, raw, error: undefined }
        }

        return { data: undefined, raw, error: errorGetCart }
      } catch (e) {
        return { data: undefined, raw: {}, error: e as Error }
      }
    }

  updateItem: MakairaUpdateItemFromCart<unknown, OxidUpdateItemRaw, Error> =
    async ({ input: { product, quantity } }) => {
      try {
        const { response, status } =
          await this.mainAdapter.fetchFromShop<OxidUpdateItemRes>({
            path: this.mainAdapter.paths.CART_UPDATE,
            body: {
              cart_item_id: product.id,
              amount: quantity,
            },
          })

        if (status !== 200 || response.success === false) {
          return {
            data: undefined,
            raw: { updateItem: response },
            error:
              response.success === false
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

        const raw: OxidUpdateItemRaw = {
          updateItem: response,
          getCart: rawGetCart?.getCart,
        }

        if (dataGetCart) {
          const data = { items: dataGetCart.items }

          this.mainAdapter.dispatchEvent(
            new CartUpdateItemEvent<OxidUpdateItemRaw>(data, raw)
          )

          return { data, raw, error: undefined }
        }

        return { data: undefined, raw, error: errorGetCart }
      } catch (e) {
        return { data: undefined, raw: {}, error: e as Error }
      }
    }
}
