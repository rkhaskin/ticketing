import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("returns a 404 if provided id does not exist", async () => {
  const id = global.generateMongooseId();
  const cookie = global.signin();

  const title = "ooo";
  const price = 10;
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = global.generateMongooseId();

  const title = "ooo";
  const price = 10;
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title,
      price,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const title = "ooo";
  const price = 10;

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "ooo",
      price: response.body.price,
    })
    .expect(401);
});

it("returns a 400 if the user provides invalid title or price", async () => {
  const title = "ooo";
  const price = 10;
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title,
      price,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: response.body.price,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "yyyyy",
      price: -9,
    })
    .expect(400);
});

it("returns a 200 on successful update", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "oooo",
      price: 20,
    })
    .expect(201);

  const newTitle = "new title";
  const newPrice = 100;
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(200);

  const ticketResponse = await Ticket.findById(response.body.id);
  expect(newTitle).toEqual(ticketResponse?.title);
  expect(newPrice).toEqual(ticketResponse?.price);
});
