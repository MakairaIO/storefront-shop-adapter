import {
  CartAddItemEvent,
  CartRemoveItemEvent,
  CartUpdateItemEvent,
  MakairaAddItemToCart,
  MakairaAddItemToCartResData,
  MakairaGetCart,
  MakairaRemoveItemFromCart,
  MakairaRemoveItemFromCartResData,
  MakairaShopifyShopProviderCart,
  MakairaShopProviderInteractor,
  MakairaUpdateItemFromCart,
  MakairaUpdateItemFromCartResData,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterShopify } from './main'
import {
  GraphqlResWithError,
  ShopifyAddItemRaw,
  ShopifyGetCartRaw as ShopifyGetCartRaw,
  ShopifyRemoveItemRaw,
  ShopifyUpdateItemRaw,
} from '../types'
import {
  CartCreateInput,
  CartCreateMutation,
  CartCreateMutationData,
  CartGetQuery,
  CartGetQueryData,
  CartGetQueryVariables,
  CartLineItemsAddMutation,
  CartLineItemsUpdateMutation,
  CartLinesAddMutationVariables,
  CheckoutLineItemsRemoveMutation,
  CartLinesRemoveMutationVariables,
  CartLinesUpdateMutationData,
  CartLinesUpdateMutationVariables,
  LineItemInputWithoutId,
  CartLinesAddMutationData,
  CartLinesRemoveMutationData,
} from './cart.queries'
import { lineItemsToMakairaCartItems } from '../utils/lineItemsToMakairaCartItems'
import { digest } from '../utils/digest'

