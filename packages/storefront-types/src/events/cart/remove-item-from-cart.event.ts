import { MakairaAddItemToCartResData } from '../../providers'

export class CartRemoveItemEvent<
  EventData extends MakairaAddItemToCartResData = MakairaAddItemToCartResData
> extends CustomEvent<EventData> {
  static eventName = 'cart:remove-item'
  constructor(data: EventData) {
    super(CartRemoveItemEvent.eventName, { detail: data })
  }
}
