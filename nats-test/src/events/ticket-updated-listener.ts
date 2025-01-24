import { Message } from "node-nats-streaming";
import { Listener } from "../../../common/src/events/base-listener";
import { TicketUpdatedEvent } from "../../../common/src/events/ticket-updated-event";
import { Subjects } from "../../../common/src/events/subjects";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName: string = "payment-service";
  onMessage(parsedData: TicketUpdatedEvent["data"], msg: Message): void {
    console.log(`Event data: ${JSON.stringify(parsedData)}`);

    msg.ack();
  }
}
