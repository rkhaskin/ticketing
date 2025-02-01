import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent, OrderStatus } from "@tickets_rk/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create a listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // create and save a ticket
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 30,
    userId: "abc",
  });
  ticket.set({ orderId: orderId });

  await ticket.save();

  // create a fake data object
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    ticket,
    data,
    msg,
  };
};

it("updates the ticket, publishes the event and acks the message", async () => {
  const { data, listener, msg, ticket } = await setup();

  const existingTicket = await Ticket.findById(ticket.id);
  expect(existingTicket!.orderId).toBeDefined();

  await listener.onMessage(data, msg);
  const existingTicket2 = await Ticket.findById(ticket.id);
  expect(existingTicket2!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
});
