import { MakairaGetCartResData } from '@makaira/storefront-types'
import { CheckoutFragmentData } from '../providers/cart.queries'

export function lineItemsToMakairaCartItems(
  lineItems: CheckoutFragmentData['lineItems']
): MakairaGetCartResData['items'] {
  return lineItems.edges.map(({ node }) => ({
    product: {
      id: node.variant?.id ?? '',
      images: node.variant?.product.featuredImage?.url
        ? [node.variant?.product.featuredImage?.url]
        : [],
      price: node.variant?.priceV2.amount ?? 0,
      title: node.title,
      url: '', // TODO
      attributes: node.customAttributes,
    },
    quantity: node.quantity,
  }))
}
