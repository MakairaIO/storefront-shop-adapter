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
import { StorefrontShopAdapterOxid } from './main'
import {
  AdditionalInputLoginOxid,
  OxidGetUserRaw,
  OxidGetUserRes,
  OxidLoginRaw,
  OxidLoginRes,
  OxidLogoutRaw,
  OxidLogoutRes,
  OxidUser,
} from '../types'

export class StorefrontShopAdapterOxidUser implements MakairaShopProviderUser {
  constructor(private mainAdapter: StorefrontShopAdapterOxid) {}

  login: MakairaLogin<AdditionalInputLoginOxid, OxidLoginRaw, Error> = async ({
    input: { password, username, rememberLogin = false },
  }) => {
    try {
      console.log({
        body: {
          password,
          username,
          rememberLogin,
        },
      })

      const { response, status } =
        await this.mainAdapter.fetchFromShop<OxidLoginRes>({
          path: this.mainAdapter.paths.USER_LOGIN,
          body: {
            password,
            username,
            rememberLogin,
          },
        })

      if (status !== 200 || response.success === false) {
        return {
          data: undefined,
          raw: { login: response },
          error:
            response.success === false
              ? new Error(response.message)
              : new BadHttpStatusError(),
        }
      }

      /* The OXID-Plugin does not return a user object after successful login.
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

      const raw: OxidLoginRaw = {
        login: response,
        getUser: rawGetUser?.getUser,
      }

      if (dataGetUser) {
        const data = { user: dataGetUser.user }

        this.mainAdapter.dispatchEvent(
          new UserLoginEvent<OxidLoginRaw>(data, raw)
        )

        return { data, raw, error: undefined }
      }

      return { data: undefined, raw, error: errorGetUser }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }

  logout: MakairaLogout<unknown, OxidLogoutRaw, Error> = async () => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<OxidLogoutRes>({
          path: this.mainAdapter.paths.USER_LOGOUT,
        })

      if (status !== 200) {
        return {
          data: undefined,
          raw: { logout: response },
          error: new BadHttpStatusError(),
        }
      }

      this.mainAdapter.dispatchEvent(
        new UserLogoutEvent<OxidLogoutRaw>(undefined, { logout: response })
      )

      return { data: undefined, raw: { logout: response }, error: undefined }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }

  /**
   * Not yet implemented/existing endpoint for OXID-Abstraction.
   */
  signup: MakairaSignup<unknown, undefined, Error> = async () => {
    return { data: undefined, raw: undefined, error: new NotImplementedError() }
  }

  getUser: MakairaGetUser<unknown, OxidGetUserRaw, Error> = async () => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<OxidGetUserRes>({
          path: this.mainAdapter.paths.USER_GET_CURRENT,
        })

      // oxid returns an 403 if no user is logged in. Therefore
      // return an empty user without error
      if (
        status === 403 &&
        (response as { message: string }).message === 'Forbidden'
      ) {
        return {
          data: undefined,
          raw: { getUser: response },
          error: undefined,
        }
      }

      if (status !== 200 || (response as { message: string }).message) {
        return {
          data: undefined,
          raw: { getUser: response },
          error: (response as { message: string }).message
            ? new Error((response as { message: string }).message)
            : new BadHttpStatusError(),
        }
      }

      return {
        data: {
          user: {
            id: (response as OxidUser).id,
            firstname: (response as OxidUser).firstname,
            lastname: (response as OxidUser).lastname,
            email: (response as OxidUser).email,
          },
        },
        raw: { getUser: response },
        error: undefined,
      }
    } catch (e) {
      return { data: undefined, raw: {}, error: e as Error }
    }
  }

  /**
   * Not yet implemented/existing endpoint for OXID-Abstraction.
   */
  forgotPassword: MakairaForgotPassword<any, any, Error> = async () => {
    return { data: undefined, raw: undefined, error: new NotImplementedError() }
  }
}
