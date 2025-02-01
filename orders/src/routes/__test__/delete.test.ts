import request from "supertest";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("marks an order as Cancelled", async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const user = global.signin();
  // create an order
  const { body: order } = await request(app)
    .post(`/api/orders`)
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // cancel order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  const cancelledOrder = await Order.findById(order.id);
  expect(cancelledOrder!.status).toBe(OrderStatus.Cancelled);
});

it("emits cancellation event", async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const user = global.signin();
  // create an order
  const { body: order } = await request(app)
    .post(`/api/orders`)
    .set("Cookie", user)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  // cancel order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
