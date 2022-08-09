# @makaira/storefront-shop-adapter-local

This shop adapter can be used to start developing a storefront without the need to have a working shop system in the background. This adapter simulates every functionality by writing and reading from the local storage.

## Installation

`yarn install @makaira/storefront-types @makaira/storefront-shop-adapter-local`

or

`npm install @makaira/storefront-types @makaira/storefront-shop-adapter-local`

## Adding to your project

### Basic usage

```typescript
import { StorefrontShopAdapterLocal } from '@makaira/storefront-shop-adapter-local'

const client = new StorefrontShopAdapterLocal()
```

### Usage with `@makaira/storefront-react`

```tsx
import { StorefrontShopAdapterLocal } from '@makaira/storefront-shop-adapter-local'
import { ShopProvider } from '@makaira/storefront-react'

const client = new StorefrontShopAdapterLocal()

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
import { StorefrontShopAdapterLocal } from '@makaira/storefront-shop-adapter-local'

declare module '@makaira/storefront-react' {
  interface StorefrontReactCustomClient {
    client: StorefrontShopAdapterLocal
  }
}
```

## Additional constructor arguments

| Argument | Required | Description | Type |
| -------- | -------- | ----------- | ---- |

_For this provider additional arguments does not exists_

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
| - signup         | ✅        |
| - getUser        | ✅        |
| - forgotPassword | ✅        |
| wishlist         |           |
| - getWishlist    | ✅        |
| - addItem        | ✅        |
| - removeItem     | ✅        |

## Additional input properties

### Cart

#### getCart

_No additional properties_

#### addItem

| Property | Required/Optional | Description               | Type       |
| -------- | ----------------- | ------------------------- | ---------- |
| title    | required          | The title of the product. | `string`   |
| url      | required          | The url to the product.   | `string`   |
| price    | required          | The price of the product  | `string`   |
| images[] | required          | A list of image urls      | `string[]` |

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

_No additional properties_

#### logout

_No additional properties_

#### signup

_No additional properties_

#### forgotPassword

_No additional properties_

### Wishlist

#### getWishlist

_No additional properties_

#### addItem

| Property | Required/Optional | Description               | Type       |
| -------- | ----------------- | ------------------------- | ---------- |
| title    | required          | The title of the product. | `string`   |
| url      | required          | The url to the product.   | `string`   |
| price    | required          | The price of the product  | `string`   |
| images[] | required          | A list of image urls      | `string[]` |

#### removeItem

_No additional properties_
