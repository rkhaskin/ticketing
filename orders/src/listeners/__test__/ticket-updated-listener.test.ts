import mongoose from "mongoose";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@tickets_rk/common";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
  });

  await ticket.save();

  // create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "football",
    price: 56,
    userId: "abc",
    version: ticket.version + 1,
  };

  // create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { ticket, listener, data, msg };
};

it("finds, updates and saves the ticket", async () => {
  const { listener, data, ticket, msg } = await setup();

  // update the ticket
  await listener.onMessage(data, msg);

  // find
  const updatedTicket = await Ticket.findById(data.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, ticket, msg } = await setup();

  // update the ticket
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalledTimes(1);
});

it("does not call ack if event out of order", async () => {
  const { listener, data, ticket, msg } = await setup();
  data.version = 10;

  await expect(listener.onMessage(data, msg)).rejects.toThrow(
    "Ticket not found"
  );

  expect(msg.ack).not.toHaveBeenCalled;
});
