import { MakairaSignupResData } from '../../providers'

export class UserSignupEvent<
  EventData extends MakairaSignupResData = MakairaSignupResData
> extends CustomEvent<EventData> {
  static eventName = 'user:signup'
  constructor(data: EventData) {
    super(UserSignupEvent.eventName, { detail: data })
  }
}
