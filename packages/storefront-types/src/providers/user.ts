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
  firstName?: string
  lastName?: string
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

//#region type definition: updateUser
export type MakairaUpdateUserInput<AdditionalInput = unknown> = {
  firstName: string
  lastName: string
  phone: string
  email: string
} & AdditionalInput

export type MakairaUpdateUserResData = {
  user: MakairaUser
}

export type MakairaUpdateUser<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaUpdateUserInput<AdditionalInput>,
  MakairaUpdateUserResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: updateUser
export type MakairaUpdatePasswordInput<AdditionalInput = unknown> = {
  password: string
} & AdditionalInput

export type MakairaUpdatePasswordResData = {
  user: MakairaUser
}

export type MakairaUpdatePassword<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaUpdatePasswordInput<AdditionalInput>,
  MakairaUpdatePasswordResData,
  ResRawData,
  ResError
>
//#endregion

//region type definition: activateUser
export type MakairaActivateUserInput<AdditionalInput = unknown> = {
  activationUrl: string
  password: string
} & AdditionalInput

export type MakairaActivateUserResData = {
  user: MakairaUser
}

export type MakairaActivateUser<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaActivateUserInput<AdditionalInput>,
  MakairaActivateUserResData,
  ResRawData,
  ResError
>
//endregion

//#region type definition: provider user
export type MakairaShopProviderUser = {
  login: MakairaLogin
  logout: MakairaLogout
  signup: MakairaSignup
  getUser: MakairaGetUser
  forgotPassword: MakairaForgotPassword
  update?: MakairaUpdateUser
  activate?: MakairaActivateUser
  updatePassword?: MakairaUpdatePassword
}
