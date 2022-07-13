import { MakairaSignupResData } from '../../providers'

export class UserSignupEvent<EventDataRaw = undefined> extends MessageEvent<{
  data: MakairaSignupResData
  raw?: EventDataRaw
}> {
  static eventName = 'user:signup'

  constructor(data: MakairaSignupResData, raw?: EventDataRaw) {
    super(UserSignupEvent.eventName, { data: { data, raw } })
  }
}
