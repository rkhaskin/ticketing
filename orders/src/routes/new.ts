import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@tickets_rk/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const EXPIRATION_WINDOW_SECONDS = 1 * 60;
const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      // .custom validateion that ticketId format matches mongo id format
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Ticket ID must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find ticket in db
    const existingTicket = await Ticket.findById(ticketId);
    if (!existingTicket) {
      throw new NotFoundError();
    }

    // check if the ticket is reserved
    const isReserved = await existingTicket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // calculate expiration date of 15 minutes
    const expirationDate = new Date();
    expirationDate.setSeconds(
      expirationDate.getSeconds() + EXPIRATION_WINDOW_SECONDS
    );

    // build the order and save it to db
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expirationDate,
      ticket: existingTicket,
    });

    await order.save();

    // publish an event saying that the order has been created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: OrderStatus.Created,
      userId: req.currentUser!.id,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: existingTicket.id,
        price: existingTicket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
