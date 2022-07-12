import { MakairaAddItemToWishlistResData } from '../../providers'

export class WishlistAddItemEvent<
  EventData extends MakairaAddItemToWishlistResData = MakairaAddItemToWishlistResData
> extends MessageEvent<EventData> {
  static eventName = 'wishlist:add-item'
  constructor(data: EventData) {
    super(WishlistAddItemEvent.eventName, { data })
  }
}
