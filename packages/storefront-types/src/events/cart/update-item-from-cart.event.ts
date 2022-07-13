import { MakairaUpdateItemFromCartResData } from '../../providers'

export class CartUpdateItemEvent<
  EventDataRaw = undefined
> extends MessageEvent<{
  data: MakairaUpdateItemFromCartResData
  raw?: EventDataRaw
}> {
  static eventName = 'cart:update-item'

  constructor(data: MakairaUpdateItemFromCartResData, raw?: EventDataRaw) {
    super(CartUpdateItemEvent.eventName, { data: { data, raw } })
  }
}
