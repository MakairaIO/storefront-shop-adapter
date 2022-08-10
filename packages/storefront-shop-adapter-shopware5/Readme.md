# @makaira/storefront-shop-adapter-shopware5

This shop adapter can be used to connect your shopware5 shop with your storefront. This adapter is developed based on the [shopware-connect](https://github.com/MakairaIO/shopware-connect) plugin.

## Installation

`yarn install @makaira/storefront-types @makaira/storefront-shop-adapter-shopware5`

or

`npm install @makaira/storefront-types @makaira/storefront-shop-adapter-shopware5`

## Adding to your project

### Basic usage

```typescript
import { StorefrontShopAdapterShopware5 } from '@makaira/storefront-shop-adapter-shopware5'

const client = new StorefrontShopAdapterShopware5({
  url: '<SHOPWARE5-API-BASE-URL>',
})
```

### Usage with `@makaira/storefront-react`

```tsx
import { StorefrontShopAdapterShopware5 } from '@makaira/storefront-shop-adapter-shopware5'
import { ShopProvider } from '@makaira/storefront-react'

const client = new StorefrontShopAdapterShopware5({
  url: '<SHOPWARE5-API-BASE-URL>',
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
import { StorefrontShopAdapterShopware5 } from '@makaira/storefront-shop-adapter-shopware5'

declare module '@makaira/storefront-react' {
  interface StorefrontReactCustomClient {
    client: StorefrontShopAdapterShopware5
  }
}
```

## Additional constructor arguments

| Argument | Required | Description                              | Type     |
| -------- | -------- | ---------------------------------------- | -------- |
| url      | required | The base api url to made requests again. | `string` |

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

| Property | Required/Optional | Description                                      | Type     |
| -------- | ----------------- | ------------------------------------------------ | -------- |
| name     | optional          | The authors name to associate with this review.  | `string` |
| headline | optional          | An optional headline for this review.            | `string` |
| email    | optional          | The authors email to associate with this review. | `string` |

### User

#### getUser

_No additional properties_

#### login

_No additional properties_

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
