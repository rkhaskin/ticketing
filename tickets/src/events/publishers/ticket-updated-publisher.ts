import { Publisher, Subjects, TicketUpdatedEvent } from "@tickets_rk/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
