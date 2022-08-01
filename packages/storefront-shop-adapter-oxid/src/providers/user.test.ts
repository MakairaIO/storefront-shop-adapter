import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { StorefrontShopAdapterOxid } from './'
import { USER_GET_CURRENT, USER_LOGIN, USER_LOGOUT } from '../paths'
import {
  BadHttpStatusError,
  MakairaResponse,
  NotImplementedError,
} from '@makaira/storefront-types'

const TARGET_HOST = 'https://example.com'
// Will answer all requests with an error and correct error message
const FAILURE_TARGET_HOST = 'https://failure.com'

const USER_OBJECT = {
  id: 'oxdefaultadmin',
  firstname: 'John',
  lastname: 'Doe',
  email: 'dev@marmalade.de',
}

const userSuccessServer = setupServer(
  rest.post(`${TARGET_HOST}/index.php`, (req, res, context) => {
    const pathWithSearch = req.url.pathname + '?' + req.url.searchParams

    switch (pathWithSearch) {
      case USER_GET_CURRENT:
        return res(
          context.json({ ...USER_OBJECT, additionalParameter: 'test123' })
        )
      case USER_LOGIN: {
        const successful =
          typeof req.body === 'string' &&
          JSON.parse(req.body).password === 'password123'

        const responseData = successful
          ? { success: true }
          : { success: false, message: 'ERROR_MESSAGE_USER_NOVALIDLOGIN' }

        return res(context.json(responseData))
      }
      case USER_LOGOUT:
        return res(context.json({ success: true }))
      default:
        return res(context.status(500), context.json({}))
    }
  }),
  rest.post(`${FAILURE_TARGET_HOST}/index.php`, (req, res, context) => {
    const pathWithSearch = req.url.pathname + '?' + req.url.searchParams

    switch (pathWithSearch) {
      case USER_LOGIN:
        return res(context.json({ success: true }))
      case USER_GET_CURRENT:
        return res(context.status(403), context.json({ message: 'Forbidden' }))
      case USER_LOGOUT:
        return res(context.status(400), context.json({}))
      default:
        return res(context.status(500), context.json({}))
    }
  })
)

const oxidClient = new StorefrontShopAdapterOxid({ url: TARGET_HOST })
const failureOxidClient = new StorefrontShopAdapterOxid({
  url: FAILURE_TARGET_HOST,
})

// eslint-disable-next-line
const checkForCorrectErrorHandling = (
  response: MakairaResponse<any, any, any>
) => {
  expect(response.data?.user).toBeUndefined()
  expect(response.data?.raw?.user).toBeUndefined()
  expect(response.data?.raw?.login).toBeUndefined()
  expect(response.error).not.toBeUndefined()
  expect(response.error).toBeInstanceOf(Error)
}

describe('User functions (login/logout/getUser)', function () {
  beforeAll(() => {
    userSuccessServer.listen()
  })

  afterAll(() => {
    userSuccessServer.close()
  })

  it('should correctly login user', async () => {
    const res = await oxidClient.user.login({
      input: {
        username: 'john@doe.com',
        password: 'password123',
        rememberLogin: false,
      },
    })

    expect(res.error).toBeUndefined()

    expect(res.data?.user).toEqual(USER_OBJECT)
    expect(res.raw).toEqual({
      login: {
        success: true,
      },
      getUser: {
        ...USER_OBJECT,
        additionalParameter: 'test123',
      },
    })
  })

  it('should correctly return error for wrong credentials', async () => {
    const res = await oxidClient.user.login({
      input: {
        username: 'john@doe.com',
        password: 'wrong_password',
        rememberLogin: false,
      },
    })

    expect(res.error).not.toBeUndefined()

    expect(res.error).toEqual(new Error('ERROR_MESSAGE_USER_NOVALIDLOGIN'))
    expect(res.data?.user).toBeUndefined()
    expect(res.raw).toEqual({
      getUser: undefined,
      login: {
        success: false,
        message: 'ERROR_MESSAGE_USER_NOVALIDLOGIN',
      },
    })
  })

  it('should correctly return logged in user', async () => {
    const res = await oxidClient.user.getUser({ input: {} })

    expect(res.error).toBeUndefined()

    expect(res.data?.user).toEqual(USER_OBJECT)
    expect(res.raw).toEqual({
      getUser: { ...USER_OBJECT, additionalParameter: 'test123' },
    })
  })

  it('should correctly return error message if user not logged in', async () => {
    const res = await failureOxidClient.user.getUser({ input: {} })

    expect(res.error).not.toBeUndefined()

    expect(res.error).toEqual(new Error('Forbidden'))
    expect(res.data?.user).toBeUndefined()
    expect(res.raw).toEqual({
      getUser: { message: 'Forbidden' },
    })
  })

  it('should correctly return error message for correct log in but error in getUser', async () => {
    const res = await failureOxidClient.user.login({
      input: {
        username: 'john@doe.com',
        password: 'password123',
        rememberLogin: false,
      },
    })

    expect(res.error).not.toBeUndefined()

    expect(res.error).toEqual(new Error('Forbidden'))
    expect(res.data?.user).toBeUndefined()
    expect(res.raw).toEqual({
      login: {
        success: true,
      },
      getUser: {
        message: 'Forbidden',
      },
    })
  })

  it('should return error for not implemented functions', async () => {
    const res = await oxidClient.user.signup({
      input: { username: 'test', password: 'password ' },
    })

    expect(res.data?.user).toBeUndefined()
    expect(res.raw).toBeUndefined()

    expect(res.error).toBeInstanceOf(NotImplementedError)
  })

  it('should correctly logout user', async () => {
    const res = await oxidClient.user.logout({
      input: {},
    })

    expect(res.raw).toEqual({
      logout: { success: true },
    })
    expect(res.error).toBeUndefined()
  })

  it('should correctly return error if logout fails', async () => {
    const res = await failureOxidClient.user.logout({ input: {} })

    expect(res.raw).toBeUndefined()
    expect(res.error).toBeInstanceOf(BadHttpStatusError)
  })

  it('should return error if fetch throws error', async () => {
    const oxidClientWithRelativeURLs = new StorefrontShopAdapterOxid({
      url: '',
    })

    const loginRes = await oxidClientWithRelativeURLs.user.login({
      input: { username: 'a', password: 'b', rememberLogin: false },
    })

    checkForCorrectErrorHandling(loginRes)

    const logoutRes = await oxidClientWithRelativeURLs.user.logout({
      input: {},
    })

    checkForCorrectErrorHandling(logoutRes)

    const getUserRes = await oxidClientWithRelativeURLs.user.getUser({
      input: {},
    })

    checkForCorrectErrorHandling(getUserRes)
  })
})
