import {
  MakairaForgotPassword,
  MakairaGetUser,
  MakairaLogin,
  MakairaLogout,
  MakairaShopProviderUser,
  MakairaSignup,
  NotImplementedError,
  UserLoginEvent,
  UserLogoutEvent,
  UserSignupEvent,
} from '@makaira/storefront-types'
import { faker } from '@faker-js/faker'
import { StorefrontShopAdapterLocal } from './main'
import {
  LocalGetUserRaw,
  LocalLoginRaw,
  LocalLogoutRaw,
  LocalSignupRaw,
  UserStoreVersioned,
} from '../types'

export class StorefrontShopAdapterLocalUser implements MakairaShopProviderUser {
  LOCAL_STORAGE_STORE = 'makaira-shop-local-user'

  constructor(private mainAdapter: StorefrontShopAdapterLocal) {}

  login: MakairaLogin<unknown, LocalLoginRaw, Error> = async ({
    input: { password, username },
  }) => {
    const userStore = this.getStore()

    if (userStore.user) {
      return {
        data: undefined,
        error: new Error('a user is already signed in'),
      }
    }

    userStore.user = {
      id: faker.datatype.uuid(),
      firstname: 'test',
      lastname: 'test',
      email: 'test',
    }

    this.setStore(userStore)

    const data = { user: userStore.user }
    const raw: LocalLoginRaw = { store: userStore }

    this.mainAdapter.dispatchEvent(new UserLoginEvent<LocalLoginRaw>(data, raw))

    return { data, raw, error: undefined }
  }

  logout: MakairaLogout<unknown, LocalLogoutRaw, Error> = async () => {
    const userStore = this.getStore()

    if (!userStore.user) {
      return { data: undefined, error: new Error('no user signed in') }
    }

    userStore.user = undefined

    this.setStore(userStore)

    const raw: LocalLogoutRaw = { store: userStore }

    this.mainAdapter.dispatchEvent(
      new UserLogoutEvent<LocalLogoutRaw>(undefined, raw)
    )

    return { data: undefined, raw, error: undefined }
  }

  signup: MakairaSignup<unknown, LocalSignupRaw, Error> = async () => {
    const userStore = this.getStore()

    if (!userStore.user) {
      return {
        data: undefined,
        error: new Error('a user is already signed in'),
      }
    }

    userStore.user = {
      id: faker.datatype.uuid(),
      firstname: 'test',
      lastname: 'test',
      email: 'test',
    }

    this.setStore(userStore)

    const data = { user: userStore.user }
    const raw: LocalSignupRaw = { store: userStore }

    this.mainAdapter.dispatchEvent(
      new UserSignupEvent<LocalSignupRaw>(data, raw)
    )

    return { data, raw, error: undefined }
  }

  getUser: MakairaGetUser<unknown, LocalGetUserRaw, Error> = async () => {
    const userStore = this.getStore()

    if (!userStore.user) {
      return { data: undefined, raw: { store: userStore }, error: undefined }
    }

    return {
      data: { user: userStore.user },
      raw: { store: userStore },
      error: undefined,
    }
  }

  forgotPassword: MakairaForgotPassword<unknown, undefined, Error> =
    async () => {
      return {
        data: undefined,
        raw: undefined,
        error: new NotImplementedError(),
      }
    }

  private getStore(): UserStoreVersioned {
    const rawStore = localStorage.getItem(this.LOCAL_STORAGE_STORE)

    if (!rawStore) {
      return { version: 'v1', user: undefined }
    }

    return JSON.parse(rawStore) as UserStoreVersioned
  }

  private async setStore(store: UserStoreVersioned) {
    localStorage.setItem(this.LOCAL_STORAGE_STORE, JSON.stringify(store))
  }
}
