import { MakairaProduct } from '@makaira/storefront-types'

export type ShopAdapterLocalStorageVersioned<Versions extends string, Data> = {
  version: Versions
} & Data

type CartStore = {
  items: Array<{ product: MakairaProduct; quantity: number }>
}

export type CartStoreVersioned = ShopAdapterLocalStorageVersioned<
  'v1',
  CartStore
>

type UserStore = {
  user?: { id: string; email: string; firstname: string; lastname: string }
}

export type UserStoreVersioned = ShopAdapterLocalStorageVersioned<
  'v1',
  UserStore
>

//#region cart provider

//#region getCart method

export type LocalGetCartRaw = { store: CartStoreVersioned }

//#endregion

//#region addItem method

export type LocalAddItemRaw = {
  store: CartStoreVersioned
}

//#endregion

//#region addItem method

export type LocalRemoveItemRaw = {
  store: CartStoreVersioned
}

//#endregion

//#region updateItem method

export type LocalUpdateItemRaw = {
  store: CartStoreVersioned
}

//#endregion

//#endregion

//#region user provider

//#region getUser method

export type LocalGetUserRaw = { store: UserStoreVersioned }

//#endregion

//#region logout method

export type LocalLogoutRaw = {
  store: UserStoreVersioned
}

//#endregion

//#region login method

export type LocalLoginRaw = {
  store: UserStoreVersioned
}

//#endregion

//#region login method

export type LocalSignupRaw = {
  store: UserStoreVersioned
}

//#endregion

//#endregion
