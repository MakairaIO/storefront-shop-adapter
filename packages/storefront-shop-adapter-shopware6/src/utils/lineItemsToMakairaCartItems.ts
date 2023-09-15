import { MakairaGetCartResData } from '@makaira/storefront-types'
import { ShopwareProduct } from '../types'
import { getLineItemImages } from './getLineItemImages'

export function lineItemsToMakairaCartItems(
  lineItems: ShopwareProduct[]
): MakairaGetCartResData['items'] {
  return lineItems.map((item) => {
    return {
      quantity: item.quantity,
      product: {
        id: item.id,
        price: item.price.totalPrice,
        title: item.label,
        images: getLineItemImages(item),
        url: '', // TODO
      },
    }
  })
}
