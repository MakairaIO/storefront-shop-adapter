import {
  MakairaLogin,
  MakairaLogout,
  MakairaShopProviderUser,
  MakairaSignup,
} from '@makaira/storefront-types'
import { faker } from '@faker-js/faker'
import { StorefrontShopAdapterLocal } from './main'

type UserStore = {
  version: 'v1'
  user?: { id: string }
}

export class StorefrontShopAdapterLocalUser implements MakairaShopProviderUser {
  LOCAL_STORAGE_STORE = 'makaira-shop-local-user'

  constructor(private mainAdapter: StorefrontShopAdapterLocal) {}

  login: MakairaLogin<unknown, UserStore, Error> = async ({
    input: { password, username },
  }) => {
    const userStore = this.getStore()

    if (userStore.user) {
      return {
        data: undefined,
        error: new Error('a user is already signed in'),
      }
    }

    userStore.user = { id: faker.datatype.uuid() }

    this.setStore(userStore)

    return {
      data: { user: userStore.user, raw: userStore },
      error: undefined,
    }
  }

  logout: MakairaLogout<unknown, UserStore, Error> = async () => {
    const userStore = this.getStore()

    if (!userStore.user) {
      return { data: undefined, error: new Error('no user signed in') }
    }

    userStore.user = undefined

    this.setStore(userStore)

    return { data: { raw: userStore }, error: undefined }
  }

  signup: MakairaSignup<unknown, UserStore, Error> = async ({
    input: { username, password },
  }) => {
    const userStore = this.getStore()

    if (!userStore.user) {
      return {
        data: undefined,
        error: new Error('a user is already signed in'),
      }
    }

    userStore.user = { id: faker.datatype.uuid() }

    this.setStore(userStore)

    return { data: { user: userStore.user, raw: userStore }, error: undefined }
  }

  private getStore(): UserStore {
    const rawStore = localStorage.getItem(this.LOCAL_STORAGE_STORE)

    if (!rawStore) {
      return { version: 'v1', user: undefined }
    }

    return JSON.parse(rawStore) as UserStore
  }

  private async setStore(store: UserStore) {
    localStorage.setItem(this.LOCAL_STORAGE_STORE, JSON.stringify(store))
  }
}
