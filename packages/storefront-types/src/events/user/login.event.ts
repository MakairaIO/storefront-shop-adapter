import { MakairaLoginResData } from '../../providers'

export class UserLoginEvent<EventDataRaw = undefined> extends MessageEvent<{
  data: MakairaLoginResData
  raw?: EventDataRaw
}> {
  static eventName = 'user:login'

  constructor(data: MakairaLoginResData, raw?: EventDataRaw) {
    super(UserLoginEvent.eventName, { data: { data, raw } })
  }
}
