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

      if (status !== 200 || response.ok === false) {
        return {
          data: undefined,
          raw: { login: response },
          error:
            response.ok === false
              ? new Error(
                  (response as { message?: string }).message ?? 'Unknown error'
                )
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

      if (status !== 200 || response.ok === false) {
        return {
          data: undefined,
          raw: { logout: response },
          error: new BadHttpStatusError(),
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
  > = async ({ input }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareSignupRes>({
          method: 'POST',
          path: USER_SIGNUP,
          body: input,
        })

      if (status !== 200 || response.ok === false) {
        return {
          data: undefined,
          raw: { signup: response },
          error: new BadHttpStatusError(),
        }
      }

      this.mainAdapter.dispatchEvent(
        new UserSignupEvent<ShopwareSignupRaw>(
          {
            user: {
              id: response.id,
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
      if ((response as { ok: boolean }).ok === false) {
        return {
          data: undefined,
          raw: { getUser: response },
          error: undefined,
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
            id: (response as ShopwareUser).id,
            firstname: (response as ShopwareUser).firstName,
            lastname: (response as ShopwareUser).lastName,
            email: (response as ShopwareUser).email,
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
  > = async ({ input: { email, storefrontUrl } }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareForgotPasswordRes>({
          method: 'POST',
          path: USER_PASSWORD_RECOVERY,
          body: {
            email,
            storefrontUrl,
          },
        })

      if (status !== 200 || response.ok === false) {
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
