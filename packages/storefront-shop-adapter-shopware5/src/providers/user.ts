import {
  BadHttpStatusError,
  MakairaForgotPassword,
  MakairaGetUser,
  MakairaLogin,
  MakairaLogout,
  MakairaShopProviderUser,
  MakairaSignup,
  NotImplementedError,
  UserLoginEvent,
  UserLogoutEvent,
} from '@makaira/storefront-types'
import {
  USER_ACTION_GET_CURRENT,
  USER_ACTION_LOGIN,
  USER_ACTION_LOGOUT,
  USER_PATH,
} from '../paths'
import {
  ShopwareGetUserRaw,
  ShopwareGetUserRes,
  ShopwareLoginRaw,
  ShopwareLoginRes,
  ShopwareLogoutRaw,
  ShopwareLogoutRes,
  ShopwareUser,
} from '../types'
import { StorefrontShopAdapterShopware5 } from './main'

export class StorefrontShopAdapterShopware5User
  implements MakairaShopProviderUser
{
  constructor(private mainAdapter: StorefrontShopAdapterShopware5) {}

  login: MakairaLogin<unknown, ShopwareLoginRaw, Error> = async ({
    input: { password, username },
  }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareLoginRes>({
          path: USER_PATH,
          action: USER_ACTION_LOGIN,
          body: {
            password,
            email: username,
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
      return { data: undefined, error: e as Error }
    }
  }

  logout: MakairaLogout<unknown, ShopwareLogoutRaw, Error> = async () => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareLogoutRes>({
          path: USER_PATH,
          action: USER_ACTION_LOGOUT,
        })

      if (status !== 200) {
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
        error: e as Error,
      }
    }
  }

  signup: MakairaSignup<unknown, undefined, Error> = async () => {
    return { error: new NotImplementedError() }
  }

  getUser: MakairaGetUser<unknown, ShopwareGetUserRaw, Error> = async () => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<ShopwareGetUserRes>({
          path: USER_PATH,
          action: USER_ACTION_GET_CURRENT,
        })

      // shopware5 returns an 403 if no user is logged in.
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
            firstname: (response as ShopwareUser).firstname,
            lastname: (response as ShopwareUser).lastname,
            email: (response as ShopwareUser).email,
          },
        },
        raw: { getUser: response },
        error: undefined,
      }
    } catch (e) {
      return { data: undefined, error: e as Error }
    }
  }

  forgotPassword: MakairaForgotPassword<unknown, undefined, Error> =
    async () => {
      return { error: new NotImplementedError() }
    }
}
