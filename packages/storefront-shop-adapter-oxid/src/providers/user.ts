import {
  MakairaLogin,
  MakairaLogout,
  MakairaShopProviderUser,
  MakairaSignup,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterOxid } from './main'

export class StorefrontShopAdapterOxidUser implements MakairaShopProviderUser {
  constructor(private mainAdapter: StorefrontShopAdapterOxid) {}

  login: MakairaLogin<unknown, unknown, Error> = async ({
    input: { password, username },
  }) => {
    return {
      data: { user: { id: 'oxid' }, raw: undefined },
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
}
