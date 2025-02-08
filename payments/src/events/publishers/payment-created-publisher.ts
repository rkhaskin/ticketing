import { PaymentCreatedEvent, Publisher, Subjects } from "@tickets_rk/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
