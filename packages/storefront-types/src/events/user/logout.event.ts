import { MakairaLogoutResData } from '../../providers'

export class UserLogoutEvent<
  EventData extends MakairaLogoutResData = MakairaLogoutResData
> extends MessageEvent<EventData> {
  static eventName = 'user:logout'
  constructor(data: EventData) {
    super(UserLogoutEvent.eventName, { data })
  }
}
