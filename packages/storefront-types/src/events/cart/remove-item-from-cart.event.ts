import { MakairaAddItemToCartResData } from '../../providers'

export class CartRemoveItemEvent<
  EventData extends MakairaAddItemToCartResData = MakairaAddItemToCartResData
> extends MessageEvent<EventData> {
  static eventName = 'cart:remove-item'
  constructor(data: EventData) {
    super(CartRemoveItemEvent.eventName, { data })
  }
}
