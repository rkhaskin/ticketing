import { Message } from "node-nats-streaming";
import {
  PaymentCreatedEvent,
  Subjects,
  Listener,
  OrderStatus,
} from "@tickets_rk/common";
import { Ticket } from "../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  // only one member of a que group will receive an event
  queueGroupName = queueGroupName;
  async onMessage(
    data: PaymentCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, orderId, stripeId } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error(
        "Payment cannot be associated to the order. Order not found"
      );
    }

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    msg.ack();
  }
}
