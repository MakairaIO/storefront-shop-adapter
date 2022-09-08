import {
  CartAddItemEvent,
  CartRemoveItemEvent,
  CartUpdateItemEvent,
  MakairaAddItemToCart,
  MakairaAddItemToCartResData,
  MakairaGetCart,
  MakairaGetCartResData,
  MakairaRemoveItemFromCart,
  MakairaRemoveItemFromCartResData,
  MakairaShopProviderCart,
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
  CheckoutFragmentData,
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

export class StorefrontShopAdapterShopifyCart
  implements MakairaShopProviderCart
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
            items: this.lineItemsToMakairaCartItems(
              createCheckoutResponse.data.checkout.lineItems
            ),
          },
          raw: { createCheckout: createCheckoutResponse.raw.createCheckout },
        }
      }

      const storedCheckoutId = this.getCheckoutId()

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

      if (responseGetCheckout.data.node.completedAt) {
        return createCheckout({ input: {} })
      }

      return {
        data: {
          items: this.lineItemsToMakairaCartItems(
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
          variantId: this.transformToShopifyVariantId(product.id),
          customAttributes: product.attributes,
          quantity,
        },
      ]

      const checkoutId = this.getCheckoutId()

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
          items: this.lineItemsToMakairaCartItems(
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
        }),
        variables: { checkoutId, lineItems },
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
        responseCheckoutLineItemsAdd.data.checkoutLineItemsAdd
          .checkoutUserErrors.length > 0
      ) {
        return {
          raw: { checkoutLineItemsAdd: responseCheckoutLineItemsAdd },
          error: new Error(
            responseCheckoutLineItemsAdd.data.checkoutLineItemsAdd.checkoutUserErrors[0].message
          ),
        }
      }

      const data: MakairaAddItemToCartResData = {
        items: this.lineItemsToMakairaCartItems(
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
      const checkoutId = this.getCheckoutId()

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
          items: this.lineItemsToMakairaCartItems(
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
          }),
          variables: { checkoutId, lineItemIds },
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
        responseCheckoutLineItemsRemove.data.checkoutLineItemsRemove
          .checkoutUserErrors.length > 0
      ) {
        return {
          raw: { checkoutLineItemsRemove: responseCheckoutLineItemsRemove },
          error: new Error(
            responseCheckoutLineItemsRemove.data.checkoutLineItemsRemove.checkoutUserErrors[0].message
          ),
        }
      }

      const data: MakairaRemoveItemFromCartResData = {
        items: this.lineItemsToMakairaCartItems(
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

  updateItem: MakairaUpdateItemFromCart<unknown, ShopifyUpdateItemRaw, Error> =
    async ({ input: { product, quantity } }) => {
      try {
        const checkoutId = this.getCheckoutId()

        if (!checkoutId) {
          const responseCheckoutCreate = await this.createCheckoutAndStoreId({
            input: {
              lineItems: [
                {
                  quantity,
                  variantId: this.transformToShopifyVariantId(product.id),
                  customAttributes: product.attributes,
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
            items: this.lineItemsToMakairaCartItems(
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
            }),
            variables: {
              checkoutId,
              lineItems: [
                {
                  variantId: this.transformToShopifyVariantId(product.id),
                  customAttributes: product.attributes,
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
          responseCheckoutLineItemsUpdate.data.checkoutLineItemsUpdate
            .checkoutUserErrors.length > 0
        ) {
          return {
            raw: { checkoutLineItemsUpdate: responseCheckoutLineItemsUpdate },
            error: new Error(
              responseCheckoutLineItemsUpdate.data.checkoutLineItemsUpdate.checkoutUserErrors[0].message
            ),
          }
        }

        const data: MakairaUpdateItemFromCartResData = {
          items: this.lineItemsToMakairaCartItems(
            responseCheckoutLineItemsUpdate.data.checkoutLineItemsUpdate
              .checkout.lineItems
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

  private createCheckoutAndStoreId: MakairaShopProviderInteractor<
    CheckoutCreateMutationVariables['input'],
    CheckoutCreateMutationData['checkoutCreate'],
    { createCheckout: GraphqlResWithError<CheckoutCreateMutationData> },
    Error
  > = async ({ input }) => {
    const variables = { input }

    if (this.mainAdapter.getCurrency() !== null) {
      variables.input.presentmentCurrencyCode = this.mainAdapter.getCurrency()
    }

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

    if (
      responseCreateCheckout.data.checkoutCreate.checkoutUserErrors.length > 0
    ) {
      return {
        raw: { createCheckout: responseCreateCheckout },
        error: new Error(
          responseCreateCheckout.data.checkoutCreate.checkoutUserErrors[0].message
        ),
      }
    }

    this.setCheckoutId(responseCreateCheckout.data.checkoutCreate.checkout.id)

    return {
      data: responseCreateCheckout.data.checkoutCreate,
      raw: { createCheckout: responseCreateCheckout },
    }
  }

  private lineItemsToMakairaCartItems(
    lineItems: CheckoutFragmentData['lineItems']
  ): MakairaGetCartResData['items'] {
    return lineItems.edges.map(({ node }) => ({
      product: {
        id: node.id,
        images: node.variant?.product.featuredImage.url
          ? [node.variant?.product.featuredImage.url]
          : [],
        price: node.variant?.priceV2.amount ?? 0,
        title: node.title,
        url: '', // TODO
        attributes: node.customAttributes,
      },
      quantity: node.quantity,
    }))
  }

  private transformToShopifyVariantId(productId: string) {
    if (productId.startsWith('gid://')) {
      return btoa(productId)
    }

    return btoa(`gid://shopify/ProductVariant/${productId}`)
  }

  private getCheckoutId() {
    return this.mainAdapter.additionalOptions.storage.getItem(
      this.STORAGE_KEY_CHECKOUT_ID
    )
  }

  private setCheckoutId(id: string) {
    return this.mainAdapter.additionalOptions.storage.setItem(
      this.STORAGE_KEY_CHECKOUT_ID,
      id
    )
  }
}
