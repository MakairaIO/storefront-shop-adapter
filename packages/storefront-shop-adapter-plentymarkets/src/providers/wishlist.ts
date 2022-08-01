import {
  BadHttpStatusError,
  MakairaAddItemToWishlist,
  MakairaGetWishlist,
  MakairaRemoveItemFromWishlist,
  MakairaShopProviderWishlist,
  WishlistAddItemEvent,
  WishlistRemoveItemEvent,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterPlentymarkets } from './main'
import {
  PlentymarketsAddWishlistRaw,
  PlentymarketsAddWishlistRes,
  PlentymarketsGetWishlistRaw,
  PlentymarketsGetWishlistRes,
  PlentymarketsRemoveWishlistRaw,
  PlentymarketsRemoveWishlistRes,
} from '../types'
import { WISHLIST_ADD, WISHLIST_GET, WISHLIST_REMOVE } from '../paths'

export class StorefrontShopAdapterPlentymarketsWishlist
  implements MakairaShopProviderWishlist
{
  constructor(private mainAdapter: StorefrontShopAdapterPlentymarkets) {}

  getWishlist: MakairaGetWishlist<unknown, PlentymarketsGetWishlistRaw, Error> =
    async () => {
      try {
        const { response, status } =
          await this.mainAdapter.fetchFromShop<PlentymarketsGetWishlistRes>({
            path: WISHLIST_GET,
          })

        if (status !== 200) {
          return {
            data: undefined,
            raw: { getWishlist: response },
            error: new BadHttpStatusError(),
          }
        }

        const items = response.data.documents.map((item) => ({
          product: {
            id: item.id,
            title: item.data.texts.name1,
            url: item.data.texts.urlPath,
            price: item.data.prices.default.price.value,
            images: item.data.images.all.map((image) => image.url),
          },
        }))

        return {
          data: { items },
          raw: { getWishlist: response },
          error: undefined,
        }
      } catch (e) {
        return { data: undefined, error: e as Error }
      }
    }

  addItem: MakairaAddItemToWishlist<unknown, unknown, Error> = async ({
    input: {
      product: { id },
    },
  }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<PlentymarketsAddWishlistRes>({
          path: WISHLIST_ADD,
          body: {
            variationId: id,
          },
        })

      if (status !== 200) {
        return {
          data: undefined,
          raw: { getWishlist: response },
          error: new BadHttpStatusError(),
        }
      }

      const {
        data: dataGetWishlist,
        raw: rawGetWishlist,
        error: errorGetWishlist,
      } = await this.getWishlist({
        input: {},
      })

      const raw: PlentymarketsAddWishlistRaw = {
        addWishlist: response,
        getWishlist: rawGetWishlist?.getWishlist,
      }

      if (dataGetWishlist) {
        const data = { items: dataGetWishlist.items }

        this.mainAdapter.dispatchEvent(
          new WishlistAddItemEvent<PlentymarketsAddWishlistRaw>(data, raw)
        )

        return { data, raw, error: undefined }
      }

      return { data: undefined, raw, error: errorGetWishlist }
    } catch (e) {
      return { data: undefined, error: e as Error }
    }
  }

  removeItem: MakairaRemoveItemFromWishlist<unknown, unknown, Error> = async ({
    input: {
      product: { id },
    },
  }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<PlentymarketsRemoveWishlistRes>({
          path: `${WISHLIST_REMOVE}/${id}`,
        })

      if (status !== 200 || !response.data) {
        return {
          data: undefined,
          raw: { removeWishlist: response },
          error: new BadHttpStatusError(),
        }
      }

      const {
        data: dataGetWishlist,
        raw: rawGetWishlist,
        error: errorGetWishlist,
      } = await this.getWishlist({
        input: {},
      })

      const raw: PlentymarketsRemoveWishlistRaw = {
        removeWishlist: response,
        getWishlist: rawGetWishlist?.getWishlist,
      }

      if (dataGetWishlist) {
        const data = { items: dataGetWishlist.items }

        this.mainAdapter.dispatchEvent(
          new WishlistRemoveItemEvent<PlentymarketsRemoveWishlistRaw>(data, raw)
        )

        return { data, raw, error: undefined }
      }

      return { data: undefined, raw, error: errorGetWishlist }
    } catch (e) {
      return { data: undefined, error: e as Error }
    }
  }
}
