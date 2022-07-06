export type AdditionalInputLoginOxid = {
  // asd
  rememberLogin: boolean
}

export type AdditionalOxidOptions = {
  url?: string
}

export type FetchParameters = {
  path: string
  body?: object
}

export type FetchResponse = {
  response: any
  status: number
}