export class StorefrontShopAdapterShopifyCart
  implements MakairaShopifyShopProviderCart
{
  STORAGE_KEY_CHECKOUT_ID = 'makaira-shop-shopify-cart-id'

  constructor(private mainAdapter: StorefrontShopAdapterShopify) {}

  getCart: MakairaGetCart<unknown, ShopifyGetCartRaw, Error> = async () => {
    try {
      const createCart: MakairaGetCart<
        unknown,
        ShopifyGetCartRaw,
        Error
      > = async () => {
        const createCartResponse = await this.createCartAndStoreId({
          input: {},
        })

        if (createCartResponse.error || !createCartResponse.data) {
          return {
            error: createCartResponse.error,
            raw: { createCart: createCartResponse.raw.cartCreate },
          }
        }

        return {
          data: {
            items: lineItemsToMakairaCartItems(
              createCartResponse.data.cart.lines
            ),
          },
          raw: { createCart: createCartResponse.raw.cartCreate },
        }
      }

      const shopInstanceIdentifier = await digest(
        this.mainAdapter.additionalOptions.url
      )
      const storedCartId = this.getCartId(shopInstanceIdentifier)

      if (!storedCartId) {
        return createCart({ input: {} })
      }

      const responseGetCart = await this.mainAdapter.fetchFromShop<
        CartGetQueryData,
        CartGetQueryVariables
      >({
        query: CartGetQuery({
          cartFragment:
            this.mainAdapter.additionalOptions.fragments.cartFragment,
          contextOptions: this.mainAdapter.getContextOptions(),
        }),
        variables: { id: storedCartId },
      })

      if (responseGetCart.errors?.length) {
        return {
          raw: { getCart: responseGetCart },
          error: new Error(responseGetCart.errors[0].message),
        }
      }

      if (!responseGetCart.data) {
        return {
          raw: { getCart: responseGetCart },
          error: new Error('getCheckout data is not defined'),
        }
      }

      if (responseGetCart.data.cart == null) {
        return createCart({ input: {} })
      }

      return {
        data: {
          items: lineItemsToMakairaCartItems(responseGetCart.data.cart.lines),
        },
        raw: { getCart: responseGetCart },
      }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }
  // MARKER HIER WEITERMACHEN
  addItem: MakairaAddItemToCart<unknown, ShopifyAddItemRaw, Error> = async ({
    input: { product, quantity },
  }) => {
    try {
      const lines: LineItemInputWithoutId[] = [
        {
          merchandiseId: this.transformToShopifyVariantId(product.id),
          attributes: product.attributes,
          quantity,
        },
      ]

      const shopInstanceIdentifier = await digest(
        this.mainAdapter.additionalOptions.url
      )
      const cartId = this.getCartId(shopInstanceIdentifier)

      if (!cartId) {
        const responseCartCreate = await this.createCartAndStoreId({
          input: { lines },
        })

        if (responseCartCreate.error || !responseCartCreate.data) {
          return {
            error: responseCartCreate.error,
            raw: { cartCreate: responseCartCreate.raw.cartCreate },
          }
        }

        const data: MakairaAddItemToCartResData = {
          items: lineItemsToMakairaCartItems(
            responseCartCreate.data.cart.lines
          ),
        }

        const raw: ShopifyAddItemRaw = {
          cartCreate: responseCartCreate.raw.cartCreate,
        }

        this.mainAdapter.dispatchEvent(
          new CartAddItemEvent<ShopifyAddItemRaw>(data, raw)
        )

        return { data, raw }
      }

      const responseCartLineItemsAdd = await this.mainAdapter.fetchFromShop<
        CartLinesAddMutationData,
        CartLinesAddMutationVariables
      >({
        query: CartLineItemsAddMutation({
          cartFragment:
            this.mainAdapter.additionalOptions.fragments.cartFragment,
          contextOptions: this.mainAdapter.getContextOptions(),
        }),
        variables: { cartId, lines },
      })

      if (responseCartLineItemsAdd.errors?.length) {
        return {
          raw: { cartLinesAdd: responseCartLineItemsAdd },
          error: new Error(responseCartLineItemsAdd.errors[0].message),
        }
      }

      if (!responseCartLineItemsAdd.data) {
        return {
          raw: { cartLinesAdd: responseCartLineItemsAdd },
          error: new Error('checkoutLineItemsAdd is not defined'),
        }
      }

      if (responseCartLineItemsAdd.data.cartLinesAdd.userErrors.length > 0) {
        return {
          raw: { cartLinesAdd: responseCartLineItemsAdd },
          error: new Error(
            responseCartLineItemsAdd.data.cartLinesAdd.userErrors[0].message
          ),
        }
      }

      const data: MakairaAddItemToCartResData = {
        items: lineItemsToMakairaCartItems(
          responseCartLineItemsAdd.data.cartLinesAdd.cart.lines
        ),
      }

      const raw: ShopifyAddItemRaw = {
        cartLinesAdd: responseCartLineItemsAdd,
      }

      this.mainAdapter.dispatchEvent(
        new CartAddItemEvent<ShopifyAddItemRaw>(data, raw)
      )

      return { data, raw, error: undefined }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }

  removeItem: MakairaRemoveItemFromCart<
    {
      product?: never
      lineItemIds: string[]
    },
    ShopifyRemoveItemRaw,
    Error
  > = async ({ input: { lineItemIds } }) => {
    try {
      const shopInstanceIdentifier = await digest(
        this.mainAdapter.additionalOptions.url
      )
      const checkoutId = this.getCartId(shopInstanceIdentifier)

      if (!checkoutId) {
        const responseCartCreate = await this.createCartAndStoreId({
          input: {},
        })

        if (responseCartCreate.error || !responseCartCreate.data) {
          return {
            error: responseCartCreate.error,
            raw: {
              checkoutCreate: responseCartCreate.raw.cartCreate,
            },
          }
        }

        const data: MakairaRemoveItemFromCartResData = {
          items: lineItemsToMakairaCartItems(
            responseCartCreate.data.cart.lines
          ),
        }

        const raw: ShopifyRemoveItemRaw = {
          cartCreate: responseCartCreate.raw.cartCreate,
        }

        this.mainAdapter.dispatchEvent(
          new CartRemoveItemEvent<ShopifyRemoveItemRaw>(data, raw)
        )

        return { data, raw }
      }

      const responseCartLineItemsRemove = await this.mainAdapter.fetchFromShop<
        CartLinesRemoveMutationData,
        CartLinesRemoveMutationVariables
      >({
        query: CheckoutLineItemsRemoveMutation({
          cartFragment:
            this.mainAdapter.additionalOptions.fragments.cartFragment,
          contextOptions: this.mainAdapter.getContextOptions(),
        }),
        variables: { cartId: checkoutId, lineIds: lineItemIds },
      })

      if (responseCartLineItemsRemove.errors?.length) {
        return {
          raw: { cartLinesRemove: responseCartLineItemsRemove },
          error: new Error(responseCartLineItemsRemove.errors[0].message),
        }
      }

      if (!responseCartLineItemsRemove.data) {
        return {
          raw: { cartLinesRemove: responseCartLineItemsRemove },
          error: new Error('checkoutLineItemsRemove is not defined'),
        }
      }

      if (
        responseCartLineItemsRemove.data.cartLinesRemove.userErrors.length > 0
      ) {
        return {
          raw: { cartLinesRemove: responseCartLineItemsRemove },
          error: new Error(
            responseCartLineItemsRemove.data.cartLinesRemove.userErrors[0].message
          ),
        }
      }

      const data: MakairaRemoveItemFromCartResData = {
        items: lineItemsToMakairaCartItems(
          responseCartLineItemsRemove.data.cartLinesRemove.cart.lines
        ),
      }

      const raw: ShopifyRemoveItemRaw = {
        cartLinesRemove: responseCartLineItemsRemove,
      }

      this.mainAdapter.dispatchEvent(
        new CartRemoveItemEvent<ShopifyRemoveItemRaw>(data, raw)
      )

      return { data, raw, error: undefined }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }

  updateItem: MakairaUpdateItemFromCart<
    { lineItemId: string },
    ShopifyUpdateItemRaw,
    Error
  > = async ({ input: { product, quantity, lineItemId } }) => {
    try {
      const shopInstanceIdentifier = await digest(
        this.mainAdapter.additionalOptions.url
      )
      const cartId = this.getCartId(shopInstanceIdentifier)

      if (!cartId) {
        const responseCheckoutCreate = await this.createCartAndStoreId({
          input: {
            lines: [
              {
                quantity,
                merchandiseId: this.transformToShopifyVariantId(product.id),
                attributes: product.attributes,
              },
            ],
          },
        })

        if (responseCheckoutCreate.error || !responseCheckoutCreate.data) {
          return {
            error: responseCheckoutCreate.error,
            raw: {
              checkoutCreate: responseCheckoutCreate.raw.cartCreate,
            },
          }
        }

        const data: MakairaUpdateItemFromCartResData = {
          items: lineItemsToMakairaCartItems(
            responseCheckoutCreate.data.cart.lines
          ),
        }

        const raw: ShopifyUpdateItemRaw = {
          cartCreate: responseCheckoutCreate.raw.cartCreate,
        }

        this.mainAdapter.dispatchEvent(
          new CartUpdateItemEvent<ShopifyUpdateItemRaw>(data, raw)
        )

        return { data, raw }
      }

      const responseCheckoutLineItemsUpdate =
        await this.mainAdapter.fetchFromShop<
          CartLinesUpdateMutationData,
          CartLinesUpdateMutationVariables
        >({
          query: CartLineItemsUpdateMutation({
            cartFragment:
              this.mainAdapter.additionalOptions.fragments.cartFragment,
            contextOptions: this.mainAdapter.getContextOptions(),
          }),
          variables: {
            cartId,
            lines: [
              {
                id: lineItemId,
                attributes: product.attributes,
                quantity,
              },
            ],
          },
        })

      if (responseCheckoutLineItemsUpdate.errors?.length) {
        return {
          raw: { cartLinesUpdate: responseCheckoutLineItemsUpdate },
          error: new Error(responseCheckoutLineItemsUpdate.errors[0].message),
        }
      }

      if (!responseCheckoutLineItemsUpdate.data) {
        return {
          raw: { cartLinesUpdate: responseCheckoutLineItemsUpdate },
          error: new Error('cartLinesUpdate is not defined'),
        }
      }

      if (
        responseCheckoutLineItemsUpdate.data.cartLinesUpdate.userErrors.length >
        0
      ) {
        return {
          raw: { cartLinesUpdate: responseCheckoutLineItemsUpdate },
          error: new Error(
            responseCheckoutLineItemsUpdate.data.cartLinesUpdate.userErrors[0].message
          ),
        }
      }

      const data: MakairaUpdateItemFromCartResData = {
        items: lineItemsToMakairaCartItems(
          responseCheckoutLineItemsUpdate.data.cartLinesUpdate.cart.lines
        ),
      }

      const raw: ShopifyUpdateItemRaw = {
        cartLinesUpdate: responseCheckoutLineItemsUpdate,
      }

      this.mainAdapter.dispatchEvent(
        new CartUpdateItemEvent<ShopifyUpdateItemRaw>(data, raw)
      )

      return { data, raw, error: undefined }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }

  public createCartAndStoreId: MakairaShopProviderInteractor<
    CartCreateInput,
    CartCreateMutationData['cartCreate'],
    { cartCreate: GraphqlResWithError<CartCreateMutationData> },
    Error
  > = async (variables) => {
    if (
      !variables.input.buyerIdentity &&
      !!this.mainAdapter.additionalOptions.buyerIdentity
    ) {
      variables.input.buyerIdentity =
        this.mainAdapter.additionalOptions.buyerIdentity
    }

    const responseCartCreate = await this.mainAdapter.fetchFromShop<
      CartCreateMutationData,
      {
        input: CartCreateInput
      }
    >({
      query: CartCreateMutation({
        cartCreateFragment:
          this.mainAdapter.additionalOptions.fragments.cartFragment,
        contextOptions: this.mainAdapter.getContextOptions(),
      }),
      variables,
    })

    if (responseCartCreate.errors?.length) {
      return {
        raw: { cartCreate: responseCartCreate },
        error: new Error(responseCartCreate.errors[0].message),
      }
    }

    if (!responseCartCreate.data?.cartCreate) {
      return {
        raw: { cartCreate: responseCartCreate },
        error: new Error('checkoutCreate is not defined'),
      }
    }

    if (responseCartCreate.data?.cartCreate.userErrors.length) {
      return {
        raw: { cartCreate: responseCartCreate },
        error: new Error(
          responseCartCreate.data?.cartCreate.userErrors[0].message
        ),
      }
    }

    const shopInstanceIdentifier = await digest(
      this.mainAdapter.additionalOptions.url
    )
    this.setCartId(
      responseCartCreate.data.cartCreate.cart.id,
      shopInstanceIdentifier
    )

    return {
      raw: { cartCreate: responseCartCreate },
      data: responseCartCreate.data.cartCreate,
    }
  }

  private transformToShopifyVariantId(productId: string) {
    if (productId.startsWith('gid://')) {
      return btoa(productId)
    }

    return btoa(`gid://shopify/ProductVariant/${productId}`)
  }

  private getCartId(instanceIdentifier: string) {
    return this.mainAdapter.additionalOptions.storage.getItem(
      `${this.STORAGE_KEY_CHECKOUT_ID}-${instanceIdentifier}`
    )
  }

  private setCartId(id: string, instanceIdentifier: string) {
    return this.mainAdapter.additionalOptions.storage.setItem(
      `${this.STORAGE_KEY_CHECKOUT_ID}-${instanceIdentifier}`,
      id
    )
  }
}
