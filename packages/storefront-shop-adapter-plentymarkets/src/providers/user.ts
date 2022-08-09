import {
  BadHttpStatusError,
  MakairaGetUser,
  MakairaLogin,
  MakairaLogout,
  MakairaShopProviderUser,
  MakairaSignup,
  NotImplementedError,
  UserLoginEvent,
  UserLogoutEvent,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterPlentymarkets } from './main'
import {
  PlentymarketsGetUserRaw,
  PlentymarketsGetUserRes,
  PlentymarketsLoginRaw,
  PlentymarketsLoginRes,
  PlentymarketsLogoutRaw,
  PlentymarketsLogoutRes,
} from '../types'
import { USER_GET, USER_LOGIN, USER_LOGOUT } from '../paths'

export class StorefrontShopAdapterPlentymarketsUser
  implements MakairaShopProviderUser
{
  constructor(private mainAdapter: StorefrontShopAdapterPlentymarkets) {}

  login: MakairaLogin<unknown, PlentymarketsLoginRaw, Error> = async ({
    input: { password, username },
  }) => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<PlentymarketsLoginRes>({
          path: USER_LOGIN,
          body: {
            password,
            email: username,
          },
        })

      const plentyUser =
        response?.events?.AfterAccountAuthentication?.accountContact

      if (status !== 200 || response?.error || !plentyUser) {
        return {
          data: undefined,
          raw: { login: response },
          error: response?.error
            ? new Error(response?.error.message)
            : new BadHttpStatusError(),
        }
      }

      const user = {
        id: plentyUser.id,
        firstname: plentyUser.firstName,
        lastname: plentyUser.lastName,
        email: plentyUser.email,
      }

      const data = { user }
      const raw = { login: response }

      this.mainAdapter.dispatchEvent(
        new UserLoginEvent<PlentymarketsLoginRaw>(data, raw)
      )

      return { data, raw, error: undefined }
    } catch (e) {
      return { data: undefined, error: e as Error }
    }
  }

  logout: MakairaLogout<unknown, PlentymarketsLogoutRaw, Error> = async () => {
    try {
      const { response, status } =
        await this.mainAdapter.fetchFromShop<PlentymarketsLogoutRes>({
          path: USER_LOGOUT,
        })

      if (status !== 200 || response.data !== 200) {
        return {
          data: undefined,
          raw: { logout: response },
          error: new BadHttpStatusError(),
        }
      }

      const raw = { logout: response }

      this.mainAdapter.dispatchEvent(
        new UserLogoutEvent<PlentymarketsLogoutRaw>(undefined, raw)
      )

      return { data: undefined, raw, error: undefined }
    } catch (e) {
      return { data: undefined, raw: undefined, error: e as Error }
    }
  }

  signup: MakairaSignup<unknown, unknown, Error> = async () => {
    return {
      data: undefined,
      error: new NotImplementedError(),
    }
  }

  getUser: MakairaGetUser<unknown, PlentymarketsGetUserRaw, Error> =
    async () => {
      try {
        const { response, status } =
          await this.mainAdapter.fetchFromShop<PlentymarketsGetUserRes>({
            path: USER_GET,
            method: 'GET',
          })

        if (status !== 200) {
          return {
            data: undefined,
            raw: { getUser: response },
            error: new BadHttpStatusError(),
          }
        }

        if (!response.data) {
          return {
            data: undefined,
            raw: { getUser: response },
            error: undefined,
          }
        }

        const user = {
          id: response.data.id,
          firstname: response.data.firstName,
          lastname: response.data.lastName,
          email: response.data.email,
        }

        const data = { user }
        const raw = { getUser: response }

        return { data, raw, error: undefined }
      } catch (e) {
        return { data: undefined, raw: undefined, error: e as Error }
      }
    }
}
