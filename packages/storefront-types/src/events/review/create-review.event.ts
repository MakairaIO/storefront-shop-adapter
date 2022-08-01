import { MakairaCreateReviewResData } from '../../providers'

export class ReviewCreateEvent<EventDataRaw = undefined> extends MessageEvent<{
  data: MakairaCreateReviewResData
  raw?: EventDataRaw
}> {
  static eventName = 'review:create'

  constructor(data: MakairaCreateReviewResData, raw?: EventDataRaw) {
    super(ReviewCreateEvent.eventName, { data: { data, raw } })
  }
}
