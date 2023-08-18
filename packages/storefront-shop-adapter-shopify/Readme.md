# @makaira/storefront-shop-adapter-shopify

This shop adapter can be used to connect your shopify shop with your storefront. This adapter is developed based on the shopify storefront api.

## Installation

`yarn install @makaira/storefront-types @makaira/storefront-shop-adapter-shopify`

or

`npm install @makaira/storefront-types @makaira/storefront-shop-adapter-shopify`

## Adding to your project

### Basic usage

```typescript
import { StorefrontShopAdapterShopify } from '@makaira/storefront-shop-adapter-shopify'

const client = new StorefrontShopAdapterShopify({
  url: '<SHOPIFY-GRAPHQL-STOREFRONT-API-URL>',
  accessToken: '<SHOPIFY-GRAPHQL-STOREFRONT-API-ACCESS-TOKEN>',
})
```

### Usage with `@makaira/storefront-react`

```tsx
import { StorefrontShopAdapterShopify } from '@makaira/storefront-shop-adapter-shopify'
import { ShopProvider } from '@makaira/storefront-react'

const client = new StorefrontShopAdapterShopify({
  url: '<SHOPIFY-GRAPHQL-STOREFRONT-API-URL>',
  accessToken: '<SHOPIFY-GRAPHQL-STOREFRONT-API-ACCESS-TOKEN>',
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
import { StorefrontShopAdapterShopify } from '@makaira/storefront-shop-adapter-shopify'

declare module '@makaira/storefront-react' {
  interface StorefrontReactCustomClient {
    client: StorefrontShopAdapterShopify
  }
}
```

## Additional constructor arguments

| Argument | Required/Optional | Description | Type |
| -------- | ----------------- | ----------- | ---- |

