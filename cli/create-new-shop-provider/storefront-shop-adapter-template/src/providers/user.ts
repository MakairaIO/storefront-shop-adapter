import {
  MakairaForgotPassword,
  MakairaGetUser,
  MakairaLogin,
  MakairaLogout,
  MakairaShopProviderUser,
  MakairaSignup,
} from '@makaira/storefront-types'
import { StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__ } from './main'

export class StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__User
  implements MakairaShopProviderUser
{
  constructor(
    private mainAdapter: StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__
  ) {}

  login: MakairaLogin<unknown, undefined, Error> = async () => {}

  logout: MakairaLogout<unknown, undefined, Error> = async () => {}

  signup: MakairaSignup<unknown, undefined, Error> = async () => {}

  getUser: MakairaGetUser<unknown, undefined, Error> = async () => {}

  forgotPassword: MakairaForgotPassword<unknown, undefined, Error> =
    async () => {}
}
