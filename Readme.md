# Makaira Shop Adapters

Hello and welcome to the Makaira shop adapters. These well tested and in production used packages are bringing your new storefront even faster to production.

# Table of Contents

- [Intention of the Shop Adapters](#intention-of-the-shop-adapters)
- [Basic usage of a shop adapter](#basic-usage-of-a-shop-adapter)
  - [Basic signature of each method](#basic-signature-of-each-method)
  - [Cart](#cart)
    - [Get Cart](#get-cart)
      - [Unified Input Parameters](#unified-input-parameters)
      - [Unified Data Response](#unified-data-response)
      - [Event Listener](#event-listener)
    - [Add item to cart](#add-item-to-cart)
      - [Unified Input Parameters](#unified-input-parameters-1)
      - [Unified Data Response](#unified-data-response-1)
      - [Event Listener](#event-listener-1)
    - [Update Item from cart](#update-item-from-cart)
      - [Unified Input Parameters](#unified-input-parameters-2)
      - [Unified Data Response](#unified-data-response-2)
      - [Event Listener](#event-listener-2)
    - [Remove item from cart](#remove-item-from-cart)
      - [Unified Input Parameters](#unified-input-parameters-3)
      - [Unified Data Response](#unified-data-response-3)
      - [Event Listener](#event-listener-3)
  - [Checkout](#checkout)
  - [Review](#review)
    - [Get Reviews](#get-reviews)
      - [Unified Input Parameters](#unified-input-parameters-4)
      - [Unified Data Response](#unified-data-response-4)
      - [Event Listener](#event-listener-4)
    - [Create Review](#create-review)
      - [Unified Input Parameters](#unified-input-parameters-5)
      - [Unified Data Response](#unified-data-response-5)
      - [Event Listener](#event-listener-5)
  - [User](#user)
    - [Get Cart](#get-cart-1)
      - [Unified Input Parameters](#unified-input-parameters-6)
      - [Unified Data Response](#unified-data-response-6)
      - [Event Listener](#event-listener-6)
    - [Login](#login)
      - [Unified Input Parameters](#unified-input-parameters-7)
      - [Unified Data Response](#unified-data-response-7)
      - [Event Listener](#event-listener-7)
    - [Sign up](#sign-up)
      - [Unified Input Parameters](#unified-input-parameters-8)
      - [Unified Data Response](#unified-data-response-8)
      - [Event Listener](#event-listener-8)
    - [Forgot Password](#forgot-password)
      - [Unified Input Parameters](#unified-input-parameters-9)
      - [Unified Data Response](#unified-data-response-9)
      - [Event Listener](#event-listener-9)
    - [Logout](#logout)
      - [Unified Input Parameters](#unified-input-parameters-10)
      - [Unified Data Response](#unified-data-response-10)
      - [Event Listener](#event-listener-10)
  - [Wishlist](#wishlist)
    - [Get Wishlist](#get-wishlist)
      - [Unified Input Parameters](#unified-input-parameters-11)
      - [Unified Data Response](#unified-data-response-11)
      - [Event Listener](#event-listener-11)
    - [Add item to wishlist](#add-item-to-wishlist)
      - [Unified Input Parameters](#unified-input-parameters-12)
      - [Unified Data Response](#unified-data-response-12)
      - [Event Listener](#event-listener-12)
    - [Remove item from wishlist](#remove-item-from-wishlist)
      - [Unified Input Parameters](#unified-input-parameters-13)
      - [Unified Data Response](#unified-data-response-13)
      - [Event Listener](#event-listener-13)
  - [Unified data types](#unified-data-types)
    - [MakairaUser](#makairauser)
    - [MakairaProduct](#makairaproduct)
    - [MakairaReview](#makairareview)
- [How to add a shop adapter to your project](#how-to-add-a-shop-adapter-to-your-project)
- [How to extend the shop adapter functionality in the storefront](#how-to-extend-the-shop-adapter-functionality-in-the-storefront)
- [Contributing](#contributing)
  - [Understanding the MakairaShopProviderInteractor](#understanding-the-makairashopproviderinteractor)
  - [How to add new shop adapter specific features methods](#how-to-add-new-shop-adapter-specific-features-methods)
  - [How to add new feature methods for all shop adapters](#how-to-add-new-feature-methods-for-all-shop-adapters)
  - [How to add new feature for all shop adapters](#how-to-add-new-feature-for-all-shop-adapters)
  - [How to create a new shop adapter](#how-to-create-a-new-shop-adapter)
  - [How to add additional arguments to the constructor of an shop adapter](#how-to-add-additional-arguments-to-the-constructor-of-an-shop-adapter)
  - [Enforced standards](#enforced-standards)
  - [Testing](#testing)
    - [Manual testing](#manual-testing)
    - [Automatic testing](#automatic-testing)
- [Good to know](#good-to-know)
- [Known issues](#known-issues)

# Intention of the Shop Adapters

Makaira is offering a great e-commerce platform for the online shop of the future. We focus on bringing speed to your online shop and with our marketing and personalization focus we increase your revenue.
For our team speed has two perspective:

1. **The speed of the online shop.** That is what we're caring about for you.
2. **The speed of developing the storefront.** That's what we even want to solve for you as a developer and as a agency by supporting you with pre-developed shop adapters.

Our goal while the development where three points:

1. **Consistency**

   All of our costumers have different shop systems and our partner agencies have to support all of them. To keep adopting different shop systems as simple as possible we focused on developing a standardized framework. To achieve this, each adapter has the same base signature. If one of them requires additional information these can be added. In addition we also unified the response data to the basics that a storefront requires to run. But we know if a project is getting more complex it requires more data. Therefore we expose the raw api request responses.

2. **Frontend Stack Independency**

   We love developing shop systems. But why should we force you as a developer to adopt our software stack. Therefore all of our adapters are written in javascript without any dependency to frameworks like _React_ or _Vue.js_. In addition we know that fast websites requires _SSR_. Thats why we also made all of our adapter _SSR_ compatible.

   But to reduce your work connecting the adapter with your choice of love we added a _react_ layer to get your storefront reactive. If you missing a connector feel free to contribute.

3. **Customizability**

   At some point the dependency that was added to a project doesn't fit anymore the need and you have to develop it on your own. That is what we don't want for you. Our goal was to get everything that you have in mind could also be implemented. You are able to extend or overwrite each of the functionalities by defining the parts that you need without having to implement everything from scratch.

# Basic usage of a shop adapter

Each of our shop adapter is divided into five sub features. For simplicity we are now using the Local Shop Adapter that is simulating a shop in the localstorage. You are free to choose another one. For detailed information of additional parameters and raw responses see the documentation for the specific shop adapter.

```typescript
import { StorefrontShopAdapterLocal } from '@makaira/storefront-shop-adapter-local'

const client = new StorefrontShopAdapterLocal()
```

To accomplish a reactivity of the shop adapters, each of them implements the `EventTarget`. By this you can register event listener to let your app react to changes in the storefront. You can attach an event listener like in the following example. The events are associated with an action that a shop adapter is possible to perform like _login_. The events are only triggered in a case of success.

```typescript
import { UserLoginEvent } from '@makaira/storefront-types'

function setUser({ data: { data, raw } }) {}

client.addEventListener(UserLoginEvent.eventName, setUser)
```

The signature for each event follows the same standard. All events implement the `MessageEvent` class and they have the following `data` properties:

| Property | Required/Optional | Description                                                                                                          |
| -------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| data     | required          | The unified data response. This is equivalent to the `data` property returned by an shop adapter action.             |
| raw      | required          | The shop adapter specific api response. This is equivalent to the `raw` property returned by an shop adapter action. |

## Basic signature of each method

Every callable method shares the same signature. Let us look at the how the user login works.

```typescript
import { StorefrontShopAdapterLocal } from '@makaira/storefront-shop-adapter-local'

const client = new StorefrontShopAdapterLocal()

const { data, error, raw } = await client.user.login({
  input: { username: 'foo', password: 'bar' },
})
```

Each method **accepts one single argument that is an object**. In this you pass an **input property** that is also an object containing the method specific parameters. In this case it is the username and the password.

Every of our methods return a standardized _promise_. For us it was important that error handling should not be your part. Therefore every promise **resolves** and never rejects.
The resolved value is an object containing the following properties:

| Property | Required/Optional | Description                                                                                                                                                        |
| -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data     | optional          | The data property returns in each shop adapter the same unified result for each method. By this we achieve the consistency. If an error occur data is `undefined`. |
| error    | optional          | The error property indicates if an error occured. Depending on the shop adapter implementation the result differs.                                                 |
| raw      | optional          | The raw property returns the api results as they got returned. By them you are able to extend the functionality.                                                   |

## Cart

With the cart feature you can get the current cart of your customer and you can add, update and remove items from it.

### Get Cart

```typescript
const cart = await client.cart.getCart({ input: {} })

const { data, error, raw } = cart
```

#### Unified Input Parameters

| Parameters | Required/Optional | Description | Type |
| ---------- | ----------------- | ----------- | ---- |

#### Unified `Data` Response

| Property   | Required/Optional | Description                                             | Type                                |
| ---------- | ----------------- | ------------------------------------------------------- | ----------------------------------- |
| items[]    | required          | An array containing the items currently in the cart.    | `object`                            |
| - product  | required          | The product in the cart.                                | [`MakairaProduct`](#makairaproduct) |
| - quantity | required          | The quantity of how much of the product is in the cart. | `number`                            |

#### Event Listener

_Getters don't have an event listener_

### Add item to cart

```typescript
const result = await client.cart.addItem({
  input: {
    id: 'foo',
    quantity: 1,
    attributes: [
      {
        key: 'foo',
        value: 'bar',
      },
    ],
  },
})

const { data, error, raw } = result
```

#### Unified Input Parameters

| Parameters     | Required/Optional | Description                                                                                                                  |            |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------- |
| product        | required          | The product to add to the cart.                                                                                              | `object`   |
| - id           | required          | The id of the product. For most shop adapters this is the `productId`. But for Shopify for example might be the `variantId`. | `string`   |
| - attributes[] | optional          | An optional list of attributes that should be stored with the product. Not every shop adapter supports them.                 | `object[]` |
| -- key         | required          | The reference key to associate the value with.                                                                               | `string`   |
| -- value       | required          | The value to be set to the key.                                                                                              | `string`   |
| quantity       | required          | The quantity of how much of the product should be added.                                                                     | `number`   |

#### Unified `Data` Response

| Property   | Required/Optional | Description                                             | Type                                |
| ---------- | ----------------- | ------------------------------------------------------- | ----------------------------------- |
| items[]    | required          | An array containing the items currently in the cart.    | `object[]`                          |
| - product  | required          | The product in the cart. Is of type `MakairaProduct`.   | [`MakairaProduct`](#makairaproduct) |
| - quantity | required          | The quantity of how much of the product is in the cart. | `number`                            |

#### Event Listener

```typescript
import { CartAddItemEvent } from '@makaira/storefront-types'

function setNewCart({ data: { data, raw } }) {}

client.addEventListener(CartAddItemEvent.eventName, setNewCart)
```

_The data property is equivalent to the unified data response_

### Update Item from cart

```typescript
const result = await client.cart.updateItem({
  input: {
    id: 'foo',
    quantity: 2,
    attributes: [
      {
        key: 'foo',
        value: 'bar',
      },
    ],
  },
})

const { data, error, raw } = result
```

#### Unified Input Parameters

| Parameters     | Required/Optional | Description                                                                                                                  | Type       |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------- |
| product        | required          | The product to update from the cart.                                                                                         | `object`   |
| - id           | required          | The id of the product. For most shop adapters this is the `productId`. But for Shopify for example might be the `variantId`. | `string`   |
| - attributes[] | optional          | An optional list of attributes that should be stored with the product. Not every shop adapter supports them.                 | `object[]` |
| -- key         | required          | The reference key to associate the value with.                                                                               | `string`   |
| -- value       | required          | The value to be set to the key.                                                                                              | `string`   |

#### Unified `Data` Response

| Property   | Required/Optional | Description                                             | Type                                |
| ---------- | ----------------- | ------------------------------------------------------- | ----------------------------------- |
| items[]    | required          | An array containing the items currently in the cart.    | `object[]`                          |
| - product  | required          | The product in the cart. Is of type `MakairaProduct`.   | [`MakairaProduct`](#makairaproduct) |
| - quantity | required          | The quantity of how much of the product is in the cart. | `number`                            |

#### Event Listener

```typescript
import { CartUpdateItemEvent } from '@makaira/storefront-types'

function setNewCart({ data: { data, raw } }) {}

client.addEventListener(CartUpdateItemEvent.eventName, setNewCart)
```

_The data property is equivalent to the unified data response_

### Remove item from cart

```typescript
const result = await client.cart.removeItem({ input: { id: 'foo' } })

const { data, error, raw } = result
```

#### Unified Input Parameters

| Parameters     | Required/Optional | Description                                                                                                                  | Type       |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------- |
| product        | required          | The product to remove from the cart.                                                                                         | `object`   |
| - id           | required          | The id of the product. For most shop adapters this is the `productId`. But for Shopify for example might be the `variantId`. | `string`   |
| - attributes[] | optional          | An optional list of attributes that should be stored with the product. Not every shop adapter supports them.                 | `object[]` |
| -- key         | required          | The reference key to associate the value with.                                                                               | `string`   |
| -- value       | required          | The value to be set to the key.                                                                                              | `string`   |

#### Unified `Data` Response

| Property   | Required/Optional | Description                                             | Type                                |
| ---------- | ----------------- | ------------------------------------------------------- | ----------------------------------- |
| items[]    | required          | An array containing the items currently in the cart.    | `object[]`                          |
| - product  | required          | The product in the cart. Is of type `MakairaProduct`.   | [`MakairaProduct`](#makairaproduct) |
| - quantity | required          | The quantity of how much of the product is in the cart. | `number`                            |

#### Event Listener

```typescript
import { CartRemoveItemEvent } from '@makaira/storefront-types'

function setNewCart({ data: { data, raw } }) {}

client.addEventListener(CartRemoveItemEvent.eventName, setNewCart)
```

_The data property is equivalent to the unified data response_

## Checkout

Currently we are working on a checkout feature for our shop adapters. Feel free to support us developing the next extension.

## Review

With the review feature you can get reviews of a product and you can create new reviews.

### Get Reviews

```typescript
const reviews = await client.review.getReviews({
  input: { product: { id: 'foo' }, pagination: { limit: 10, offset: 0 } },
})

const { data, error, raw } = reviews
```

#### Unified Input Parameters

| Parameters | Required/Optional | Description                                                                                                                                                        | Type     |
| ---------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| product    | required          | The product for what you want to receive the reviews.                                                                                                              | `object` |
| - id       | required          | The id of the product. For most shop adapters this is the `productId`. But for Shopify for example might be the `variantId`.                                       | `string` |
| pagination | optional          | If you only want to receive a limited number of reviews you can use the pagination property. This property will only be respected if the shop supports pagination. | `object` |
| - limit    | optional          | The number of reviews to receive.                                                                                                                                  | `number` |
| - offset   | optional          | The starting offset from which on to receive reviews.                                                                                                              | `number` |

#### Unified `Data` Response

| Property | Required/Optional | Description                                                     | Type                              |
| -------- | ----------------- | --------------------------------------------------------------- | --------------------------------- |
| items[]  | required          | An array containing the review items for the requested product. | `object[]`                        |
| - review | required          | The review for the product. Is of type `MakairaReview`.         | [`MakairaReview`](#makairareview) |

#### Event Listener

_Getters don't have an event listener_

#### Create Review

```typescript
const result = await client.review.createReview({
  input: {
    review: {
      rating: 2,
      text: 'foo bar',
      product: {
        id: 'foo',
      },
    },
  },
})

const { data, error, raw } = result
```

#### Unified Input Parameters

| Parameters | Required/Optional | Description                                                                                                                  | Type     |
| ---------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- |
| review     | required          | The review to add to an product.                                                                                             | `object` |
| - rating   | required          | The product rating for this review. Range of the rating depends on the shop adapter.                                         | `number` |
| - text     | required          | The review text.                                                                                                             | `string` |
| - product  | required          | The product with that the review is associated.                                                                              | `object` |
| -- id      | required          | The id of the product. For most shop adapters this is the `productId`. But for Shopify for example might be the `variantId`. | `string` |

#### Unified `Data` Response

| Property | Required/Optional | Description                                                           | Type                              |
| -------- | ----------------- | --------------------------------------------------------------------- | --------------------------------- |
| review   | required          | The newly created review for the product. Is of type `MakairaReview`. | [`MakairaReview`](#makairareview) |

#### Event Listener

```typescript
import { ReviewCreateEvent } from '@makaira/storefront-types'

function setNewReview({ data: { data, raw } }) {}

client.addEventListener(ReviewCreateEvent.eventName, setNewReview)
```

_The data property is equivalent to the unified data response_

## User

With the user feature you can get the current signed in customer you can register, update and remove items from it.

### Get Cart

```typescript
const user = await client.user.getUser({ input: {} })

const { data, error, raw } = user
```

#### Unified Input Parameters

| Parameters | Required/Optional | Description | Type |
| ---------- | ----------------- | ----------- | ---- |

#### Unified `Data` Response

| Property | Required/Optional | Description                                             | Type                          |
| -------- | ----------------- | ------------------------------------------------------- | ----------------------------- |
| user     | required          | The currently signed in user. Is of type `MakairaUser`. | [`MakairaUser`](#makairauser) |

#### Event Listener

_Getters don't have an event listener_

### Login

```typescript
const result = await client.user.login({
  input: {
    username: 'foo',
    password: 'bar',
  },
})

const { data, error, raw } = result
```

#### Unified Input Parameters

| Parameters | Required/Optional | Description                                                         | Type     |
| ---------- | ----------------- | ------------------------------------------------------------------- | -------- |
| username   | required          | The username of the user. Could also be an email based on the shop. | `string` |
| password   | required          | The password of the user.                                           | `string` |

#### Unified `Data` Response

| Property | Required/Optional | Description                                         | Type                          |
| -------- | ----------------- | --------------------------------------------------- | ----------------------------- |
| user     | required          | The newly signed in user. Is of type `MakairaUser`. | [`MakairaUser`](#makairauser) |

#### Event Listener

```typescript
import { UserLoginEvent } from '@makaira/storefront-types'

function setUser({ data: { data, raw } }) {}

client.addEventListener(UserLoginEvent.eventName, setUser)
```

_The data property is equivalent to the unified data response_

### Sign up

```typescript
const result = await client.user.signup({
  input: {
    username: 'foo',
    password: 'bar',
  },
})

const { data, error, raw } = result
```

#### Unified Input Parameters

| Parameters | Required/Optional | Description                                                         | Type     |
| ---------- | ----------------- | ------------------------------------------------------------------- | -------- |
| username   | required          | The username of the user. Could also be an email based on the shop. | `string` |
| password   | required          | The password of the user.                                           | `string` |

#### Unified `Data` Response

| Property | Required/Optional | Description                                       | Type                          |
| -------- | ----------------- | ------------------------------------------------- | ----------------------------- |
| user     | required          | The new signed up user. Is of type `MakairaUser`. | [`MakairaUser`](#makairauser) |

#### Event Listener

```typescript
import { UserSignupEvent } from '@makaira/storefront-types'

function setUser({ data: { data, raw } }) {}

client.addEventListener(UserSignupEvent.eventName, setUser)
```

_The data property is equivalent to the unified data response_

### Forgot Password

```typescript
const result = await client.user.forgotPassword({
  input: {
    username: 'foo',
  },
})

const { data, error, raw } = result
```

#### Unified Input Parameters

| Parameters | Required/Optional | Description                                                         | Type     |
| ---------- | ----------------- | ------------------------------------------------------------------- | -------- |
| username   | required          | The username of the user. Could also be an email based on the shop. | `string` |

#### Unified `Data` Response

| Property | Required/Optional | Description | Type |
| -------- | ----------------- | ----------- | ---- |

#### Event Listener

_Currently their is no event listener for forgot password._

### Logout

```typescript
const result = await client.user.logout({
  input: {},
})

const { data, error, raw } = result
```

#### Unified Input Parameters

| Parameters | Required/Optional | Description | Type |
| ---------- | ----------------- | ----------- | ---- |

#### Unified `Data` Response

| Property | Required/Optional | Description | Type |
| -------- | ----------------- | ----------- | ---- |

#### Event Listener

```typescript
import { UserLogoutEvent } from '@makaira/storefront-types'

function setUser({ data: { data, raw } }) {}

client.addEventListener(UserLogoutEvent.eventName, setUser)
```

_The data property is equivalent to the unified data response_

## Wishlist

With the wishlist feature you can get the current wishlist of your customer and you can add and remove items from it.

### Get Wishlist

```typescript
const wishlist = await client.wishlist.getWishlist({ input: {} })

const { data, error, raw } = wishlist
```

#### Unified Input Parameters

| Parameters | Required/Optional | Description | Type |
| ---------- | ----------------- | ----------- | ---- |

#### Unified `Data` Response

| Property  | Required/Optional | Description                                               | Type                                |
| --------- | ----------------- | --------------------------------------------------------- | ----------------------------------- |
| items[]   | required          | An array containing the items currently in the wishlist.  | `object[]`                          |
| - product | required          | The product in the wishlist. Is of type `MakairaProduct`. | [`MakairaProduct`](#makairaproduct) |

#### Event Listener

_Getters don't have an event listener_

### Add item to wishlist

```typescript
const result = await client.wishlist.addItem({
  input: {
    id: 'foo',
    attributes: [
      {
        key: 'foo',
        value: 'bar',
      },
    ],
  },
})

const { data, error, raw } = result
```

#### Unified Input Parameters

| Parameters     | Required/Optional | Description                                                                                                                  | Type       |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------- |
| product        | required          | The product to add to the wishlist.                                                                                          | `object[]` |
| - id           | required          | The id of the product. For most shop adapters this is the `productId`. But for Shopify for example might be the `variantId`. | `string`   |
| - attributes[] | optional          | An optional list of attributes that should be stored with the product. Not every shop adapter supports them.                 | `object[]` |
| -- key         | required          | The reference key to associate the value with.                                                                               | `string`   |
| -- value       | required          | The value to be set to the key.                                                                                              | `string`   |

#### Unified `Data` Response

| Property  | Required/Optional | Description                                               | Type                                |
| --------- | ----------------- | --------------------------------------------------------- | ----------------------------------- |
| items[]   | required          | An array containing the items currently in the wishlist.  | `object[]`                          |
| - product | required          | The product in the wishlist. Is of type `MakairaProduct`. | [`MakairaProduct`](#makairaproduct) |

#### Event Listener

```typescript
import { WishlistAddItemEvent } from '@makaira/storefront-types'

function setNewWishlist({ data: { data, raw } }) {}

client.addEventListener(WishlistAddItemEvent.eventName, setNewWishlist)
```

_The data property is equivalent to the unified data response_

### Remove item from wishlist

```typescript
const result = await client.wishlist.removeItem({ input: { id: 'foo' } })

const { data, error, raw } = result
```

#### Unified Input Parameters

| Parameters     | Required/Optional | Description                                                                                                                  | Type       |
| -------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------- |
| product        | required          | The product to remove from the wishlist.                                                                                     | `object[]` |
| - id           | required          | The id of the product. For most shop adapters this is the `productId`. But for Shopify for example might be the `variantId`. | `string`   |
| - attributes[] | optional          | An optional list of attributes that are associated the product. Not every shop adapter supports them.                        | `object[]` |
| -- key         | required          | The reference key to associate the value with.                                                                               | `string`   |
| -- value       | required          | The value to be set to the key.                                                                                              | `string`   |

#### Unified `Data` Response

| Property  | Required/Optional | Description                                               | Type                                |
| --------- | ----------------- | --------------------------------------------------------- | ----------------------------------- |
| items[]   | required          | An array containing the items currently in the wishlist.  | `object[]`                          |
| - product | required          | The product in the wishlist. Is of type `MakairaProduct`. | [`MakairaProduct`](#makairaproduct) |

#### Event Listener

```typescript
import { WishlistRemoveItemEvent } from '@makaira/storefront-types'

function setNewWishlist({ data: { data, raw } }) {}

client.addEventListener(WishlistRemoveItemEvent.eventName, setNewWishlist)
```

_The data property is equivalent to the unified data response_

## Unified data types

### MakairaUser

| Parameters | Required/Optional | Description                 | Type     |
| ---------- | ----------------- | --------------------------- | -------- |
| id         | required          | The id of the user.         | `string` |
| firstname  | required          | The first name of the user. | `string` |
| lastname   | required          | The last name of the user.  | `string` |
| email      | required          | The email of the user.      | `string` |

### MakairaProduct

| Parameters   | Required/Optional | Description                                                                                                                  | Type       |
| ------------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------- |
| id           | required          | The id of the product. For most shop adapters this is the `productId`. But for Shopify for example might be the `variantId`. | `string`   |
| title        | required          | The title of the product.                                                                                                    | `string`   |
| url          | required          | The url to the product.                                                                                                      | `string`   |
| price        | required          | The price of the product.                                                                                                    | `number`   |
| images[]     | required          | A list of image urls associated with this product.                                                                           | `string[]` |
| attributes[] | optional          | An optional list of attributes that are associated the product. Not every shop adapter supports them.                        | `object[]` |
| - key        | required          | The reference key to associate the value with.                                                                               | `string`   |
| - value      | required          | The value to be set to the key.                                                                                              | `string`   |

### MakairaReview

| Parameters | Required/Optional | Description                                                                                                                  | Type     |
| ---------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- |
| id         | required          | The id of the review.                                                                                                        | `string` |
| rating     | required          | The product rating for this review. Range of the rating depends on the shop adapter.                                         | `number` |
| text       | required          | The review text.                                                                                                             | `string` |
| product    | required          | The product with that the review is associated.                                                                              | `object` |
| - id       | required          | The id of the product. For most shop adapters this is the `productId`. But for Shopify for example might be the `variantId`. | `string` |

## How to add a shop adapter to your project

Each of our adapters share the base signature. But some of the requires more parameters like shopify requires an access token. Therefore select your adapter and follow the specific documentation how to add them.

| Shop Adapter  | Documentation                                                              |
| ------------- | -------------------------------------------------------------------------- |
| Shopify       | [Documentation](/packages/storefront-shop-adapter-shopify/Readme.md)       |
| Oxid          | [Documentation](/packages/storefront-shop-adapter-oxid/Readme.md)          |
| Plentymarkets | [Documentation](/packages/storefront-shop-adapter-plentymarkets/Readme.md) |
| Local         | [Documentation](/packages/storefront-shop-adapter-local/Readme.md)         |

# How to extend the shop adapter functionality in the storefront

One of the main goals of the shop adapters is the customizability. This can be archived by extending our base feature classes (cart, user, e.g) where you can then overwrite or attach custom functionality to your needs.

To understand how it is working we go through an example using the _local shop adapter_.

The default way of creating a shop adapter looks like this.

```typescript
import { StorefrontShopAdapterLocal } from '@makaira/storefront-shop-adapter-local'

const client = new StorefrontShopAdapterLocal()
```

To overwrite the feature (cart, user, e.g) you just need to pass the property `providers` which is an optional object where you can set for each feature a custom provider. To create one you just need to extend the original provider.

```typescript
import {
  StorefrontShopAdapterLocalUser,
  StorefrontShopAdapterLocal,
  StorefrontShopAdapterLocalCart,
  StorefrontShopAdapterLocalCheckout,
  StorefrontShopAdapterLocalWishlist,
  StorefrontShopAdapterLocalReview,
} from '@makaira/storefront-shop-adapter-local'
import {
  MakairaShopProviderUser,
  MakairaShopProviderInteractor,
  MakairaLogout,
} from '@makaira/storefront-types'

class CustomUserProvider
  extends StorefrontShopAdapterLocalUser
  implements MakairaShopProviderUser
{
  // This is required because super only works on prototype members.
  // Look for more details here: https://basarat.gitbook.io/typescript/future-javascript/arrow-functions#tip-arrow-functions-and-inheritance
  private superLogout = this.logout

  constructor(mainAdapter: StorefrontShopAdapterLocal) {
    super(mainAdapter)
  }

  // We recommend you to use our base signature for each method.
  // When you use typescript you can safely archive this:
  setUserDisplayName: MakairaShopProviderInteractor<
    { inputVariable1: string },
    { returnedVariable1: string },
    { returnedRawVariable1: string },
    Error
  > = async ({ input: { inputVariable1 } }) => {
    return {
      raw: { returnedRawVariable1: inputVariable1 },
      data: { returnedVariable1: inputVariable1 },
      error: undefined,
    }

    // or with error
    return {
      raw: { returnedRawVariable1: inputVariable1 },
      data: undefined,
      error: new Error('some error'),
    }
  }

  // if you don't prefer using our base method signature define it yourself
  setUserDisplayName(inputVariable1: string) {
    return inputVariable1
  }

  // you can even overwrite existing methods
  logout: MakairaLogout<
    { additionalInput1: string },
    { customRawData1: string }
  > = async ({ input: { additionalInput1 } }) => {
    // The super only works on prototype members. Therefore we need to create a copy.
    // Look for more details here: https://basarat.gitbook.io/typescript/future-javascript/arrow-functions#tip-arrow-functions-and-inheritance
    const response = await this.superLogout({ input: {} })

    return {
      data: response.data,
      raw: { customRawData1: additionalInput1 },
      error: response.error,
    }
  }
}

const client = new StorefrontShopAdapterLocal<
  StorefrontShopAdapterLocalCart,
  StorefrontShopAdapterLocalCheckout,
  CustomUserProvider,
  StorefrontShopAdapterLocalWishlist,
  StorefrontShopAdapterLocalReview
>({
  providers: {
    user: CustomUserProvider,
  },
})
```

# Contributing

In this section we focus on how to contribute to the shop adapter packages. You can have four choices what you can contribute to:

1. **Add new shop adapter specific feature methods**. By this you add to a feature (like the _user_ feature) a new method that does not exists currently and is only specific for this single shop adapter (like a _customerReset_).
2. **Add new feature methods for all shop adapters**. By this you add a feature method that every shop adapter has to support like _forgotPassword_.
3. **Add new feature for all shop adapters**. By this you add a feature that every shop adapter has to support like the _user_ feature.

## Understanding the `MakairaShopProviderInteractor`

The most important part is that each feature method has to implement the `MakairaShopProviderInteractor` interface. The interface is defined as:

```typescript
export type MakairaResponse<ResData, ResRawData, ResError extends Error> = {
  data?: ResData // The response data property which the feature method returns. Can be undefined in a case of error or when no data has to be returned.
  raw: ResRawData // the response raw property which the feature method returns. Is by required but you can set it to undefined if you wish.
  error?: ResError // The type of error that could be returned. Currently each feature method uses an instance of Error.
}

export type MakairaShopProviderInteractorContext<Input> = {
  input: Input // The input data which the feature method receives.
}

export type MakairaShopProviderInteractor<
  Input = unknown, // The input data which the feature method receives.
  ResData = unknown, // The response data property which the feature method returns. Can be undefined in a case of error or when no data has to be returned.
  ResRawData = unknown, // the response raw property which the feature method returns. Is by required but you can set it to undefined if you wish.
  ResError extends Error = Error // The type of error that could be returned. Currently each feature method uses an instance of Error.
> = (
  context: MakairaShopProviderInteractorContext<Input>
) => Promise<MakairaResponse<ResData, ResRawData, ResError>>
```

Sometimes the generic type definition of the `MakairaShopProviderInteractor` can be a little bit complicated to understand. Therefore here are some common use cases how to use them:

```typescript
// Defining a feature method without input arguments.

export class StorefrontShopAdapterLocalUser implements MakairaShopProviderUser {
  foo: MakairaShopProviderInteractor<
    unknown, // To disable any input arguments set here to unknown
    { dataResponseVariable1: string },
    { rawResponseVariable1: string },
    Error
  > = async () => {}
}
```

```typescript
// Defining a feature method without return data or raw response.

export class StorefrontShopAdapterLocalUser implements MakairaShopProviderUser {
  foo: MakairaShopProviderInteractor<
    {inputVariable1:string}
    undefined, // Set this to undefined to have a response data property without data. The data and the raw property can be set independently to undefined.
    undefined, // Set this to undefined to have a response raw property without data. The data and the raw property can be set independently to undefined.
    Error
  > = async () => {}
}
```

```typescript
// Adjust the returned type of the error.

export class StorefrontShopAdapterLocalUser implements MakairaShopProviderUser {
  foo: MakairaShopProviderInteractor<
    unknown,
    { dataResponseVariable1: string },
    { rawResponseVariable1: string },
    NotImplementedError // Adjust this to set a custom error type.
  > = async () => {}
}
```

```typescript
// You can create a new type of it that is again generic. This is used when you add new feature methods for all shop adapters. Here is the example of the login

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

export type LocalLoginRaw = { rawResponseVariable1: string }

export class StorefrontShopAdapterLocalUser implements MakairaShopProviderUser {
  login: MakairaLogin<unknown, LocalLoginRaw, Error> = async ({
    input: { inputVariable1 },
  }) => {
    if (inputVariable1 !== 'foo') {
      return {
        data: undefined,
        raw: { rawResponseVariable1: inputVariable1 },
        error: new Error('inputVariable1 does not match foot'),
      }
    }

    return {
      data: { dataResponseVariable1: inputVariable1 },
      raw: { rawResponseVariable1: inputVariable1 },
      error: undefined,
    }
  }
}
```

## How to add new shop adapter specific features methods

To add new shop adapter specific feature method you just need to add the method to the class. In the following we add a feature method _foo_ to the _user_ feature of the local shop adapter.

Like described in [this section](#understanding-the-makairashopproviderinteractor) the feature method must implement the `MakairaShopProviderInteractor`. It has also to follow the [standard](#basic-signature-of-each-method).

```typescript
export class StorefrontShopAdapterLocalUser implements MakairaShopProviderUser {
  foo: MakairaShopProviderInteractor<
    { inputVariable1: string },
    { dataResponseVariable1: string },
    { rawResponseVariable1: string },
    Error
  > = async ({ input: { inputVariable1 } }) => {
    if (inputVariable1 !== 'foo') {
      return {
        data: undefined,
        raw: { rawResponseVariable1: inputVariable1 },
        error: new Error('inputVariable1 does not match foot'),
      }
    }

    return {
      data: { dataResponseVariable1: inputVariable1 },
      raw: { rawResponseVariable1: inputVariable1 },
      error: undefined,
    }
  }
}
```

## How to add new feature methods for all shop adapters

To add a new feature method to all shop adapters we have to touch all shop adapter and the main type definition.

At first we modify the `@makaira/storefront-types` package located in `packages/storefront-types`.

Choose the feature where you want to add a new feature method. Then go into the file `packages/storefront-types/src/providers/<FEATURE>.ts`.

As an example we create an _deleteUser_ feature method in the _user_ feature

First we have to create the unified signature definition. By this we enforce each shop provider to implement the same base usage to archive our goal of _consistency_.

```typescript
//#region type definition: deleteUser

// To have a better separation and a better reading we first create the input type. These are the input arguments that each shop adapter has to support. By the generic AdditionalInput it is possible to add more shop provider specific input arguments.

export type MakairaDeleteUserInput<AdditionalInput = unknown> = {
  username: string
} & AdditionalInput

// As an alternative where you don't need any basic input arguments you can also write the following:

export type MakairaDeleteUserInput<AdditionalInput = unknown> = AdditionalInput

// Next we define the unified response data. In the case of deleteUser we don't have any response data.
export type MakairaDeleteUserResData = undefined

// If you have any response data you can write the following:
export type MakairaDeleteUserResData = { resDataVariable1: boolean }

// And finally we have to combine everything using the MakairaShopProviderInteractor into a new generic type. This new type is again generic to allow each shop adapter to define it's own additional input arguments and their custom response raw data.
export type MakairaDeleteUser<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaDeleteUserInput<AdditionalInput>,
  MakairaDeleteUserResData,
  ResRawData,
  ResError
>
//#endregion
```

After we have added our unified signature for _deleteUser_ we now have to add it to the definition of the feature methods. At the end of each type definition feature file (`packages/storefront-types/src/providers/<FEATURE>.ts`) is the definition. Add to this the following:

```typescript
export type MakairaShopProviderUser = {
  login: MakairaLogin
  // ...
  // ...
  deleteUser: MakairaDeleteUser
}
```

After you added this automatically the typescript definition checkup will fail on each commit until you don't added the shop adapter specific implementation. This is what we will add now. Therefore go into each shop adapter feature and add the implementation. The file is located at `packages/<SHOP-ADAPTER>/src/providers/<FEATURE>.ts`

```typescript
export class StorefrontShopAdapterLocalUser implements MakairaShopProviderUser {
  constructor(private mainAdapter: StorefrontShopAdapterLocal) {}

  // Example 1: base usage without additional input variables and without raw data
  deleteUser: MakairaDeleteUser<unknown, undefined, Error> = async ({
    input: {},
  }) => {
    // your specific implementation ...
  }

  // Example 2: base usage with additional input variables and without raw data
  deleteUser: MakairaDeleteUser<{ confirm: boolean }, undefined, Error> =
    async ({ input: { confirm } }) => {
      // your specific implementation ...
    }

  // Example 3: base usage with additional input variables and with raw data
  deleteUser: MakairaDeleteUser<
    { confirm: boolean },
    { successful: boolean },
    Error
  > = async ({ input: { confirm } }) => {
    // your specific implementation ...
  }
}
```

We recommend to not inline the types for _AdditionalInput_ and _RawResData_. Outsource them into the types file `packages/<SHOP-ADAPTER>/src/types.ts`

## How to add new feature for all shop adapters

Adding a complete new feature is a little bit more work to be done.

In the following we add a new feature called _order_ to all shop adapters.

At first we have to create the unified type definition for our new _order_ feature. To do so create the file `src/providers/order.ts` in `@makaira/storefront-types`. Like in the section [how to add new feature for all shop adapters](#how-to-add-new-feature-for-all-shop-adapters) we create the unified type definition.

```typescript
import { MakairaShopProviderInteractor } from '../general/shop-provider-interactor'

//#region type definition: getOrders
export type MakairaGetOrdersInput<AdditionalInput = unknown> = {
  user: { id: string }
} & AdditionalInput

export type MakairaGetOrdersResData = {
  orders: { id: string; products: MakairaProduct[] }
}

export type MakairaGetOrders<
  AdditionalInput = any,
  ResRawData = any,
  ResError extends Error = Error
> = MakairaShopProviderInteractor<
  MakairaGetOrdersInput<AdditionalInput>,
  MakairaGetOrdersResData,
  ResRawData,
  ResError
>
//#endregion

//#region type definition: provider order
export type MakairaShopProviderOrder = {
  getOrders: MakairaGetOrders
}
```

Next you have to add the feature to the main interface that is located in the `src/providers/main.ts` in `@makaira/storefront-types`. We extend our generic types `MakairaShopProviderOptions` and `MakairaShopProvider` to accept the new feature. This leads to a BREAKING CHANGE, since AdditionalOptions should stay at the last position of the generic types.

```typescript
export type MakairaShopProviderOptions<
  CartProviderType = MakairaShopProviderCart,
  // ... other features/providers defined
  // ...
  OrderProviderType = MakairaShopProviderOrder, // <- add this here
  AdditionalOptions = unknown
> = {
  providers?: {
    cart?: Constructor<CartProviderType>
    // ... other features/providers defined
    // ...
    order?: Constructor<OrderProviderType> // <- add this here
  }
} & AdditionalOptions

export interface MakairaShopProvider<
  CartProviderType extends MakairaShopProviderCart = MakairaShopProviderCart,
  // ... other features/providers defined
  // ...
  OrderProviderType extends MakairaShopProviderOrder = MakairaShopProviderOrder // <- add this here
> extends EventTarget {
  cart: CartProviderType

  // ... other features/providers defined
  // ...

  order: OrderProviderType // <- add this here
}
```

In the following we get for each shop adapter a typescript error that we now fix by adding the new _order_ feature specific implementation to each shop adapter.

Therefore create in each shop adapter the file `src/providers/order.ts`. For simplicity we don't show how to add the enforced feature methods here. You can read about it in the section [how to add new feature for all shop adapters](#how-to-add-new-feature-for-all-shop-adapters).

```typescript
import { StorefrontShopAdapterLocal } from './main'

export class StorefrontShopAdapterLocalOrder
  implements MakairaShopProviderOrder
{
  constructor(private mainAdapter: StorefrontShopAdapterLocal) {}

  // ... shop adapter specific feature method implementations
}
```

At the last step we have to adjust our `main.ts` file in each shop adapter that is located at `src/providers/main.ts`. Their we have to adjust the generics and have to initialize the new feature.

```typescript
export class StorefrontShopAdapterLocal<
    CartProviderType extends MakairaShopProviderCart = StorefrontShopAdapterLocalCart,
    // ... other features/providers defined
    // ...
    OrderProviderType extends MakairaShopProviderOrder = StorefrontShopAdapterLocalOrder // <- add this here
  >
  extends EventTarget
  implements
    MakairaShopProvider<
      CartProviderType,
      // ... other features/providers defined
      // ...
      OrderProviderType // <- add this here
    >
{
  cart: CartProviderType

  // ... other features/providers defined
  // ...

  order: OrderProviderType // <- add this here

  constructor(
    options: MakairaShopProviderOptions<
      CartProviderType,
      // ... other features/providers defined
      // ...
      OrderProviderType // <- add this here
    > = {}
  ) {
    super()

    // Here are all other providers to destructed.
    // Because of our goal to make everything customizable as much as possible we assign here a default value instead of directly initializing our new created feature. So in the future feature overwriting by passing a custom provider is possible.
    const {
      cart: CartProvider = StorefrontShopAdapterLocalCart,
      // ... other features/providers defined
      // ...
      order: OrderProvider = StorefrontShopAdapterLocalOrder, // <- add this here
    } = options.providers ?? {}

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.cart = new CartProvider(this)

    // ... other features/providers defined
    // ...

    // @ts-expect-error https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
    this.order = new OrderProvider(this) // <- add this here
  }
}
```

Finally we added our new feature _order_.

## How to create a new shop adapter

Creating a new shop adapter is beside its specific implementation really simple. To do so we created a script that can be run from the root of this repository to create a new shop adapter. Just run the following command:

`npm run create-new-shop-provider <NEW-SHOP-ADAPTER-NAME> `

or

`yarn create-new-shop-provider <NEW-SHOP-ADAPTER-NAME> `

This will create a new folder in the packages folder with the naming convention `storefront-shop-adapter-<NEW-SHOP-ADAPTER-NAME>`.

The script automatically set up for you:

- creating an npm package that will be published under: `@makaira/storefront-shop-adapter-<NEW-SHOP-ADAPTER-NAME>`
- versioning the package
- validating the typescript configuration on each commit
- validating the code quality using eslint on each commit
- creating empty main adapter and feature classes
- build command

After you run the create command you have to implement the feature methods. If you finished it you can commit it and create a PR.

## How to add additional arguments to the constructor of an shop adapter

Sometimes a shop adapter needs some arguments to work. For example most adapters require a api url. We know that and this is why we added an option for this.

To add additional arguments to have to adjust the type definition of the main shop adapter class. The last argument of the generic type `MakairaShopProviderOptions` allows you to add a type definition for your additional arguments.

```typescript
class StorefrontShopAdapterDemo {
  constructor(
    options: MakairaShopProviderOptions<
      CartProviderType,
      CheckoutProviderType,
      UserProviderType,
      WishlistProviderType,
      ReviewProviderType,
      { apiUrl: string } // <-- add this here
    >
  ) {
    super()

    // custom code
    // ...
  }
}
```

## Enforced standards

To archive a high standard and consistency for the monorepo we added some checks to ensure them. Currently on each commit theses standards are enforced. If their is any problem the commit will fail and reports you what has to be adjusted. The checks are:

- each commit message must follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
- on each commit the type safety will be validated. If their is a problem the commit will fail.
- on each commit the code quality will be checked using eslint. If their is any problem the commit will fail.
- on each commit the formatting is adjusted to the standards using prettier.

## Testing

This monorepo allows you to run testing manually or automated.

### Manual testing

To run testing manually you can link your local npm package with your storefront or any other package that depends on one of the packages. To test it you have to do two steps:

1. Install the package using a relative path. Just edit the `package.json` and find the package you are editing and testing and replace the version with the path to the file. For example it looks like this:

```json
{
  "dependencies": {
    "@makaira/storefront-shop-adapter-oxid": "file:../../storefront-shop-adapter/packages/storefront-shop-adapter-oxid"
  }
}
```

2. On each change you made to the shop adapter you have to rebuild it. Just go into the shop adapter package folder and run `npm run build`. Feel free to add an implementation to run it in a watch mode to automatically rebuild on file changes.

### Automatic testing

The hole monorepo supports automated testing using jest tests. Feel free to add new jest test. They will be automatically detected. To run the test execute the command `npm run test` on the root of the monorepo or in each package.

# Good to know

1. When you are locally developing each package accesses the current implementation of code instead of the builded code. So if you for example add a new feature method for all shop adapters each of them will directly create a typescript error because they access the newly added code. It means that the version that stands in the dependencies does not matter.

2. The release of the packages is done automatically in the ci. To ensure that each package has the correct referenced version between them at first the `@makaira/storefront-types` will be published and then each package that requires `@makaira/storefront-types` will get the newly released version set.

3. The versions for each package will automatically calculated using [`semantic-release`](https://semantic-release.gitbook.io/semantic-release/) in the ci. So you don't have to worry about setting the correct versions.

4. The monorepo orchestration is done by [`turborepo`](https://turborepo.org/)

# Known issues

1. In some cases after a commit files seems to be changed. This comes by prettier we think. Prettier sets another file permissions that will be recorded by git. Just discard these changes.
