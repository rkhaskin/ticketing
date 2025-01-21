import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@tickets_rk/common";
import { Ticket } from "../models/ticket";

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

    await existingTicket.save();

    res.status(200).send({ existingTicket });
  }
);

export { router as updateTicketRouter };
