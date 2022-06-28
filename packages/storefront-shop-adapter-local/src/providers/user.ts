import {
  MakairaGetUser,
  MakairaLogin,
  MakairaLogout,
  MakairaShopProviderUser,
  MakairaSignup,
} from '@makaira/storefront-types'
import { faker } from '@faker-js/faker'
import { StorefrontShopAdapterLocal } from './main'
import { ShopAdapterLocalStorageVersioned } from '../types'

type UserStore = {
  user?: { id: string }
}

type UserStoreVersioned = ShopAdapterLocalStorageVersioned<'v1', UserStore>

export class StorefrontShopAdapterLocalUser implements MakairaShopProviderUser {
  LOCAL_STORAGE_STORE = 'makaira-shop-local-user'

  constructor(private mainAdapter: StorefrontShopAdapterLocal) {}

  login: MakairaLogin<unknown, UserStoreVersioned, Error> = async ({
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

  logout: MakairaLogout<unknown, UserStoreVersioned, Error> = async () => {
    const userStore = this.getStore()

    if (!userStore.user) {
      return { data: undefined, error: new Error('no user signed in') }
    }

    userStore.user = undefined

    this.setStore(userStore)

    return { data: { raw: userStore }, error: undefined }
  }

  signup: MakairaSignup<unknown, UserStoreVersioned, Error> = async () => {
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

  getUser: MakairaGetUser<unknown, UserStoreVersioned, Error> = async () => {
    const userStore = this.getStore()

    if (!userStore.user) {
      return { data: undefined, error: new Error('no user signed in') }
    }

    return { data: { user: userStore.user, raw: userStore }, error: undefined }
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
