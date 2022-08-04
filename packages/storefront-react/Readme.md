# @makaira/storefront-react

This package is a wrapper to bring a reactive shop adapter to your react storefront. This react wrapper is SSR compatible. It is completely build by the usage of react hooks.

The package will automatically handle loading data like the user, the cart or the wishlist. Also it handles modifications in the state change by listening to the events emitted by the shop adapter client.

This package gives you using hooks access to the loaded data and holds some common data like the total amount of products in the cart.

## Installation

`yarn install @makaira/storefront-react`

or

`npm i @makaira/storefront-react`

## Adding to your project

For simplicity we are here using the local shop adapter to demonstrate how to add the react wrapper to your storefront.

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

## Props for the ShopProvider

| Property   | Required/Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                          | Type                                    |
| ---------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------- |
| client     | required          | The shop adapter client.                                                                                                                                                                                                                                                                                                                                                                                             | `StorefrontReactCustomClient['client']` |
| bootstrap  | optional          | By default the react wrapper loads the the main data that is required for most storefronts. These can be disabled or customized.                                                                                                                                                                                                                                                                                     | `object`                                |
| - cart     | optional          | By default the current cart will be loaded by calling `client.cart.getCart({input:{}})`. If you set this value to `false` loading is disabled. If your turn it back to `true` it will automatically loads the cart. If you want to customize the data that is loaded you can also pass a function that returns a `Promise<MakairaResponse>`. The `data`property will then be written into the state.                 | `boolean                                | (() => Promise<MakairaResponse<StorefrontReactCustomTypes['cart'], any, Error> >)`     |
| - user     | optional          | By default the current user will be loaded by calling `client.user.getUser({input:{}})`. If you set this value to `false` loading is disabled. If your turn it back to `true` it will automatically loads the user. If you want to customize the data that is loaded you can also pass a function that returns a `Promise<MakairaResponse>`. The `data`property will then be written into the state.                 | `boolean                                | (() => Promise<MakairaResponse<StorefrontReactCustomTypes['user'], any, Error> >)`     |
| - wishlist | optional          | By default the current wishlist will be loaded by calling `client.wishlist.getWishlist({input:{}})`. If you set this value to `false` loading is disabled. If your turn it back to `true` it will automatically loads the wishlist. If you want to customize the data that is loaded you can also pass a function that returns a `Promise<MakairaResponse>`. The `data`property will then be written into the state. | `boolean                                | (() => Promise<MakairaResponse<StorefrontReactCustomTypes['wishlist'], any, Error> >)` |

## Usage with typescript

In the above [section](#adding-to-your-project) we already explained how to set the correct shop adapter. In addition to these you can also adjust the typescript definition of the in the state stored data.

By default you don't need to do so. But if you set a custom bootstrap loader this might by helpful.

To do so add to your declaration file the following content:

```typescript
import '@makaira/storefront-react'
import { StorefrontShopAdapterLocal } from '@makaira/storefront-shop-adapter-local'

declare module '@makaira/storefront-react' {
  // only overwrite one specific data
  interface StorefrontReactCustomTypes {
    cart: { id: string }
  }

  // update overwrite specific data
  interface StorefrontReactCustomTypes {
    cart: { id: string }
    user: { id: string }
  }

  // or overwrite them all
  interface StorefrontReactCustomTypes {
    cart: { id: string }
    user: { id: string }
    wishlist: { id: string }
  }
}
```

## Available Hooks

### useShopClient

This hook can be used to access the shop adapter client passed to the `ShopProvider`.

```tsx
function App() {
  const { client } = useShopClient()

  return <></>
}
```

**Arguments**

_No Arguments to pass_

**Returned properties**

| Property | Description                              | Type                                    |
| -------- | ---------------------------------------- | --------------------------------------- |
| client   | The client passed to the `ShopProvider`. | `StorefrontReactCustomClient['client']` |

### useShopCart

This hook can be used to access the current cart.

```tsx
function App() {
  const { cart } = useShopCart()

  return <></>
}
```

**Arguments**

_No Arguments to pass_

**Returned properties**

| Property         | Description                                                                                                                                                                                                                    | Type     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | --------- | ----------------------------------- |
| cart             | The current cart.                                                                                                                                                                                                              | `null    | undefined | StorefrontReactCustomTypes['user']` |
| productsInCart   | The current amount of products in the cart. It counts the number of unique products but not their quantity in the cart. When in the cart product A and product B with each have a quantity set to 3 is, productsInCart will 2. | `number` |
| quantityInCart   | The current total amount of products with their quantity. When in the cart product A and product B with each have a quantity set to 3 is, quantityInCart will 6.                                                               | `number` |
| totalPriceInCart | The current total price of all products in the cart including their quantities.                                                                                                                                                | `number` |

### useShopUser

This hook can be used to access the current user.

```tsx
function App() {
  const { user } = useShopUser()

  return <></>
}
```

**Arguments**

_No Arguments to pass_

**Returned properties**

| Property | Description       | Type  |
| -------- | ----------------- | ----- | --------- | ----------------------------------- |
| user     | The current user. | `null | undefined | StorefrontReactCustomTypes['user']` |

### useShopWishlist

This hook can be used to access the current wishlist.

```tsx
function App() {
  const { wishlist } = useShopWishlist()

  return <></>
}
```

**Arguments**

_No Arguments to pass_

**Returned properties**

| Property            | Description                                          | Type                                                         |
| ------------------- | ---------------------------------------------------- | ------------------------------------------------------------ | --------- | ----------------------------------- |
| wishlist            | The current wishlist.                                | `null                                                        | undefined | StorefrontReactCustomTypes['cart']` |
| isProductInWishlist | A function to check if a product is in the wishlist. | `(id: string) => MakairaResponse<boolean, undefined, Error>` |

### useShopReviews

This hook can be used to reviews for a specific product

```tsx
function App() {
  const { loading, error, data, raw } = useShopWishlist({
    product: { id: 'foo' },
  })

  return <></>
}
```

**Arguments**

| Property               | Required/Optional | Description                                                                                                | Type      |
| ---------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------- | --------- |
| product                | required          | The product to get the reviews from.                                                                       | `object`  |
| - id                   | required          | The id of the product to get reviews from.                                                                 | `string`  |
| pagination             | optional          | To allow pagination you can here set the pagination information                                            | `object`  |
| - offset               | optional          | The pagination offset.                                                                                     | `number`  |
| - limit                | optional          | The pagination limit.                                                                                      | `number`  |
| refetchOnReviewCreated | optional          | Indicator if the review list should be refetched if the `ReviewCreateEvent` was emitted. Default is false. | `boolean` |

**Returned properties**

| Property | Description                                                                               | Type                                                                  |
| -------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ---------- |
| loading  | Indicator if the reviews are currently fetching or if the next pagination is loading.     | `boolean`                                                             |
| error    | Indicator if an error occurred while loading the reviews.                                 | `Error                                                                | undefined` |
| data     | The `data` property returned by the `client.reviews.getReviews()` containing the reviews. | Unified data response of `client.reviews.getReviews()`                |
| raw      | The `raw` property returned by the `client.reviews.getReviews()`.                         | Shop adapter specific `raw` response of `client.reviews.getReviews()` |
| refetch  | Function to force a reload with the current product and pagination information            | `() => void`                                                          |
