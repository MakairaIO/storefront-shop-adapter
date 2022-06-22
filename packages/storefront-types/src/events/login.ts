import { MakairaLoginResData } from "../providers";

export class MakairaLoginEvent extends CustomEvent<MakairaLoginResData> {
  static eventName = "makaira:login";
  constructor() {
    super(MakairaLoginEvent.eventName);
  }
}
