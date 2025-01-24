import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@tickets_rk/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
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
    const { title, price } = req.body;
    const ticketDoc = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    const ticket = await ticketDoc.save();

    /* better way would be:
       1. wrap save data and save event into a transaction
       2. have a scheduled job to publish events from a db and set a flag if successful
     */

    // publish the event
    const publisher = await new TicketCreatedPublisher(
      natsWrapper.client
    ).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
