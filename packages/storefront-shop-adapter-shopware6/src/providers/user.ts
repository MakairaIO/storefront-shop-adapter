import {
  BadHttpStatusError,
  MakairaForgotPassword,
  MakairaGetUser,
  MakairaLogin,
  MakairaLogout,
  MakairaShopProviderUser,
  MakairaSignup,
  UserLoginEvent,
  UserLogoutEvent,
  UserSignupEvent,
} from '@makaira/storefront-types'
import {
  USER_LOGIN,
  USER_GET,
  USER_LOGOUT,
  USER_PASSWORD_RECOVERY,
  USER_SIGNUP,
} from '../paths'
import {
  ShopwareForgotPasswordRes,
  ShopwareGetUserRaw,
  ShopwareGetUserRes,
  ShopwareLoginRaw,
  ShopwareLoginRes,
  ShopwareLogoutRaw,
  ShopwareLogoutRes,
  ShopwareUser,
  ShopwareForgotPasswordRaw,
  ShopwareForgotPasswordAdditionalInput,
  ShopwareSignupAdditionalInput,
  ShopwareSignupRaw,
  ShopwareSignupRes,
} from '../types'
import { StorefrontShopAdapterShopware6 } from './main'

export class StorefrontShopAdapterShopware6User
  implements MakairaShopProviderUser
{
  constructor(private mainAdapter: StorefrontShopAdapterShopware6) {}

  login: MakairaLogin<unknown, ShopwareLoginRaw, Error> = async ({
    input: { password, username },
  }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareLoginRes>({
          method: 'POST',
          path: USER_LOGIN,
          body: {
            password,
            username,
          },
        })

      if (
        status !== 200 ||
        (Array.isArray(response.errors) && response.errors.length > 0)
      ) {
        return {
          data: undefined,
          raw: { login: response },
          error:
            Array.isArray(response.errors) && response.errors.length > 0
              ? new Error(response.errors[0].detail)
              : new BadHttpStatusError(),
        }
      }

      /* The Shopware-Plugin does not return a user object after successful login.
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

      const raw: ShopwareLoginRaw = {
        login: response,
        getUser: rawGetUser?.getUser,
      }

      if (dataGetUser) {
        const data = { user: dataGetUser.user }

        this.mainAdapter.dispatchEvent(
          new UserLoginEvent<ShopwareLoginRaw>(data, raw)
        )

        return { data, raw, error: undefined }
      }

      return { data: undefined, raw, error: errorGetUser }
    } catch (e) {
      return {
        data: undefined,
        raw: { getUser: undefined, login: undefined },
        error: e as Error,
      }
    }
  }

  logout: MakairaLogout<unknown, ShopwareLogoutRaw, Error> = async () => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareLogoutRes>({
          method: 'POST',
          path: USER_LOGOUT,
        })

      if (
        status !== 200 ||
        (Array.isArray(response.errors) && response.errors.length > 0)
      ) {
        return {
          data: undefined,
          raw: { logout: response },
          error:
            Array.isArray(response.errors) && response.errors.length > 0
              ? new Error(response.errors[0].detail)
              : new BadHttpStatusError(),
        }
      }

      this.mainAdapter.dispatchEvent(
        new UserLogoutEvent<ShopwareLogoutRaw>(undefined, { logout: response })
      )

      return { data: undefined, raw: { logout: response }, error: undefined }
    } catch (e) {
      return {
        data: undefined,
        raw: { logout: undefined },
        error: e as Error,
      }
    }
  }

  signup: MakairaSignup<
    ShopwareSignupAdditionalInput,
    ShopwareSignupRaw,
    Error
  > = async ({ input: { username, ...rest } }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareSignupRes>({
          method: 'POST',
          path: USER_SIGNUP,
          body: {
            email: username,
            ...rest,
          },
        })

      if (
        status !== 200 ||
        (Array.isArray(response.errors) && response.errors.length > 0)
      ) {
        return {
          data: undefined,
          raw: { signup: response },
          error:
            Array.isArray(response.errors) && response.errors.length > 0
              ? new Error(response.errors[0].detail)
              : new BadHttpStatusError(),
        }
      }

      this.mainAdapter.dispatchEvent(
        new UserSignupEvent<ShopwareSignupRaw>(
          {
            user: {
              id: response.id || response.customerNumber,
              firstname: response.firstName,
              lastname: response.lastName,
              email: response.email,
            },
          },
          { signup: response }
        )
      )

      return { data: undefined, raw: { signup: response }, error: undefined }
    } catch (e) {
      return {
        data: undefined,
        raw: { signup: undefined },
        error: e as Error,
      }
    }
  }

  getUser: MakairaGetUser<unknown, ShopwareGetUserRaw, Error> = async () => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareGetUserRes>({
          method: 'POST',
          path: USER_GET,
        })

      // shopware6 returns an 403 if no user is logged in.
      // Or it returns ok=false when no user is logged in.
      // Therefore return an empty user without error
      if (
        status !== 200 ||
        (Array.isArray(response.errors) && response.errors.length > 0)
      ) {
        return {
          data: undefined,
          raw: { getUser: response },
          error:
            Array.isArray(response.errors) && response.errors.length > 0
              ? new Error(response.errors[0].detail)
              : new BadHttpStatusError(),
        }
      }

      if (status !== 200) {
        return {
          data: undefined,
          raw: { getUser: response },
          error: new BadHttpStatusError(),
        }
      }

      return {
        data: {
          user: {
            id: response.id || response.customerNumber,
            firstname: response.firstName,
            lastname: response.lastName,
            email: response.email,
          },
        },
        raw: { getUser: response },
        error: undefined,
      }
    } catch (e) {
      return { data: undefined, raw: { getUser: undefined }, error: e as Error }
    }
  }

  forgotPassword: MakairaForgotPassword<
    ShopwareForgotPasswordAdditionalInput,
    ShopwareForgotPasswordRaw,
    Error
  > = async ({ input: { username, storefrontUrl } }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareForgotPasswordRes>({
          method: 'POST',
          path: USER_PASSWORD_RECOVERY,
          body: {
            email: username,
            storefrontUrl,
          },
        })

      if (status !== 200 || !response.success) {
        return {
          data: undefined,
          raw: { forgotPassword: response },
          error: new BadHttpStatusError(),
        }
      }

      return {
        data: undefined,
        raw: { forgotPassword: response },
        error: undefined,
      }
    } catch (e) {
      return {
        data: undefined,
        raw: { forgotPassword: undefined },
        error: e as Error,
      }
    }
  }
}
