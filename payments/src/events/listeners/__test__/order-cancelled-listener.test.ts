import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent, OrderStatus } from "@tickets_rk/common";
import { Order } from "../../../models/order";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // get listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // create an order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "aaa",
    price: 10,
    status: OrderStatus.Created,
  });

  await order.save();

  // get data
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "aaa",
    },
  };

  // build
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    msg,
    data,
    order,
  };
};

it("canceled order", async () => {
  const { listener, msg, data, order } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("called acks", async () => {
  const { listener, msg, data } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
