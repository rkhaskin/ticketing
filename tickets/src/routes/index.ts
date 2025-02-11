import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const response = await Ticket.find({
    orderId: undefined,
  });

  res.status(200).send(response);
});

export { router as indexTicketsRouter };
