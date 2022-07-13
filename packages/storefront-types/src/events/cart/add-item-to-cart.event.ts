import { MakairaAddItemToCartResData } from '../../providers'

export class CartAddItemEvent<EventDataRaw = undefined> extends MessageEvent<{
  data: MakairaAddItemToCartResData
  raw?: EventDataRaw
}> {
  static eventName = 'cart:add-item'

  constructor(data: MakairaAddItemToCartResData, raw?: EventDataRaw) {
    super(CartAddItemEvent.eventName, { data: { data, raw } })
  }
}
