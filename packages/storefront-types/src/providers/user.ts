import { MakairaShopProviderInteractor } from '../general/shop-provider-interactor'

//#region type definition: login
export type MakairaLoginInput<AdditionalInput = unknown> = {
  username: string
  password: string
} & AdditionalInput

export type MakairaLoginResData<RawResponse = unknown> = {
  user: { id: string; firstname: string; lastname: string } | undefined
  raw: RawResponse
}

export type MakairaLogin<
  AdditionalInput = any,
  RawResponse = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaLoginInput<AdditionalInput>,
  MakairaLoginResData<RawResponse>,
  ResError
>
//#endregion

//#region type definition: logout
export type MakairaLogoutInput<AdditionalInput = unknown> = AdditionalInput

export type MakairaLogoutResData<RawResponse = unknown> = {
  raw: RawResponse
}

export type MakairaLogout<
  AdditionalInput = any,
  RawResponse = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaLogoutInput<AdditionalInput>,
  MakairaLogoutResData<RawResponse>,
  ResError
>
//#endregion

//#region type definition: signup
export type MakairaSignupInput<AdditionalInput = unknown> = {
  username: string
  password: string
} & AdditionalInput

export type MakairaSignupResData<RawResponse = unknown> = {
  user: { id: string } | undefined
  raw: RawResponse
}

export type MakairaSignup<
  AdditionalInput = unknown,
  RawResponse = unknown,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaSignupInput<AdditionalInput>,
  MakairaSignupResData<RawResponse>,
  ResError
>
//#endregion

//#region type definition: getUser
export type MakairaGetUserInput<AdditionalInput = unknown> = AdditionalInput

export type MakairaGetUserResData<RawResponse = unknown> = {
  user?: { id: string; firstname: string; lastname: string; email: string }
  raw: RawResponse
}

export type MakairaGetUser<
  AdditionalInput = unknown,
  RawResponse = unknown,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaGetUserInput<AdditionalInput>,
  MakairaGetUserResData<RawResponse>,
  ResError
>
//#endregion

//#region type definition: provider user
export type MakairaShopProviderUser = {
  login: MakairaLogin
  logout: MakairaLogout
  signup: MakairaSignup
  getUser: MakairaGetUser
}
