import { MakairaLogoutResData } from '../../providers'

export class UserLogoutEvent<EventDataRaw = undefined> extends MessageEvent<{
  data: MakairaLogoutResData
  raw?: EventDataRaw
}> {
  static eventName = 'user:logout'

  constructor(data: MakairaLogoutResData, raw?: EventDataRaw) {
    super(UserLogoutEvent.eventName, { data: { data, raw } })
  }
}
