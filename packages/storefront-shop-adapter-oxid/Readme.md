# @makaira/storefront-shop-adapter-oxid

This shop adapter can be used to connect your oxid shop with your storefront. This adapter is developed based on the [oxid-connect](https://github.com/MakairaIO/oxid-connect) plugin.

## Installation

`yarn install @makaira/storefront-types @makaira/storefront-shop-adapter-oxid`

or

`npm install @makaira/storefront-types @makaira/storefront-shop-adapter-oxid`

## Adding to your project

### Basic usage

```typescript
import { StorefrontShopAdapterOxid } from '@makaira/storefront-shop-adapter-oxid'

const client = new StorefrontShopAdapterOxid({
  url: '<OXID-API-BASE-URL>',
})
```

### Usage with `@makaira/storefront-react`

```tsx
import { StorefrontShopAdapterOxid } from '@makaira/storefront-shop-adapter-oxid'
import { ShopProvider } from '@makaira/storefront-react'

const client = new StorefrontShopAdapterOxid({
  url: '<OXID-API-BASE-URL>',
})

function Index() {
  return (
    <ShopProvider client={shopClient}>
      <App />
    </ShopProvider>
  )
}
```

In addition if you are using typescript in your project and want to get the correct autosuggestion you have to create a new declaration file (e.g `index.d.ts`) with the following content:

```typescript
import '@makaira/storefront-react'
import { StorefrontShopAdapterOxid } from '@makaira/storefront-shop-adapter-oxid'

declare module '@makaira/storefront-react' {
  interface StorefrontReactCustomClient {
    client: StorefrontShopAdapterOxid
  }
}
```

## Additional constructor arguments

| Argument | Required/Optional | Description                              | Type     |
| -------- | ----------------- | ---------------------------------------- | -------- |
| url      | required          | The base api url to made requests again. | `string` |

## Feature map

| Feature          | Available |
| ---------------- | --------- |
| cart             |           |
| - addItem        | ✅        |
| - getCart        | ✅        |
| - removeItem     | ✅        |
| - updateItem     | ✅        |
| review           |           |
| - getReviews     | ✅        |
| - createReview   | ✅        |
| user             |           |
| - login          | ✅        |
| - logout         | ✅        |
| - signup         | ❌        |
| - getUser        | ✅        |
| - forgotPassword | ❌        |
| wishlist         |           |
| - getWishlist    | ❌        |
| - addItem        | ❌        |
| - removeItem     | ❌        |

## Additional input properties

### Cart

#### getCart

_No additional properties_

#### addItem

_No additional properties_

#### removeItem

_No additional properties_

#### updateItem

_No additional properties_

### Review

#### getReviews

_No additional properties_

#### createReview

_No additional properties_

### User

#### getUser

_No additional properties_

#### login

| Property      | Required/Optional | Description                                                                             | Type      |
| ------------- | ----------------- | --------------------------------------------------------------------------------------- | --------- |
| rememberLogin | required          | If the login should be remembered or should expire automatically after browser closing. | `boolean` |

#### logout

_No additional properties_

#### signup

_Not implemented_

#### forgotPassword

_Not implemented_

### Wishlist

#### getWishlist

_Not implemented_

#### addItem

_Not implemented_

#### removeItem

_Not implemented_
