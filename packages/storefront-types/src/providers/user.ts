import { MakairaUser } from '../user'
import { MakairaShopProviderInteractor } from '../general/shop-provider-interactor'

//#region type definition: login
export type MakairaLoginInput<AdditionalInput = unknown> = {
  username: string
  password: string
} & AdditionalInput

export type MakairaLoginResData = {
  user: MakairaUser
}

export type MakairaLogin<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaLoginInput<AdditionalInput>,
  MakairaLoginResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: logout
export type MakairaLogoutInput<AdditionalInput = unknown> = AdditionalInput

export type MakairaLogoutResData = undefined

export type MakairaLogout<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaLogoutInput<AdditionalInput>,
  MakairaLogoutResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: signup
export type MakairaSignupInput<AdditionalInput = unknown> = {
  username: string
  password: string
} & AdditionalInput

export type MakairaSignupResData = {
  user: MakairaUser
}

export type MakairaSignup<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaSignupInput<AdditionalInput>,
  MakairaSignupResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: getUser
export type MakairaGetUserInput<AdditionalInput = unknown> = AdditionalInput

export type MakairaGetUserResData = {
  user: MakairaUser
}

export type MakairaGetUser<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaGetUserInput<AdditionalInput>,
  MakairaGetUserResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: forgotPassword
export type MakairaForgotPasswordInput<AdditionalInput = unknown> = {
  username: string
} & AdditionalInput

export type MakairaForgotPasswordResData = undefined

export type MakairaForgotPassword<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaForgotPasswordInput<AdditionalInput>,
  MakairaForgotPasswordResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: provider user
export type MakairaShopProviderUser = {
  login: MakairaLogin
  logout: MakairaLogout
  signup: MakairaSignup
  getUser: MakairaGetUser
  forgotPassword: MakairaForgotPassword
}
