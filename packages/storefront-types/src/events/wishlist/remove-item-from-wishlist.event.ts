import { MakairaRemoveItemFromWishlistResData } from '../../providers'

export class WishlistRemoveItemEvent<
  EventData extends MakairaRemoveItemFromWishlistResData = MakairaRemoveItemFromWishlistResData
> extends MessageEvent<EventData> {
  static eventName = 'wishlist:remove-item'
  constructor(data: EventData) {
    super(WishlistRemoveItemEvent.eventName, { data })
  }
}
