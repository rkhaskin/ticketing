import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus, Subjects } from "@tickets_rk/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-creates-listener";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  // create listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // build data
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: "aaaa",
    expiresAt: "dfdksfj",
    version: 0,
    ticket: {
      id: "aaaaa",
      price: 10,
    },
  };

  // build Message with ack method
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    msg,
  };
};

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(data.ticket.price).toEqual(order!.price);
});

it("ack the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
