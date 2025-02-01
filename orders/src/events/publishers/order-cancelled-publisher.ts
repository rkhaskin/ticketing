import { Publisher, Subjects, OrderCancelledEvent } from "@tickets_rk/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
