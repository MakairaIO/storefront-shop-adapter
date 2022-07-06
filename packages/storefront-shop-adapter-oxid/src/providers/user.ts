import {
  MakairaGetUser,
  MakairaLogin,
  MakairaLogout,
  MakairaShopProviderUser,
  MakairaSignup,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterOxid } from './main'
import { USER_GET_CURRENT, USER_LOGIN, USER_LOGOUT } from '../paths'
import { AdditionalInputLoginOxid } from '../types'

export class StorefrontShopAdapterOxidUser implements MakairaShopProviderUser {
  constructor(private mainAdapter: StorefrontShopAdapterOxid) {}

  login: MakairaLogin<AdditionalInputLoginOxid, unknown, Error> = async ({
    input: { password, username, rememberLogin },
  }) => {
    try {
      const { response, status } = await this.mainAdapter.fetchFromShop({
        path: USER_LOGIN,
        body: {
          password,
          username,
          rememberLogin,
        },
      })

      if (!response.success || status !== 200) {
        return {
          data: {
            user: undefined,
            raw: {
              login: response,
              user: undefined,
            },
          },
          error: new Error(
            response.message ?? 'API responded with status != 200'
          ),
        }
      }

      /* The OXID-Plugin does not return a user object after successful login.
       * But the login function should always return this, so we have to additionally
       * fetch it after successful login.
       */
      const { error: userError, data: userData } = await this.getUser({
        input: {},
      })

      if (userError) {
        return {
          data: {
            user: undefined,
            raw: {
              user: userData?.raw,
              login: response,
            },
          },
          error: userError,
        }
      }

      return {
        data: {
          user: userData?.user,
          raw: {
            user: userData?.raw,
            login: response,
          },
        },
        error: undefined,
      }
    } catch (e) {
      return {
        data: {
          user: undefined,
          raw: {
            user: undefined,
            login: undefined,
          },
        },
        error: e as Error,
      }
    }
  }

  logout: MakairaLogout<unknown, unknown, Error> = async () => {
    try {
      const { response, status } = await this.mainAdapter.fetchFromShop({
        path: USER_LOGOUT,
      })

      if (!response.success || status !== 200) {
        return {
          data: {
            user: undefined,
            raw: response,
          },
          error: new Error(
            response.message ?? 'API responded with status != 200'
          ),
        }
      }

      return { data: { raw: response }, error: undefined }
    } catch (e) {
      return {
        data: { user: undefined, raw: undefined },
        error: e as Error,
      }
    }
  }

  /**
   * Not yet implemented/existing endpoint for OXID-Abstraction.
   */
  signup: MakairaSignup<unknown, unknown, Error> = async () => {
    return {
      data: { user: undefined, raw: undefined },
      error: new Error('not yet implemented'),
    }
  }

  getUser: MakairaGetUser<unknown, unknown, Error> = async () => {
    try {
      const { response, status } = await this.mainAdapter.fetchFromShop({
        path: USER_GET_CURRENT,
      })

      if (status !== 200) {
        return {
          data: { user: undefined, raw: response },
          error: new Error(
            response.message ?? 'API responded with status != 200'
          ),
        }
      }

      return {
        data: {
          user: {
            id: response.id,
            firstname: response.firstname,
            lastname: response.lastname,
            email: response.email,
          },
          raw: response,
        },
        error: undefined,
      }
    } catch (e) {
      return { data: { user: undefined, raw: undefined }, error: e as Error }
    }
  }
}
