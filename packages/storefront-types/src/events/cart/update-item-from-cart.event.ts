import { MakairaUpdateItemFromCartResData } from '../../providers'

export class CartUpdateItemEvent<
  EventData extends MakairaUpdateItemFromCartResData = MakairaUpdateItemFromCartResData
> extends CustomEvent<EventData> {
  static eventName = 'cart:update-item'
  constructor(data: EventData) {
    super(CartUpdateItemEvent.eventName, { detail: data })
  }
}
