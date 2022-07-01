import { StorefrontShopAdapterOxid } from './'

describe('User functions (login/logout/getUser)', function () {
  it('should correctly login user', async () => {
    const oxidClient = new StorefrontShopAdapterOxid({
      url: 'https://oxid.shop.makaira.cloud/index.php?cl=MakairaUserController&fnc=login',
    })
    const res = await oxidClient.user.login({
      input: { username: 'jon@doe.com', password: 'password123' },
    })

    console.log(res)
  })
})
