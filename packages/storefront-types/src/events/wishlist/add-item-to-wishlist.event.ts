import { MakairaAddItemToWishlistResData } from '../../providers'

export class WishlistAddItemEvent<
  EventDataRaw = undefined
> extends MessageEvent<{
  data: MakairaAddItemToWishlistResData
  raw?: EventDataRaw
}> {
  static eventName = 'wishlist:add-item'

  constructor(data: MakairaAddItemToWishlistResData, raw?: EventDataRaw) {
    super(WishlistAddItemEvent.eventName, { data: { data, raw } })
  }
}
