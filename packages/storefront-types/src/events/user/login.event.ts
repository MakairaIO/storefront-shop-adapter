import { MakairaLoginResData } from '../../providers'

export class UserLoginEvent<
  EventData extends MakairaLoginResData = MakairaLoginResData
> extends CustomEvent<EventData> {
  static eventName = 'user:login'
  constructor(data: EventData) {
    super(UserLoginEvent.eventName, { detail: data })
  }
}
