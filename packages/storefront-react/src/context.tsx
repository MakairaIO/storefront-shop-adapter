import {
  CartAddItemEvent,
  MakairaResponse,
  UserLoginEvent,
  UserLogoutEvent,
  UserSignupEvent,
  CartRemoveItemEvent,
  CartUpdateItemEvent,
} from '@makaira/storefront-types'
import React, { useEffect, useRef, useState } from 'react'
import { StorefrontReactClient, StorefrontReactTypes } from './types'

export type ShopProviderProps = React.PropsWithChildren<{
  /*  The shop adapter client.
   */
  client: StorefrontReactClient['client']
  /*  With this parameters the loading strategy while bootstrapping can be adjusted.
      By default the cart, the user and the wishlist are loaded using each get method
      in the provider. By setting one to false loading is disabled.
      In addition a custom async function can be passed to have more control. 
  */
  bootstrap?: {
    /*  Define the bootstrapping strategy for the cart. Set it to true for loading cart
        by the provider get method. Set it to false for disabled loading at boot time.
        Set it to an async function for custom loading strategy
    */
    cart?:
      | boolean
      | (() => Promise<
          MakairaResponse<StorefrontReactTypes['cart'], any, Error>
        >)
    /*  Define the bootstrapping strategy for the cuserart. Set it to true for loading user
          by the provider get method. Set it to false for disabled loading at boot time.
          Set it to an async function for custom loading strategy
      */
    user?:
      | boolean
      | (() => Promise<
          MakairaResponse<StorefrontReactTypes['user'], any, Error>
        >)
    /*  Define the bootstrapping strategy for the wishlist. Set it to true for loading wishlist
          by the provider get method. Set it to false for disabled loading at boot time.
          Set it to an async function for custom loading strategy
      */
    wishlist?:
      | boolean
      | (() => Promise<
          MakairaResponse<StorefrontReactTypes['wishlist'], any, Error>
        >)
  }
}>

export type ShopContextData = {
  /*  The shop adapter client provided as prop to the ShopProvider.
   */
  client: undefined | StorefrontReactClient['client']
  /*  The current cart if it is loaded without any error. 
      Is null when an error occurred while bootstrapping.
      Is undefined when not loaded during bootstrapping.
      When after bootstrapping the cart is newly loaded and an error occur, the previous data will be kept.
  */
  cart: null | undefined | StorefrontReactTypes['cart']
  /*  The current user if it is loaded without any error. 
      Is null when an error occurred while bootstrapping.
      Is undefined when not loaded during bootstrapping.
      When after bootstrapping the cart is newly loaded and an error occur, the previous data will be kept.
  */
  user: null | undefined | StorefrontReactTypes['user']
  /*  The current wishlist if it is loaded without any error. 
      Is null when an error occurred while bootstrapping.
      Is undefined when not loaded during bootstrapping.
      When after bootstrapping the cart is newly loaded and an error occur, the previous data will be kept.
  */
  wishlist: null | undefined | StorefrontReactTypes['wishlist']
}

//#region create ShopContext and set default data

const ShopContext = React.createContext<ShopContextData>({
  client: undefined,
  cart: undefined,
  user: undefined,
  wishlist: undefined,
})

//#endregion

