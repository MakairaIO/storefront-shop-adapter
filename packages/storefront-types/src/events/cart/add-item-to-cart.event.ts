import { MakairaAddItemToCartResData } from '../../providers'

export class CartAddItemEvent<
  EventData extends MakairaAddItemToCartResData = MakairaAddItemToCartResData
> extends MessageEvent<EventData> {
  static eventName = 'cart:add-item'
  constructor(data: EventData) {
    super(CartAddItemEvent.eventName, { data })
  }
}
