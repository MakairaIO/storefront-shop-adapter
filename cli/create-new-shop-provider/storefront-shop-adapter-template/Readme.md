# @makaira/storefront-shop-adapter-**SHOP_ADAPTER_NAME**

_TODO description_

## Installation

`yarn install @makaira/storefront-types @makaira/storefront-shop-adapter-__SHOP_ADAPTER_NAME__`

or

`npm install @makaira/storefront-types @makaira/storefront-shop-adapter-__SHOP_ADAPTER_NAME__`

## Adding to your project

### Basic usage

```typescript
import { StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__ } from '@makaira/storefront-shop-adapter-__SHOP_ADAPTER_NAME__'

const client = new StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__()
```

### Usage with `@makaira/storefront-react`

```tsx
import { StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__ } from '@makaira/storefront-shop-adapter-__SHOP_ADAPTER_NAME__'
import { ShopProvider } from '@makaira/storefront-react'

const client = new StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__()

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
import { StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__ } from '@makaira/storefront-shop-adapter-__SHOP_ADAPTER_NAME__'

declare module '@makaira/storefront-react' {
  interface StorefrontReactCustomClient {
    client: StorefrontShopAdapter__SHOP_ADAPTER_NAME_UPPERCASE__
  }
}
```

## Additional constructor arguments

| Argument | Required | Description | Type |
| -------- | -------- | ----------- | ---- |

_TODO additional arguments_

## Feature map

| Feature          | Available |
| ---------------- | --------- |
| cart             |           |
| - addItem        |           |
| - getCart        |           |
| - removeItem     |           |
| - updateItem     |           |
| review           |           |
| - getReviews     |           |
| - createReview   |           |
| user             |           |
| - login          |           |
| - logout         |           |
| - signup         |           |
| - getUser        |           |
| - forgotPassword |           |
| wishlist         |           |
| - getWishlist    |           |
| - addItem        |           |
| - removeItem     |           |

_TODO feature map_

## Additional input properties

### Cart

#### getCart

_TODO input additional properties_

#### addItem

_TODO input additional properties_

#### removeItem

_TODO input additional properties_

#### updateItem

_TODO input additional properties_

### Review

#### getReviews

_TODO input additional properties_

#### createReview

_TODO input additional properties_

### User

#### getUser

_TODO input additional properties_

#### login

_TODO input additional properties_

#### logout

_TODO input additional properties_

#### signup

_TODO input additional properties_

#### forgotPassword

_TODO input additional properties_

### Wishlist

#### getWishlist

_TODO input additional properties_

#### addItem

_TODO input additional properties_

#### removeItem

_TODO input additional properties_