const ShopProvider: React.FC<ShopProviderProps> = ({
  children,
  client,
  bootstrap = { cart: true, user: true, wishlist: true },
}) => {
  // stores for holding the current state
  const [cart, setCart] = useState<ShopContextData['cart']>()
  const [user, setUser] = useState<ShopContextData['user']>()
  const [wishlist, setWishlist] = useState<ShopContextData['wishlist']>()

  // refs for checking if a bootstrap is running. Just checking if state is fulfilled isn't
  // enough because it is running async.
  const bootstrapCartRef = useRef(false)
  const bootstrapUserRef = useRef(false)
  const bootstrapWishlistRef = useRef(false)

  // run the bootstrap on startup. In addition run it each time when the bootstrap options
  // changes. Each bootstrap function will check if it has already bootstrapped. Therefore
  // no duplicated loading will cause.
  useEffect(() => {
    bootstrapProvider()
  }, [
    bootstrap.cart ?? true,
    bootstrap.user ?? true,
    bootstrap.wishlist ?? true,
  ])

  // register shop event handlers to update internal state to be reactive
  useEffect(() => {
    client.addEventListener(CartAddItemEvent.eventName, reloadCartAfterUpdate)
    client.addEventListener(
      CartRemoveItemEvent.eventName,
      reloadCartAfterUpdate
    )
    client.addEventListener(
      CartUpdateItemEvent.eventName,
      reloadCartAfterUpdate
    )

    client.addEventListener(UserSignupEvent.eventName, reloadUserAfterUpdate)
    client.addEventListener(UserLoginEvent.eventName, reloadUserAfterUpdate)
    client.addEventListener(UserLogoutEvent.eventName, reloadUserAfterUpdate)

    return () => {
      client.removeEventListener(
        CartAddItemEvent.eventName,
        reloadCartAfterUpdate
      )
      client.removeEventListener(
        CartRemoveItemEvent.eventName,
        reloadCartAfterUpdate
      )
      client.removeEventListener(
        CartUpdateItemEvent.eventName,
        reloadCartAfterUpdate
      )

      client.removeEventListener(
        UserSignupEvent.eventName,
        reloadUserAfterUpdate
      )
      client.removeEventListener(
        UserLoginEvent.eventName,
        reloadUserAfterUpdate
      )
      client.removeEventListener(
        UserLogoutEvent.eventName,
        reloadUserAfterUpdate
      )
    }
  }, [])

  /**
   * combining all bootstrapping functions into one
   */
  async function bootstrapProvider() {
    await Promise.all([bootstrapCart(), bootstrapUser(), bootstrapWishlist()])
  }

  /**
   * bootstrap the cart function
   */
  async function bootstrapCart() {
    // check if a bootstrap is already running to prevent multiple parallel running bootstraps
    if (bootstrapCartRef.current === true) {
      return
    }

    // set that bootstrapping is currently running to prevent multiple parallel running bootstraps
    bootstrapCartRef.current = true

    // load cart if not already loaded by the default cart get method
    if (cart === undefined && bootstrap.cart === true) {
      const res = await client.cart
        .getCart({ input: {} })
        .catch(() => ({ data: undefined, error: new Error('unknown error') }))

      setCart(res.data ?? null)
    }
    // load cart if not already loaded by the custom cart loader
    else if (cart === undefined && typeof bootstrap.cart === 'function') {
      const res = await bootstrap
        .cart()
        .catch(() => ({ data: undefined, error: new Error('unknown error') }))

      setCart(res.data ?? null)
    }

    // mark bootstrapping as completed
    bootstrapCartRef.current = false
  }

  /**
   * bootstrap the user function
   */
  async function bootstrapUser() {
    // check if a bootstrap is already running to prevent multiple parallel running bootstraps
    if (bootstrapUserRef.current === true) {
      return
    }

    // set that bootstrapping is currently running to prevent multiple parallel running bootstraps
    bootstrapUserRef.current = true

    // load user if not already loaded by the default user get method
    if (user === undefined && bootstrap.user === true) {
      const res = await client.user
        .getUser({ input: {} })
        .catch(() => ({ data: undefined, error: new Error('unknown error') }))

      setUser(res.data ?? null)
    }
    // load user if not already loaded by the custom user loader
    else if (user === undefined && typeof bootstrap.user === 'function') {
      const res = await bootstrap
        .user()
        .catch(() => ({ data: undefined, error: new Error('unknown error') }))

      setUser(res.data ?? null)
    }

    // mark bootstrapping as completed
    bootstrapUserRef.current = false
  }

  /**
   * bootstrap the wishlist function
   */
  async function bootstrapWishlist() {
    // check if a bootstrap is already running to prevent multiple parallel running bootstraps
    if (bootstrapWishlistRef.current === true) {
      return
    }

    // set that bootstrapping is currently running to prevent multiple parallel running bootstraps
    bootstrapWishlistRef.current = true

    // load wishlist if not already loaded by the default wishlist get method
    if (wishlist === undefined && bootstrap.wishlist === true) {
      const res = await client.wishlist
        .getWishlist({ input: {} })
        .catch(() => ({ data: undefined, error: new Error('unknown error') }))

      setWishlist(res.data ?? null)
    }
    // load wishlist if not already loaded by the custom wishlist loader
    else if (
      wishlist === undefined &&
      typeof bootstrap.wishlist === 'function'
    ) {
      const res = await bootstrap
        .wishlist()
        .catch(() => ({ data: undefined, error: new Error('unknown error') }))

      setWishlist(res.data ?? null)
    }

    // mark bootstrapping as completed
    bootstrapWishlistRef.current = false
  }

  /**
   *  method to reload the cart after a shop cart event fires that the cart has a change
   */
  async function reloadCartAfterUpdate() {
    const res = await client.cart.getCart({ input: {} })

    if (res.data) {
      setCart(res.data)
    }
  }

  /**
   *  method to reload the user after a shop user event fires that the user has a change
   */
  async function reloadUserAfterUpdate() {
    const res = await client.user.getUser({ input: {} })

    if (res.data) {
      setUser(res.data)
    }
  }

  return (
    <ShopContext.Provider
      value={{
        client,
        cart,
        user,
        wishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

export { ShopContext, ShopProvider }
