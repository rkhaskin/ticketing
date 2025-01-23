// this is a client library to communicate with nats streaming server
import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Connected to listener");

  // close with interrupt
  process.on("SIGINT", () => {
    stan.close();
  });

  // close with terminate (CTRL C)
  process.on("SIGTERM", () => {
    stan.close();
  });
  new TicketCreatedListener(stan).listen();
});
