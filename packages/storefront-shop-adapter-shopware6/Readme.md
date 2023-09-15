# @makaira/storefront-shop-adapter-shopware6

This shop adapter can be used to connect your shopware6 shop with your storefront. This adapter is developed based on the [shopware-store-api](https://shopware.stoplight.io/docs/store-api).

## Installation

`yarn install @makaira/storefront-types @makaira/storefront-shop-adapter-shopware6`

or

`npm install @makaira/storefront-types @makaira/storefront-shop-adapter-shopware6`

## Adding to your project

### Basic usage

```typescript
import { StorefrontShopAdapterShopware6 } from '@makaira/storefront-shop-adapter-shopware6'

const client = new StorefrontShopAdapterShopware6({
  url: '<SHOPWARE6-API-BASE-URL>',
  accessToken: '<SHOPWARE6-API-TOKEN>',
})
```

You can find the correct access key within your [admin panel's sales channel configuration](https://docs.shopware.com/en/shopware-6-en/settings/saleschannel#api-access) in the section labeled API Access.

### Usage with `@makaira/storefront-react`

```tsx
import { StorefrontShopAdapterShopware6 } from '@makaira/storefront-shop-adapter-shopware6'
import { ShopProvider } from '@makaira/storefront-react'

const shopClient = new StorefrontShopAdapterShopware6({
  url: '<SHOPWARE6-API-BASE-URL>',
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
import { StorefrontShopAdapterShopware6 } from '@makaira/storefront-shop-adapter-shopware6'

declare module '@makaira/storefront-react' {
  interface StorefrontReactCustomClient {
    client: StorefrontShopAdapterShopware6
  }
}
```

## Additional constructor arguments

| Argument    | Required | Description                                                                                                                                                                             | Type             |
| ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| url         | required | The base api url to made requests again.                                                                                                                                                | `string`         |
| accessToken | required | identifies the sales channel                                                                                                                                                            | `string`         |
| storage     | optional | A storage engine for persisting data. This is by default the `LocalStorage` that is working in SSR. On Server Side every read and write will not be performed but not creates an error. | `MakairaStorage` |

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
| - createWishlist | ✅        |
| checkout         |           |
| - getCheckout    | ❌        |
| - submit         | ❌        |

## Additional input properties

### Cart

#### getCart

_No additional properties_

#### addItem

| Property     | Required/Optional | Description                                                                                | Type      |
| ------------ | ----------------- | ------------------------------------------------------------------------------------------ | --------- |
| product.id   | required          | Unique identity of type of entity.                                                         | `string`  |
| good         | required          | When set to true, it indicates the line item is physical else it is virtual.               | `boolean` |
| referencedId | required          | Unique identity of type of entity.                                                         | `string`  |
| type         | required          | Type refers to the entity type of an item whether it is product or promotion for instance. | `string`  |
| quantity     | Optional          | Number of items of product. Required when type = `"product"`                               | `number`  |

#### removeItem

| Property   | Required/Optional | Description                        | Type     |
| ---------- | ----------------- | ---------------------------------- | -------- |
| product.id | required          | Unique identity of type of entity. | `string` |

#### updateItem

| Property   | Required/Optional | Description                                                           | Type     |
| ---------- | ----------------- | --------------------------------------------------------------------- | -------- |
| product.id | required          | Unique identity of type of entity.                                    | `string` |
| quantity   | Optional          | Number of items of product changing. Required when type = `"product"` | `number` |

### Review

#### getReviews

| Property                                                                                                                     | Required/Optional | Description                                                                                                                         | Type     |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------- |
| product.id                                                                                                                   | required          | Unique identity of type of entity.                                                                                                  | `string` |
| pagination                                                                                                                   | Optional          | Paginate response items                                                                                                             | `object` |
| search-queries: `filter, associations, includes, total-count-mode, post-filter, query, sort, aggregations, grouping, fields` | Optional          | Query to filter response with [condition](https://shopware.stoplight.io/docs/store-api/cf710bf73d0cd-search-queries#search-queries) | `object` |

#### createReview

| Property          | Required/Optional | Description                                                                              | Type     |
| ----------------- | ----------------- | ---------------------------------------------------------------------------------------- | -------- |
| review.product.id | Required          | Unique identity of type of entity.                                                       | `string` |
| review.rating     | Required          | The review rating for the product.                                                       | `double` |
| review.text       | Required          | The content of review.                                                                   | `string` |
| title             | Required          | The title of the review.                                                                 | `string` |
| headline          | optional          | An optional headline for this review.                                                    | `string` |
| email             | optional          | The email address of the review author. If not set, the email of the customer is chosen. | `string` |
| name              | optional          | The name of the review author. If not set, the first name of the customer is chosen.     | `string` |

### User

#### getUser

_No additional properties_

#### login

| Property | Required/Optional | Description | Type     |
| -------- | ----------------- | ----------- | -------- |
| username | Required          | Email.      | `string` |
| password | Required          | Password.   | `string` |

#### logout

_No additional properties_

#### signup

| Property                 | Required/Optional | Description                                                               | Type     |
| ------------------------ | ----------------- | ------------------------------------------------------------------------- | -------- |
| username                 | Required          | Email of the customer.                                                    | `string` |
| password                 | Required          | Password for the customer.                                                | `string` |
| firstName                | Required          | Customer first name.                                                      | `string` |
| lastName                 | Required          | Customer last name.                                                       | `string` |
| storefrontUrl            | Required          | URL of the storefront for that registration. Used in confirmation emails. | `string` |
| billingAddress.countryId | Required          | Unique identity of country.                                               | `string` |
| billingAddress.city      | Required          | Name of customer's city.                                                  | `string` |
| billingAddress.street    | Required          | Name of customer's street.                                                | `string` |

Other properties check on [document](https://shopware.stoplight.io/docs/store-api/b08a8858e0c5d-register-a-customer)

#### forgotPassword

| Property      | Required/Optional | Description                                                                                                                               | Type     |
| ------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| username      | Required          | Email.                                                                                                                                    | `string` |
| storefrontUrl | Required          | URL of the storefront to use for the generated reset link. It has to be a domain that is configured in the sales channel domain settings. | `string` |

### Wishlist

#### getWishlist

| Property                                                                                                                     | Required/Optional | Description                                                                                                                         | Type     |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------- |
| search-queries: `filter, associations, includes, total-count-mode, post-filter, query, sort, aggregations, grouping, fields` | Optional          | Query to filter response with [condition](https://shopware.stoplight.io/docs/store-api/cf710bf73d0cd-search-queries#search-queries) | `object` |

Other properties check on [document](https://shopware.stoplight.io/docs/store-api/14f94ff26ea3b-fetch-a-wishlist)

#### addItem

| Property  | Required/Optional | Description                            | Type     |
| --------- | ----------------- | -------------------------------------- | -------- |
| productId | Required          | Identifier of the product to be added. | `string` |

Other properties check on [document](https://shopware.stoplight.io/docs/store-api/b2d281de3cdd6-add-a-product-to-a-wishlist)

#### removeItem

| Property  | Required/Optional | Description                                                    | Type     |
| --------- | ----------------- | -------------------------------------------------------------- | -------- |
| productId | Required          | The identifier of the product to be removed from the wishlist. | `string` |

Other properties check on [document](https://shopware.stoplight.io/docs/store-api/e4e034e43e4d3-remove-a-product-from-a-wishlist)

#### createWishlist

| Property   | Required/Optional | Description      | Type            |
| ---------- | ----------------- | ---------------- | --------------- |
| productIds | Optional          | List product id. | `array[string]` |

Other properties check on [document](https://shopware.stoplight.io/docs/store-api/e1d8a35023a23-create-a-wishlist-for-a-customer)
