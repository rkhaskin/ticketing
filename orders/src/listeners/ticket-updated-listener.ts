import { Listener, Subjects, TicketUpdatedEvent } from "@tickets_rk/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(
    data: {
      id: string;
      title: string;
      price: number;
      userId: string;
      version: number;
    },
    msg: Message
  ): Promise<void> {
    // find a ticket
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({
      title: data.title,
      price: data.price,
    });

    await ticket.save();

    msg.ack();
  }
}
