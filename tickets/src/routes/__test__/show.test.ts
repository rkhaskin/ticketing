import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("returns 404 if the ticket is not found", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${ticketId}`).send({}).expect(404);
});

it("returns a ticket if it is found", async () => {
  const title = "Concert";
  const price = 10;

  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    //.set("Cookie", cookie)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
