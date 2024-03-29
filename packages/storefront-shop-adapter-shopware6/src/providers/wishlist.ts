import {
  BadHttpStatusError,
  MakairaAddItemToWishlist,
  MakairaGetWishlist,
  MakairaRemoveItemFromWishlist,
  MakairaShopProviderWishlist,
  WishlistAddItemEvent,
  WishlistRemoveItemEvent,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterShopware6 } from './main'
import {
  ShopwareSearchBody,
  ShopwareWishlistAddRaw,
  ShopwareWishlistAddRes,
  ShopwareWishlistCreateRaw,
  ShopwareWishlistCreateRes,
  ShopwareWishlistGetRaw,
  ShopwareWishlistGetRes,
  ShopwareWishlistRemoveRaw,
  ShopwareWishlistRemoveRes,
} from '../types'
import {
  WISHLIST_ADD,
  WISHLIST_CREATE,
  WISHLIST_GET,
  WISHLIST_REMOVE,
} from '../paths'

export class StorefrontShopAdapterShopware6Wishlist
  implements MakairaShopProviderWishlist
{
  constructor(private mainAdapter: StorefrontShopAdapterShopware6) {}

  createWishlist: MakairaGetWishlist<
    unknown,
    ShopwareWishlistCreateRaw,
    Error
  > = async () => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareWishlistCreateRes>({
          method: 'POST',
          path: WISHLIST_CREATE,
        })

      if (
        status !== 200 ||
        (Array.isArray(response.errors) && response.errors.length > 0)
      ) {
        return {
          data: undefined,
          raw: { createWishlist: response },
          error:
            Array.isArray(response.errors) && response.errors.length > 0
              ? new Error(response.errors[0].detail)
              : new BadHttpStatusError(),
        }
      }

      return {
        data: undefined,
        raw: { createWishlist: response },
        error: undefined,
      }
    } catch (e) {
      return {
        data: undefined,
        raw: { createWishlist: undefined },
        error: e as Error,
      }
    }
  }

  getWishlist: MakairaGetWishlist<
    ShopwareSearchBody,
    ShopwareWishlistGetRaw,
    Error
  > = async () => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareWishlistGetRes>({
          method: 'POST',
          path: WISHLIST_GET,
        })

      if (
        status !== 200 ||
        (Array.isArray(response.errors) && response.errors.length > 0)
      ) {
        return {
          data: { items: [] },
          raw: { wishlist: response },
          error:
            Array.isArray(response.errors) && response.errors.length > 0
              ? new Error(response.errors[0].detail)
              : new BadHttpStatusError(),
        }
      }

      return {
        data: {
          items: response.products?.elements?.map((p) => {
            const image = p.cover?.media?.url
            return {
              product: {
                id: p.id,
                title: p.name,
                price: p.calculatedPrice?.unitPrice,
                url: '',
                images: image ? [image] : [],
              },
            }
          }),
        },
        raw: { wishlist: response },
        error: undefined,
      }
    } catch (e) {
      return {
        data: { items: [] },
        raw: { wishlist: undefined },
        error: e as Error,
      }
    }
  }

  addItem: MakairaAddItemToWishlist<unknown, ShopwareWishlistAddRaw, Error> =
    async ({ input: { product } }) => {
      try {
        const { response, status } =
          await this.mainAdapter.fetchFromShop<ShopwareWishlistAddRes>({
            method: 'POST',
            path: WISHLIST_ADD + '/' + product.id,
          })

        if (
          status !== 200 ||
          (Array.isArray(response.errors) && response.errors.length > 0)
        ) {
          return {
            data: undefined,
            raw: { addItem: response },
            error:
              Array.isArray(response.errors) && response.errors.length > 0
                ? new Error(response.errors[0].detail)
                : new BadHttpStatusError(),
          }
        }

        const { data } = await this.getWishlist({ input: {} })

        this.mainAdapter.dispatchEvent(
          new WishlistAddItemEvent<ShopwareWishlistAddRaw>(
            {
              items: data?.items || [],
            },
            { addItem: response }
          )
        )

        return {
          data: {
            items: data?.items || [],
          },
          raw: { addItem: response },
          error: undefined,
        }
      } catch (e) {
        return {
          data: undefined,
          raw: { addItem: undefined },
          error: e as Error,
        }
      }
    }

  removeItem: MakairaRemoveItemFromWishlist<
    unknown,
    ShopwareWishlistRemoveRaw,
    Error
  > = async ({ input: { product } }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareWishlistRemoveRes>({
          method: 'DELETE',
          path: WISHLIST_REMOVE + '/' + product.id,
        })

      if (
        status !== 200 ||
        (Array.isArray(response.errors) && response.errors.length > 0)
      ) {
        return {
          data: undefined,
          raw: { removeItem: response },
          error:
            Array.isArray(response.errors) && response.errors.length > 0
              ? new Error(response.errors[0].detail)
              : new BadHttpStatusError(),
        }
      }

      const { data } = await this.getWishlist({ input: {} })

      this.mainAdapter.dispatchEvent(
        new WishlistRemoveItemEvent<ShopwareWishlistRemoveRaw>(
          {
            items: data?.items || [],
          },
          { removeItem: response }
        )
      )

      return {
        data: {
          items: data?.items || [],
        },
        raw: { removeItem: response },
        error: undefined,
      }
    } catch (e) {
      return {
        data: undefined,
        raw: { removeItem: undefined },
        error: e as Error,
      }
    }
  }
}
