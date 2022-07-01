import {
  MakairaGetUser,
  MakairaLogin,
  MakairaLogout,
  MakairaShopProviderUser,
  MakairaSignup,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterOxid } from './main'
import { USER_LOGIN } from '../paths'

export class StorefrontShopAdapterOxidUser implements MakairaShopProviderUser {
  constructor(private mainAdapter: StorefrontShopAdapterOxid) {}

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  login: MakairaLogin<unknown, unknown, Error> = async ({
    input: { password, username },
  }) => {
    try {
      const response = await this.mainAdapter.fetchFromShop({
        path: USER_LOGIN,
        body: {
          password,
          username,
          rememberLogin: false,
        },
      })
    } catch (e) {
      return {
        data: { user: { id: 'test' }, raw: undefined },
        error: new Error(),
      }
    }

    return {
      data: { user: { id: 'test' }, raw: undefined },
      error: undefined,
    }
  }

  logout: MakairaLogout<unknown, unknown, Error> = async () => {
    return { data: { raw: undefined }, error: undefined }
  }

  signup: MakairaSignup<unknown, unknown, Error> = async ({
    input: { username, password },
  }) => {
    return { data: { user: { id: 'oxid' }, raw: undefined }, error: undefined }
  }

  getUser: MakairaGetUser<unknown, unknown, Error> = async () => {
    return { data: { user: { id: 'oxid' }, raw: undefined }, error: undefined }
  }
}
