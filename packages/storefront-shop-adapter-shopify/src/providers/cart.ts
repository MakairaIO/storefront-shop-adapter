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
  ShopifyGetCartRaw,
  ShopifyRemoveItemRaw,
  ShopifyUpdateItemRaw,
} from '../types'
import {
  CheckoutCreateMutation,
  CheckoutCreateMutationData,
  CheckoutCreateMutationVariables,
  CheckoutGetQuery,
  CheckoutGetQueryData,
  CheckoutGetQueryVariables,
  CheckoutLineItemsAddMutation,
  CheckoutLineItemsAddMutationData,
  CheckoutLineItemsAddMutationVariables,
  CheckoutLineItemsRemoveMutation,
  CheckoutLineItemsRemoveMutationData,
  CheckoutLineItemsRemoveMutationVariables,
  CheckoutLineItemsUpdateMutation,
  CheckoutLineItemsUpdateMutationData,
  CheckoutLineItemsUpdateMutationVariables,
  LineItemInput,
} from './cart.queries'
import { lineItemsToMakairaCartItems } from '../utils/lineItemsToMakairaCartItems'
import { digest } from '../utils/digest'

export class StorefrontShopAdapterShopifyCart
  implements MakairaShopifyShopProviderCart
{
  STORAGE_KEY_CHECKOUT_ID = 'makaira-shop-shopify-checkout-id'

  constructor(private mainAdapter: StorefrontShopAdapterShopify) {}

  getCart: MakairaGetCart<unknown, ShopifyGetCartRaw, Error> = async () => {
    try {
      const createCheckout: MakairaGetCart<
        unknown,
        ShopifyGetCartRaw,
        Error
      > = async () => {
        const createCheckoutResponse = await this.createCheckoutAndStoreId({
          input: {},
        })

        if (createCheckoutResponse.error || !createCheckoutResponse.data) {
          return {
            error: createCheckoutResponse.error,
            raw: { createCheckout: createCheckoutResponse.raw.createCheckout },
          }
        }

        return {
          data: {
            items: lineItemsToMakairaCartItems(
              createCheckoutResponse.data.checkout.lineItems
            ),
          },
          raw: { createCheckout: createCheckoutResponse.raw.createCheckout },
        }
      }

      const shopInstanceIdentifier = await digest(
        this.mainAdapter.additionalOptions.url
      )
      const storedCheckoutId = this.getCheckoutId(shopInstanceIdentifier)

      if (!storedCheckoutId) {
        return createCheckout({ input: {} })
      }

      const responseGetCheckout = await this.mainAdapter.fetchFromShop<
        CheckoutGetQueryData,
        CheckoutGetQueryVariables
      >({
        query: CheckoutGetQuery({
          checkoutFragment:
            this.mainAdapter.additionalOptions.fragments.checkoutFragment,
          contextOptions: this.mainAdapter.getContextOptions(),
        }),
        variables: { id: storedCheckoutId },
      })

      if (responseGetCheckout.errors?.length) {
        return {
          raw: { getCheckout: responseGetCheckout },
          error: new Error(responseGetCheckout.errors[0].message),
        }
      }

      if (!responseGetCheckout.data) {
        return {
          raw: { getCheckout: responseGetCheckout },
          error: new Error('getCheckout data is not defined'),
        }
      }

      if (responseGetCheckout.data.node == null) {
        return createCheckout({ input: {} })
      }

      return {
        data: {
          items: lineItemsToMakairaCartItems(
            responseGetCheckout.data.node.lineItems
          ),
        },
        raw: { getCheckout: responseGetCheckout },
      }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }

  addItem: MakairaAddItemToCart<unknown, ShopifyAddItemRaw, Error> = async ({
    input: { product, quantity },
  }) => {
    try {
      const lineItems: LineItemInput[] = [
        {
          merchandiseId: this.transformToShopifyVariantId(product.id),
          attributes: product.attributes?.filter((att) => att.value !== ''),
          quantity,
        },
      ]

      const shopInstanceIdentifier = await digest(
        this.mainAdapter.additionalOptions.url
      )
      const checkoutId = this.getCheckoutId(shopInstanceIdentifier)

      if (!checkoutId) {
        const responseCheckoutCreate = await this.createCheckoutAndStoreId({
          input: { lineItems },
        })

        if (responseCheckoutCreate.error || !responseCheckoutCreate.data) {
          return {
            error: responseCheckoutCreate.error,
            raw: { checkoutCreate: responseCheckoutCreate.raw.createCheckout },
          }
        }

        const data: MakairaAddItemToCartResData = {
          items: lineItemsToMakairaCartItems(
            responseCheckoutCreate.data.checkout.lineItems
          ),
        }

        const raw: ShopifyAddItemRaw = {
          checkoutCreate: responseCheckoutCreate.raw.createCheckout,
        }

        this.mainAdapter.dispatchEvent(
          new CartAddItemEvent<ShopifyAddItemRaw>(data, raw)
        )

        return { data, raw }
      }

      const responseCheckoutLineItemsAdd = await this.mainAdapter.fetchFromShop<
        CheckoutLineItemsAddMutationData,
        CheckoutLineItemsAddMutationVariables
      >({
        query: CheckoutLineItemsAddMutation({
          checkoutFragment:
            this.mainAdapter.additionalOptions.fragments.checkoutFragment,
          checkoutUserErrorFragment:
            this.mainAdapter.additionalOptions.fragments
              .checkoutUserErrorFragment,
          contextOptions: this.mainAdapter.getContextOptions(),
        }),
        variables: { cartId: checkoutId, lines: lineItems },
      })

      if (responseCheckoutLineItemsAdd.errors?.length) {
        return {
          raw: { checkoutLineItemsAdd: responseCheckoutLineItemsAdd },
          error: new Error(responseCheckoutLineItemsAdd.errors[0].message),
        }
      }

      if (!responseCheckoutLineItemsAdd.data) {
        return {
          raw: { checkoutLineItemsAdd: responseCheckoutLineItemsAdd },
          error: new Error('checkoutLineItemsAdd is not defined'),
        }
      }

      if (
        responseCheckoutLineItemsAdd.data.checkoutLineItemsAdd.userErrors
          .length > 0
      ) {
        return {
          raw: { checkoutLineItemsAdd: responseCheckoutLineItemsAdd },
          error: new Error(
            responseCheckoutLineItemsAdd.data.checkoutLineItemsAdd.userErrors[0].message
          ),
        }
      }

      const data: MakairaAddItemToCartResData = {
        items: lineItemsToMakairaCartItems(
          responseCheckoutLineItemsAdd.data.checkoutLineItemsAdd.checkout
            .lineItems
        ),
      }

      const raw: ShopifyAddItemRaw = {
        checkoutLineItemsAdd: responseCheckoutLineItemsAdd,
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
      const checkoutId = this.getCheckoutId(shopInstanceIdentifier)

      if (!checkoutId) {
        const responseCheckoutCreate = await this.createCheckoutAndStoreId({
          input: {},
        })

        if (responseCheckoutCreate.error || !responseCheckoutCreate.data) {
          return {
            error: responseCheckoutCreate.error,
            raw: {
              checkoutCreate: responseCheckoutCreate.raw.createCheckout,
            },
          }
        }

        const data: MakairaRemoveItemFromCartResData = {
          items: lineItemsToMakairaCartItems(
            responseCheckoutCreate.data.checkout.lineItems
          ),
        }

        const raw: ShopifyRemoveItemRaw = {
          checkoutCreate: responseCheckoutCreate.raw.createCheckout,
        }

        this.mainAdapter.dispatchEvent(
          new CartRemoveItemEvent<ShopifyRemoveItemRaw>(data, raw)
        )

        return { data, raw }
      }

      const responseCheckoutLineItemsRemove =
        await this.mainAdapter.fetchFromShop<
          CheckoutLineItemsRemoveMutationData,
          CheckoutLineItemsRemoveMutationVariables
        >({
          query: CheckoutLineItemsRemoveMutation({
            checkoutFragment:
              this.mainAdapter.additionalOptions.fragments.checkoutFragment,
            checkoutUserErrorFragment:
              this.mainAdapter.additionalOptions.fragments
                .checkoutUserErrorFragment,
            contextOptions: this.mainAdapter.getContextOptions(),
          }),
          variables: { cartId: checkoutId, lineIds: lineItemIds },
        })

      if (responseCheckoutLineItemsRemove.errors?.length) {
        return {
          raw: { checkoutLineItemsRemove: responseCheckoutLineItemsRemove },
          error: new Error(responseCheckoutLineItemsRemove.errors[0].message),
        }
      }

      if (!responseCheckoutLineItemsRemove.data) {
        return {
          raw: { checkoutLineItemsRemove: responseCheckoutLineItemsRemove },
          error: new Error('checkoutLineItemsRemove is not defined'),
        }
      }

      if (
        responseCheckoutLineItemsRemove.data.checkoutLineItemsRemove.userErrors
          .length > 0
      ) {
        return {
          raw: { checkoutLineItemsRemove: responseCheckoutLineItemsRemove },
          error: new Error(
            responseCheckoutLineItemsRemove.data.checkoutLineItemsRemove.userErrors[0].message
          ),
        }
      }

      const data: MakairaRemoveItemFromCartResData = {
        items: lineItemsToMakairaCartItems(
          responseCheckoutLineItemsRemove.data.checkoutLineItemsRemove.checkout
            .lineItems
        ),
      }

      const raw: ShopifyRemoveItemRaw = {
        checkoutLineItemsRemove: responseCheckoutLineItemsRemove,
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
      const checkoutId = this.getCheckoutId(shopInstanceIdentifier)

      if (!checkoutId) {
        const responseCheckoutCreate = await this.createCheckoutAndStoreId({
          input: {
            lineItems: [
              {
                quantity,
                merchandiseId: this.transformToShopifyVariantId(product.id),
                attributes: product.attributes?.filter(
                  (att) => att.value !== ''
                ),
              },
            ],
          },
        })

        if (responseCheckoutCreate.error || !responseCheckoutCreate.data) {
          return {
            error: responseCheckoutCreate.error,
            raw: {
              checkoutCreate: responseCheckoutCreate.raw.createCheckout,
            },
          }
        }

        const data: MakairaUpdateItemFromCartResData = {
          items: lineItemsToMakairaCartItems(
            responseCheckoutCreate.data.checkout.lineItems
          ),
        }

        const raw: ShopifyUpdateItemRaw = {
          checkoutCreate: responseCheckoutCreate.raw.createCheckout,
        }

        this.mainAdapter.dispatchEvent(
          new CartUpdateItemEvent<ShopifyUpdateItemRaw>(data, raw)
        )

        return { data, raw }
      }

      const responseCheckoutLineItemsUpdate =
        await this.mainAdapter.fetchFromShop<
          CheckoutLineItemsUpdateMutationData,
          CheckoutLineItemsUpdateMutationVariables
        >({
          query: CheckoutLineItemsUpdateMutation({
            checkoutFragment:
              this.mainAdapter.additionalOptions.fragments.checkoutFragment,
            checkoutUserErrorFragment:
              this.mainAdapter.additionalOptions.fragments
                .checkoutUserErrorFragment,
            contextOptions: this.mainAdapter.getContextOptions(),
          }),
          variables: {
            cartId: checkoutId,
            lines: [
              {
                id: lineItemId,
                merchandiseId: this.transformToShopifyVariantId(product.id),
                quantity,
              },
            ],
          },
        })

      if (responseCheckoutLineItemsUpdate.errors?.length) {
        return {
          raw: { checkoutLineItemsUpdate: responseCheckoutLineItemsUpdate },
          error: new Error(responseCheckoutLineItemsUpdate.errors[0].message),
        }
      }

      if (!responseCheckoutLineItemsUpdate.data) {
        return {
          raw: { checkoutLineItemsUpdate: responseCheckoutLineItemsUpdate },
          error: new Error('checkoutLineItemsUpdate is not defined'),
        }
      }

      if (
        responseCheckoutLineItemsUpdate.data.checkoutLineItemsUpdate.userErrors
          .length > 0
      ) {
        return {
          raw: { checkoutLineItemsUpdate: responseCheckoutLineItemsUpdate },
          error: new Error(
            responseCheckoutLineItemsUpdate.data.checkoutLineItemsUpdate.userErrors[0].message
          ),
        }
      }

      const data: MakairaUpdateItemFromCartResData = {
        items: lineItemsToMakairaCartItems(
          responseCheckoutLineItemsUpdate.data.checkoutLineItemsUpdate.checkout
            .lineItems
        ),
      }

      const raw: ShopifyUpdateItemRaw = {
        checkoutLineItemsUpdate: responseCheckoutLineItemsUpdate,
      }

      this.mainAdapter.dispatchEvent(
        new CartUpdateItemEvent<ShopifyUpdateItemRaw>(data, raw)
      )

      return { data, raw, error: undefined }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }

  public createCheckoutAndStoreId: MakairaShopProviderInteractor<
    CheckoutCreateMutationVariables['input'],
    CheckoutCreateMutationData['getCheckout'],
    { createCheckout: GraphqlResWithError<CheckoutCreateMutationData> },
    Error
  > = async (variables) => {
    const responseCreateCheckout = await this.mainAdapter.fetchFromShop<
      CheckoutCreateMutationData,
      CheckoutCreateMutationVariables
    >({
      query: CheckoutCreateMutation({
        checkoutFragment:
          this.mainAdapter.additionalOptions.fragments.checkoutFragment,
        checkoutUserErrorFragment:
          this.mainAdapter.additionalOptions.fragments
            .checkoutUserErrorFragment,
        contextOptions: this.mainAdapter.getContextOptions(),
      }),
      variables,
    })

    if (responseCreateCheckout.errors?.length) {
      return {
        raw: { createCheckout: responseCreateCheckout },
        error: new Error(responseCreateCheckout.errors[0].message),
      }
    }

    if (!responseCreateCheckout.data) {
      return {
        raw: { createCheckout: responseCreateCheckout },
        error: new Error('checkoutCreate is not defined'),
      }
    }

    if (responseCreateCheckout.data.getCheckout.userErrors.length > 0) {
      return {
        raw: { createCheckout: responseCreateCheckout },
        error: new Error(
          responseCreateCheckout.data.getCheckout.userErrors[0].message
        ),
      }
    }

    const shopInstanceIdentifier = await digest(
      this.mainAdapter.additionalOptions.url
    )
    this.setCheckoutId(
      responseCreateCheckout.data.getCheckout.checkout.id,
      shopInstanceIdentifier
    )

    return {
      data: responseCreateCheckout.data.getCheckout,
      raw: { createCheckout: responseCreateCheckout },
    }
  }

  private transformToShopifyVariantId(productId: string) {
    if (productId.startsWith('gid://')) {
      return btoa(productId)
    }

    return btoa(`gid://shopify/ProductVariant/${productId}`)
  }

  private getCheckoutId(instanceIdentifier: string) {
    return this.mainAdapter.additionalOptions.storage.getItem(
      `${this.STORAGE_KEY_CHECKOUT_ID}-${instanceIdentifier}`
    )
  }

  private setCheckoutId(id: string, instanceIdentifier: string) {
    return this.mainAdapter.additionalOptions.storage.setItem(
      `${this.STORAGE_KEY_CHECKOUT_ID}-${instanceIdentifier}`,
      id
    )
  }
}
