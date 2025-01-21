import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@tickets_rk/common";
import { Ticket } from "../models/ticket";

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

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
