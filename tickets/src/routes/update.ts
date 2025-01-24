import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@tickets_rk/common";
import { Ticket } from "../models/ticket";
import { TicketUpdatedEvent } from "@tickets_rk/common";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Title is empty or invalid"),
    body("price")
      .isFloat({
        gt: 0,
      })
      .withMessage("Price is invalid"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const existingTicket = await Ticket.findById(req.params.id);
    if (!existingTicket) {
      throw new NotFoundError();
    }

    if (existingTicket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    existingTicket.set({
      title: req.body.title,
      price: req.body.price,
    });

    console.log("aaaaaaaaaa");

    await existingTicket.save();
    // publish the event
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: existingTicket.id,
      price: existingTicket.price,
      title: existingTicket.title,
      userId: existingTicket.userId,
    });

    console.log("0000000000000");

    res.status(200).send({ existingTicket });
  }
);

export { router as updateTicketRouter };
