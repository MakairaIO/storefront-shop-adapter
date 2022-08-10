# @makaira/storefront-shop-adapter-plentymarkets

This shop adapter can be used to connect your plentymarkets shop with your storefront. This adapter is developed based on the [plentymarkets-connect](https://github.com/MakairaIO/plentymarkets-connect) plugin and plentymarkets io.

## Installation

`yarn install @makaira/storefront-types @makaira/storefront-shop-adapter-plentymarkets`

or

`npm install @makaira/storefront-types @makaira/storefront-shop-adapter-plentymarkets`

## Adding to your project

### Basic usage

```typescript
import { StorefrontShopAdapterPlentymarkets } from '@makaira/storefront-shop-adapter-plentymarkets'

const client = new StorefrontShopAdapterPlentymarkets({
  url: '<PLENTYMARKETS-API-BASE-URL>',
})
```

### Usage with `@makaira/storefront-react`

```tsx
import { StorefrontShopAdapterPlentymarkets } from '@makaira/storefront-shop-adapter-plentymarkets'
import { ShopProvider } from '@makaira/storefront-react'

const client = new StorefrontShopAdapterPlentymarkets({
  url: '<PLENTYMARKETS-API-BASE-URL>',
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
import { StorefrontShopAdapterPlentymarkets } from '@makaira/storefront-shop-adapter-plentymarkets'

declare module '@makaira/storefront-react' {
  interface StorefrontReactCustomClient {
    client: StorefrontShopAdapterPlentymarkets
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
| - getReviews     | ❌        |
| - createReview   | ❌        |
| user             |           |
| - login          | ✅        |
| - logout         | ✅        |
| - signup         | ❌        |
| - getUser        | ✅        |
| - forgotPassword | ❌        |
| wishlist         |           |
| - getWishlist    | ✅        |
| - addItem        | ✅        |
| - removeItem     | ✅        |

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

_Not implemented_

#### createReview

_Not implemented_

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

_No additional properties_

#### addItem

_No additional properties_

#### removeItem

_No additional properties_
