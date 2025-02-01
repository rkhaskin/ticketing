import { Publisher, Subjects, OrderCreatedEvent } from "@tickets_rk/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
