import {
  MakairaForgotPassword,
  MakairaGetUser,
  MakairaLogin,
  MakairaLogout,
  MakairaShopProviderInteractor,
  MakairaShopProviderUser,
  MakairaSignup,
  MakairaSignupResData,
  UserLoginEvent,
  UserLogoutEvent,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterShopify } from './main'
import {
  GraphqlResWithError,
  ShopifyForgotPasswordRaw,
  ShopifyGetUserRaw,
  ShopifyLoginRaw,
  ShopifyLogoutRaw,
  ShopifySignupRaw,
} from '../types'
import {
  CustomerAccessTokenCreateMutation,
  CustomerAccessTokenCreateMutationData,
  CustomerAccessTokenCreateMutationVariables,
  CustomerAccessTokenDeleteMutation,
  CustomerAccessTokenDeleteMutationData,
  CustomerAccessTokenDeleteMutationVariables,
  CustomerCreateMutation,
  CustomerCreateMutationData,
  CustomerCreateMutationVariables,
  CustomerQuery,
  CustomerQueryData,
  CustomerQueryVariables,
  CustomerRecoverMutation,
  CustomerRecoverMutationData,
  CustomerRecoverMutationVariables,
} from './user.queries'

export class StorefrontShopAdapterShopifyUser
  implements MakairaShopProviderUser
{
  STORAGE_KEY_CUSTOMER_ACCESS_TOKEN = 'makaira-shop-shopify-user-access-token'

  STORAGE_KEY_CUSTOMER_ACCESS_TOKEN_EXPIRES_AT =
    'makaira-shop-shopify-user-access-token-expires-at'

  constructor(private mainAdapter: StorefrontShopAdapterShopify) {}

  login: MakairaLogin<unknown, ShopifyLoginRaw, Error> = async ({
    input: { password, username },
  }) => {
    try {
      const responseCustomerAccessToken =
        await this.receiveAndStoreCustomerAccessToken({
          input: { password, username },
        })

      // For typescript safety it could be that raw is not defined.
      // But we need it in the response afterwards.
      if (!responseCustomerAccessToken.raw?.customerAccessToken) {
        return { raw: {}, error: responseCustomerAccessToken.error }
      }

      if (responseCustomerAccessToken.error) {
        return {
          data: undefined,
          error: responseCustomerAccessToken.error,
          raw: { login: responseCustomerAccessToken.raw.customerAccessToken },
        }
      }

      if (!responseCustomerAccessToken.data) {
        return {
          data: undefined,
          error: new Error('customerAccessToken is not defined'),
          raw: { login: responseCustomerAccessToken.raw.customerAccessToken },
        }
      }

      /* Shopify does not return a user object after successful login.
       * But the login function should always return this, so we have to additionally
       * fetch it after successful login.
       */
      const {
        error: errorGetUser,
        raw: rawGetUser,
        data: dataGetUser,
      } = await this.getUser({
        input: {},
      })

      const raw: ShopifyLoginRaw = {
        login: responseCustomerAccessToken.raw.customerAccessToken,
        getUser: rawGetUser?.getUser,
      }

      if (dataGetUser) {
        const data = { user: dataGetUser.user }

        this.mainAdapter.dispatchEvent(
          new UserLoginEvent<ShopifyLoginRaw>(data, raw)
        )

        return { data, raw, error: undefined }
      }

      return { data: undefined, raw, error: errorGetUser }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }

  logout: MakairaLogout<unknown, ShopifyLogoutRaw, Error> = async () => {
    try {
      const { customerAccessToken } = this.getCustomerAccessToken()

      if (!customerAccessToken) {
        return { raw: {} }
      }

      const responseLogout = await this.mainAdapter.fetchFromShop<
        CustomerAccessTokenDeleteMutationData,
        CustomerAccessTokenDeleteMutationVariables
      >({
        query: CustomerAccessTokenDeleteMutation({
          userErrorFragment:
            this.mainAdapter.additionalOptions.fragments.userErrorFragment,
        }),
        variables: { customerAccessToken },
      })

      if (responseLogout.errors?.length) {
        return {
          raw: { logout: responseLogout },
          error: new Error(responseLogout.errors[0].message),
        }
      }

      if (!responseLogout.data) {
        return {
          raw: { logout: responseLogout },
          error: new Error('customerAccessTokenDelete is not defined'),
        }
      }

      if (responseLogout.data.customerAccessTokenDelete.userErrors.length > 0) {
        return {
          raw: { logout: responseLogout },
          error: new Error(
            responseLogout.data.customerAccessTokenDelete.userErrors[0].message
          ),
        }
      }

      this.mainAdapter.dispatchEvent(
        new UserLogoutEvent<ShopifyLogoutRaw>(undefined, {
          logout: responseLogout,
        })
      )

      return { raw: { logout: responseLogout } }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }

  signup: MakairaSignup<unknown, ShopifySignupRaw, Error> = async ({
    input: { password, username },
  }) => {
    try {
      const responseSignup = await this.mainAdapter.fetchFromShop<
        CustomerCreateMutationData,
        CustomerCreateMutationVariables
      >({
        query: CustomerCreateMutation({
          customerFragment:
            this.mainAdapter.additionalOptions.fragments.customerFragment,
          customerUserErrorFragment:
            this.mainAdapter.additionalOptions.fragments
              .customerUserErrorFragment,
        }),
        variables: { input: { email: username, password } },
      })

      if (responseSignup.errors?.length) {
        return {
          raw: { signup: responseSignup },
          error: new Error(responseSignup.errors[0].message),
        }
      }

      if (!responseSignup.data) {
        return {
          raw: { signup: responseSignup },
          error: new Error('customerCreate is not defined'),
        }
      }

      if (responseSignup.data.customerCreate.customerUserErrors.length > 0) {
        return {
          raw: { signup: responseSignup },
          error: new Error(
            responseSignup.data.customerCreate.customerUserErrors[0].message
          ),
        }
      }

      /* Shopify does not return the accessToken after successful signup.
       * But we need to set it for logout and to get the user after a reload
       */

      const responseCustomerAccessToken =
        await this.receiveAndStoreCustomerAccessToken({
          input: { password, username },
        })

      if (responseCustomerAccessToken.error) {
        return {
          raw: {
            signup: responseSignup,
            customerAccessToken:
              responseCustomerAccessToken.raw?.customerAccessToken,
          },
          error: responseCustomerAccessToken.error,
        }
      }

      if (!responseCustomerAccessToken.data) {
        return {
          raw: {
            signup: responseSignup,
            login: responseCustomerAccessToken.raw,
          },
          error: new Error('customerAccessTokenCreate data is not defined'),
        }
      }

      const raw: ShopifySignupRaw = {
        signup: responseSignup,
        customerAccessToken:
          responseCustomerAccessToken.raw?.customerAccessToken,
      }

      const data: MakairaSignupResData = {
        user: {
          id: responseSignup.data.customerCreate.customer.id,
          firstname:
            responseSignup.data.customerCreate.customer.firstName ?? '',
          lastname: responseSignup.data.customerCreate.customer.lastName ?? '',
          email: responseSignup.data.customerCreate.customer.email ?? '',
        },
      }

      this.mainAdapter.dispatchEvent(
        new UserLoginEvent<ShopifySignupRaw>(data, raw)
      )

      return { data, raw }
    } catch (e) {
      return { raw: {}, error: e as Error }
    }
  }

  getUser: MakairaGetUser<unknown, ShopifyGetUserRaw, Error> = async () => {
    try {
      const { customerAccessToken } = this.getCustomerAccessToken()

      if (!customerAccessToken) {
        return { raw: {} }
      }

      const responseGetUser = await this.mainAdapter.fetchFromShop<
        CustomerQueryData,
        CustomerQueryVariables
      >({
        query: CustomerQuery({
          customerFragment:
            this.mainAdapter.additionalOptions.fragments.customerFragment,
        }),
        variables: { customerAccessToken },
      })

      if (responseGetUser.errors || !responseGetUser.data) {
        return {
          raw: { getUser: responseGetUser },
          error: responseGetUser.errors
            ? new Error(responseGetUser.errors[0].message)
            : new Error('customer is not defined'),
        }
      }

      return {
        data: {
          user: {
            id: responseGetUser.data.customer.id,
            firstname: responseGetUser.data.customer.firstName ?? '',
            lastname: responseGetUser.data.customer.lastName ?? '',
            email: responseGetUser.data.customer.email ?? '',
          },
        },
        raw: { getUser: responseGetUser },
        error: undefined,
      }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }

  forgotPassword: MakairaForgotPassword<
    unknown,
    ShopifyForgotPasswordRaw,
    Error
  > = async ({ input: { username } }) => {
    try {
      const responseCustomerRecover = await this.mainAdapter.fetchFromShop<
        CustomerRecoverMutationData,
        CustomerRecoverMutationVariables
      >({
        query: CustomerRecoverMutation({
          customerUserErrorFragment:
            this.mainAdapter.additionalOptions.fragments
              .customerUserErrorFragment,
        }),
        variables: { email: username },
      })

      if (responseCustomerRecover.errors?.length) {
        return {
          raw: { forgotPassword: responseCustomerRecover },
          error: new Error(responseCustomerRecover.errors[0].message),
        }
      }

      if (!responseCustomerRecover.data) {
        return {
          raw: { forgotPassword: responseCustomerRecover },
          error: new Error('customerRecover is not defined'),
        }
      }

      if (
        responseCustomerRecover.data.customerRecover.customerUserErrors.length >
        0
      ) {
        return {
          raw: { forgotPassword: responseCustomerRecover },
          error: new Error(
            responseCustomerRecover.data.customerRecover.customerUserErrors[0].message
          ),
        }
      }

      return {
        raw: { forgotPassword: responseCustomerRecover },
        data: undefined,
        error: undefined,
      }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }

  private getCustomerAccessToken(): {
    customerAccessToken?: string
    expiresAt?: string
  } {
    const customerAccessToken =
      this.mainAdapter.additionalOptions.storage.getItem(
        this.STORAGE_KEY_CUSTOMER_ACCESS_TOKEN
      )

    const expiresAt = this.mainAdapter.additionalOptions.storage.getItem(
      this.STORAGE_KEY_CUSTOMER_ACCESS_TOKEN_EXPIRES_AT
    )

    if (!customerAccessToken || !expiresAt) {
      return {}
    }

    const expiry = new Date(expiresAt)

    if (expiry.getTime() < Date.now()) {
      return {}
    }

    return { customerAccessToken, expiresAt }
  }

  private setCustomerAccessToken({
    customerAccessToken,
    expiresAt,
  }: {
    customerAccessToken: string
    expiresAt: string
  }) {
    this.mainAdapter.additionalOptions.storage.setItem(
      this.STORAGE_KEY_CUSTOMER_ACCESS_TOKEN,
      customerAccessToken
    )

    this.mainAdapter.additionalOptions.storage.setItem(
      this.STORAGE_KEY_CUSTOMER_ACCESS_TOKEN_EXPIRES_AT,
      expiresAt
    )
  }

  private receiveAndStoreCustomerAccessToken: MakairaShopProviderInteractor<
    { username: string; password: string },
    { customerAccessToken: string; expiresAt: string },
    {
      customerAccessToken?: GraphqlResWithError<CustomerAccessTokenCreateMutationData>
    },
    Error
  > = async ({ input: { username, password } }) => {
    try {
      const responseCustomerAccessToken = await this.mainAdapter.fetchFromShop<
        CustomerAccessTokenCreateMutationData,
        CustomerAccessTokenCreateMutationVariables
      >({
        query: CustomerAccessTokenCreateMutation({
          customerUserErrorFragment:
            this.mainAdapter.additionalOptions.fragments
              .customerUserErrorFragment,
        }),
        variables: { input: { email: username, password } },
      })

      if (responseCustomerAccessToken.errors?.length) {
        return {
          raw: { customerAccessToken: responseCustomerAccessToken },
          error: new Error(responseCustomerAccessToken.errors[0].message),
        }
      }

      if (!responseCustomerAccessToken.data) {
        return {
          raw: { customerAccessToken: responseCustomerAccessToken },
          error: new Error('customerAccessTokenCreate is not defined'),
        }
      }

      if (
        responseCustomerAccessToken.data.customerAccessTokenCreate
          .customerUserErrors.length > 0
      ) {
        return {
          raw: { customerAccessToken: responseCustomerAccessToken },
          error: new Error(
            responseCustomerAccessToken.data.customerAccessTokenCreate.customerUserErrors[0].message
          ),
        }
      }

      this.setCustomerAccessToken({
        customerAccessToken:
          responseCustomerAccessToken.data.customerAccessTokenCreate
            .customerAccessToken.accessToken,
        expiresAt:
          responseCustomerAccessToken.data.customerAccessTokenCreate
            .customerAccessToken.expiresAt,
      })

      return {
        data: {
          customerAccessToken:
            responseCustomerAccessToken.data.customerAccessTokenCreate
              .customerAccessToken.accessToken,
          expiresAt:
            responseCustomerAccessToken.data.customerAccessTokenCreate
              .customerAccessToken.expiresAt,
        },
        raw: { customerAccessToken: responseCustomerAccessToken },
        error: undefined,
      }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }
}
