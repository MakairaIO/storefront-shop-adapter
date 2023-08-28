import { ShopwareProduct } from '../types'

export function getLineItemImages(lineItem: ShopwareProduct) {
  if (!lineItem.cover) return []

  const { thumbnails, url } = lineItem.cover
  const images: string[] = []

  if (url) images.push(url)
  if (thumbnails && thumbnails.length > 0) {
    const thumbnailUrls = thumbnails
      .sort((a, b) => {
        if (a.width > b.width) return 1
        else if (a.width === b.width) return 0
        return -1
      })
      .map((thumbnail) => thumbnail.url)
    images.push(...thumbnailUrls)
  }

  return images
}
