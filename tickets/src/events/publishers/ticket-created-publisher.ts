import { Publisher, Subjects, TicketCreatedEvent } from "@tickets_rk/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
