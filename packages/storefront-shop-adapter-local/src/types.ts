export type ShopAdapterLocalStorageVersioned<Versions extends string, Data> = {
  version: Versions
} & Data
