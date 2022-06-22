import {
  MakairaLogin,
  MakairaLogout,
  MakairaShopProviderUser,
  MakairaSignup,
} from '@makaira/storefront-types'
import { StorefrontShopAdapterPlentymarket } from './main'

export class StorefrontShopAdapterPlentymarketUser
  implements MakairaShopProviderUser
{
  constructor(private mainAdapter: StorefrontShopAdapterPlentymarket) {}

  login: MakairaLogin<unknown, unknown, Error> = async ({
    input: { password, username },
  }) => {
    return {
      data: { user: { id: 'demo' }, raw: undefined },
      error: undefined,
    }
  }

  logout: MakairaLogout<unknown, unknown, Error> = async () => {
    return { data: { raw: undefined }, error: undefined }
  }

  signup: MakairaSignup<unknown, unknown, Error> = async ({
    input: { username, password },
  }) => {
    return { data: { user: { id: 'demo' }, raw: undefined }, error: undefined }
  }
}
