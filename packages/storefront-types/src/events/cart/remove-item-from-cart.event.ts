import { MakairaRemoveItemFromCartResData } from '../../providers'

export class CartRemoveItemEvent<
  EventDataRaw = undefined
> extends MessageEvent<{
  data: MakairaRemoveItemFromCartResData
  raw?: EventDataRaw
}> {
  static eventName = 'cart:remove-item'

  constructor(data: MakairaRemoveItemFromCartResData, raw?: EventDataRaw) {
    super(CartRemoveItemEvent.eventName, { data: { data, raw } })
  }
}
