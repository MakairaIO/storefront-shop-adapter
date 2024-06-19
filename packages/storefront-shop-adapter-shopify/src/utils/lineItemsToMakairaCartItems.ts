import { MakairaGetCartResData } from '@makaira/storefront-types'
import { CartFragmentData } from '../providers/cart.queries'

export function lineItemsToMakairaCartItems(
  lineItems: CartFragmentData['lines']
): MakairaGetCartResData['items'] {
  return lineItems.nodes.map((node) => ({
    product: {
      id: node.merchandise.product.id ?? '',
      images: node.merchandise?.product.featuredImage?.url
        ? [node.merchandise?.product.featuredImage?.url]
        : [],
      price: node.merchandise?.price.amount ?? 0,
      title: node.merchandise.product.title,
      url: '', // TODO
      attributes: node.attributes,
    },
    quantity: node.quantity,
  }))
}