| Argument                    | Required/Optional | Description                                                                                                                                                                                                                                                    | Type                                                                                       |
| --------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| url                         | required          | The graphql storefront api url to made requests again.                                                                                                                                                                                                         | `string`                                                                                   |
| accessToken                 | required          | The graphql storefront api access token. This must have the following scopes: `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`,`unauthenticated_read_product_listings`, `unauthenticated_read_customers`, `unauthenticated_write_customers` | `string`                                                                                   |
| storage                     | optional          | A storage engine for persisting data. This is by default the `LocalStorage` that is working in SSR. On Server Side every read and write will not be performed but not creates an error.                                                                        | `MakairaStorage`                                                                           |
| fragments                   | optional          | An object to overwrite the used fragments to customize the the responsed raw data. See for more details [here](#customize-used-fragments).                                                                                                                     | `object`                                                                                   |
| - checkoutFragment          | optional          | Fragment for the shopify `Checkout` object                                                                                                                                                                                                                     | `string`                                                                                   |
| - checkoutUserErrorFragment | optional          | Fragment for the shopify `CheckoutUserError` object                                                                                                                                                                                                            | `string`                                                                                   |
| - customerFragment          | optional          | Fragment for the shopify `Customer` object                                                                                                                                                                                                                     | `string`                                                                                   |
| - userErrorFragment         | optional          | Fragment for the shopify `UserError` object                                                                                                                                                                                                                    | `string`                                                                                   |
| - customerUserErrorFragment | optional          | Fragment for the shopify `CustomerUserError` object                                                                                                                                                                                                            | `string`                                                                                   |
| contextOptions              | optional          | An objective to override the context in which the checkout will be created.                                                                                                                                                                                    | `object`                                                                                   |
| - country                   | optional          | The country of the customer in which the checkout will be created.                                                                                                                                                                                             | `CountryCode` [Shopify-Docs](https://shopify.dev/api/storefront/2022-07/enums/CountryCode) |
| - language                  | optional          | The language in which the checkout will be created.                                                                                                                                                                                                            | `string`                                                                                   |

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
| - signup         | ✅        |
| - getUser        | ✅        |
| - forgotPassword | ✅        |
| - update         | ✅        |
| - activate       | ✅        |
| - updatePassword | ✅        |
| - addressUpdate  | ✅        |
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

| Property    | Required/Optional | Description                                                                                                                                                                                                                                                   | Type       |
| ----------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| lineItemIds | required          | In Shopify it is not possible to remove a product by its variantId. Instead the lineItemId is required. In this case the `product` property is disabled and ignored. Use only the lineItemsId. These can be accessed through the `raw` property on `getCart`. | `string[]` |

#### updateItem

| Property   | Required/Optional | Description                                                                                                                                                                                            | Type     |
| ---------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| lineItemId | required          | In Shopify it is not possible to update a product in the shopping cart only by its variantId. Instead both IDs are required. The `lineItemId` can be accessed through the `raw` property on `getCart`. | `string` |

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

_No additional properties_

#### forgotPassword

_No additional properties_

### Wishlist

#### getWishlist

_Not implemented_

#### addItem

_Not implemented_

#### removeItem

_Not implemented_

## Customize used Fragments

In graphql you get what your request. Our base implementation only requests the minium amount of data to get the unified data response collected.

When your storefront grows you need even more data. Therefore you can customize the underlying fragments.

In the following explanation is shown, how to set a custom fragment and what is the basic fragment that is required so the adapter won't crash.

You can then access the data through the returned `raw` data on each functionality method.

### checkoutFragment

```typescript
import { StorefrontShopAdapterShopify } from '@makaira/storefront-shop-adapter-shopify'

const minimumCheckoutFragment = `
    fragment CheckoutFragment on Checkout {
        id
        lineItems(first: 50) {
            edges {
                node {
                    id
                    title
                    quantity
                    variant {
                        priceV2 {
                            amount
                            currencyCode
                        }
                        product {
                            featuredImage {
                                url
                            }
                        }
                    }
                    customAttributes {
                        key
                        value
                    }
                }
            }
        }
        completedAt
        webUrl
    }
`

const client = new StorefrontShopAdapterShopify({
  url: '<SHOPIFY-GRAPHQL-STOREFRONT-API-URL>',
  accessToken: '<SHOPIFY-GRAPHQL-STOREFRONT-API-ACCESS-TOKEN>',
  fragments: {
    checkoutFragment: minimumCheckoutFragment,
  },
})
```

**When using with typescript**

When you use typescript it is also possible to get the raw data correctly typed. Therefore create a new declaration file (e.g `index.d.ts`) with the following content:

```typescript
import '@makaira/storefront-shop-adapter-shopify'

// You can set here the correct typescript definition of your custom fragment
type NewCheckoutFragment = {
  id: string
}

declare module '@makaira/storefront-shop-adapter-shopify' {
  interface StorefrontShopifyCustomFragments {
    checkoutFragment: NewCheckoutFragment
  }
}
```

### checkoutUserErrorFragment

```typescript
import { StorefrontShopAdapterShopify } from '@makaira/storefront-shop-adapter-shopify'

const minimumCheckoutUserErrorFragment = `
    fragment CheckoutUserErrorFragment on CheckoutUserError {
        field
        message
    }
`

const client = new StorefrontShopAdapterShopify({
  url: '<SHOPIFY-GRAPHQL-STOREFRONT-API-URL>',
  accessToken: '<SHOPIFY-GRAPHQL-STOREFRONT-API-ACCESS-TOKEN>',
  fragments: {
    checkoutUserErrorFragment: minimumCheckoutUserErrorFragment,
  },
})
```

**When using with typescript**

When you use typescript it is also possible to get the raw data correctly typed. Therefore create a new declaration file (e.g `index.d.ts`) with the following content:

```typescript
import '@makaira/storefront-shop-adapter-shopify'

// You can set here the correct typescript definition of your custom fragment
type NewCheckoutUserErrorFragment = {
  field: string
}

declare module '@makaira/storefront-shop-adapter-shopify' {
  interface StorefrontShopifyCustomFragments {
    checkoutUserErrorFragment: NewCheckoutUserErrorFragment
  }
}
```

### customerFragment

```typescript
import { StorefrontShopAdapterShopify } from '@makaira/storefront-shop-adapter-shopify'

const minimumCustomerFragment = `
    fragment CustomerFragment on Customer {
        id
        firstName
        lastName
        email
    }
`

const client = new StorefrontShopAdapterShopify({
  url: '<SHOPIFY-GRAPHQL-STOREFRONT-API-URL>',
  accessToken: '<SHOPIFY-GRAPHQL-STOREFRONT-API-ACCESS-TOKEN>',
  fragments: {
    customerFragment: minimumCustomerFragment,
  },
})
```

**When using with typescript**

When you use typescript it is also possible to get the raw data correctly typed. Therefore create a new declaration file (e.g `index.d.ts`) with the following content:

```typescript
import '@makaira/storefront-shop-adapter-shopify'

// You can set here the correct typescript definition of your custom fragment
type NewCustomerFragment = {
  id: string
}

declare module '@makaira/storefront-shop-adapter-shopify' {
  interface StorefrontShopifyCustomFragments {
    customerFragment: NewCustomerFragment
  }
}
```

### userErrorFragment

```typescript
import { StorefrontShopAdapterShopify } from '@makaira/storefront-shop-adapter-shopify'

const minimumUserErrorFragment = `
    fragment UserErrorFragment on UserError {
        field
        message
    }
`

const client = new StorefrontShopAdapterShopify({
  url: '<SHOPIFY-GRAPHQL-STOREFRONT-API-URL>',
  accessToken: '<SHOPIFY-GRAPHQL-STOREFRONT-API-ACCESS-TOKEN>',
  fragments: {
    userErrorFragment: minimumUserErrorFragment,
  },
})
```

**When using with typescript**

When you use typescript it is also possible to get the raw data correctly typed. Therefore create a new declaration file (e.g `index.d.ts`) with the following content:

```typescript
import '@makaira/storefront-shop-adapter-shopify'

// You can set here the correct typescript definition of your custom fragment
type NewUserErrorFragment = {
  field: string
}

declare module '@makaira/storefront-shop-adapter-shopify' {
  interface StorefrontShopifyCustomFragments {
    userErrorFragment: NewUserErrorFragment
  }
}
```

### customerUserErrorFragment

```typescript
import { StorefrontShopAdapterShopify } from '@makaira/storefront-shop-adapter-shopify'

const minimumCustomerUserErrorFragment = `
    fragment CustomerUserErrorFragment on CustomerUserError {
        field
        message
    }
`

const client = new StorefrontShopAdapterShopify({
  url: '<SHOPIFY-GRAPHQL-STOREFRONT-API-URL>',
  accessToken: '<SHOPIFY-GRAPHQL-STOREFRONT-API-ACCESS-TOKEN>',
  fragments: {
    customerUserErrorFragment: minimumCustomerUserErrorFragment,
  },
})
```

**When using with typescript**

When you use typescript it is also possible to get the raw data correctly typed. Therefore create a new declaration file (e.g `index.d.ts`) with the following content:

```typescript
import '@makaira/storefront-shop-adapter-shopify'

// You can set here the correct typescript definition of your custom fragment
type NewCustomerUserErrorFragment = {
  field: string
}

declare module '@makaira/storefront-shop-adapter-shopify' {
  interface StorefrontShopifyCustomFragments {
    customerUserErrorFragment: NewCustomerUserErrorFragment
  }
}
```

## Update language and country of checkout

The `StorefrontShopAdapterShopify` exposes for changing the country and language of a checkout this method

```typescript
setContextOptions({
  input: {
    options: { country: '', language: '' },
    lineItems: [],
  },
})
```

When this method is called a new checkout will the provided options will be created.
Additionally, the options are stored in the localStorage so that after a reload of the page the options are still available.

You can also provide the lineItems to be added to the new checkout so that they won't get lost.

Example: Updating the checkout to use english as language and Great Britain as country whilst the checkout items survive.

```typescript
const { client } = useShopClient()
const { cart } = useShopCart()

function updateContext() {
  client.setContextOptions({
    input: {
      options: {
        country: 'GB',
        language: 'EN',
      },
      lineItems: cart.items,
    },
  })
}
```

The correct country codes can be found at the [Shopify Documentation](https://shopify.dev/api/storefront/2022-07/enums/CountryCode)
The same applies to the [language codes](https://shopify.dev/api/storefront/2022-07/enums/LanguageCode)
