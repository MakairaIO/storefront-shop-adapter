import { MakairaRemoveItemFromWishlistResData } from '../../providers'

export class WishlistRemoveItemEvent<
  EventDataRaw = undefined
> extends MessageEvent<{
  data: MakairaRemoveItemFromWishlistResData
  raw?: EventDataRaw
}> {
  static eventName = 'wishlist:remove-item'

  constructor(data: MakairaRemoveItemFromWishlistResData, raw?: EventDataRaw) {
    super(WishlistRemoveItemEvent.eventName, { data: { data, raw } })
  }
}
