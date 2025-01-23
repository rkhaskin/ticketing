import { TicketCreatedEvent } from "../../../common/src/events/ticket-created-event";
import { Publisher } from "../../../common/src/events/base-publisher";
import { Subjects } from "../../../common/src/events/subjects";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
