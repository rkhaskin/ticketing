import express, { Request, Response } from "express";
import { requireAuth } from "@tickets_rk/common";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@tickets_rk/common";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError();
  }
  res.send(ticket);
});

export { router as showTicketRouter };
