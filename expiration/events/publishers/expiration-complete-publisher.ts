import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@tickets_rk/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
