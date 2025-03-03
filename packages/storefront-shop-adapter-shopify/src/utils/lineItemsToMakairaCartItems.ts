import { MakairaGetCartResData } from '@makaira/storefront-types'
import { CheckoutFragmentData } from '../providers/cart.queries'

export function lineItemsToMakairaCartItems(
  lineItems: CheckoutFragmentData['lines']
): MakairaGetCartResData['items'] {
  return lineItems.edges.map(({ node }) => ({
    product: {
      id: node.id ?? '',
      merchandiseId: node.merchandise?.id,
      images: node.merchandise?.product.featuredImage?.url
        ? [node.merchandise?.product.featuredImage?.url]
        : [],
      price: node.merchandise?.price.amount ?? 0,
      title:
        node.merchandise?.title !== 'Default Title'
          ? node.merchandise?.title
          : node.merchandise?.product?.title,
      url: '', // TODO
      attributes: node.attributes,
    },
    quantity: node.quantity,
  }))
}
