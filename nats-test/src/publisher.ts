// this is a client library to communicate with nats streaming server
import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

// there is no async / await here. Need to use event-driven approach
stan.on("connect", async () => {
  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "123",
      title: "Concert",
      price: 20,
      userId: "rkhaskin",
    });
  } catch (err) {
    console.error(err);
  }
});

//   const data = JSON.stringify({
//     id: "aaaaa",
//     title: "Concert",
//     price: 10,
//   });

//   stan.publish("ticket:created", data, () => {
//     console.log("Event published");
//   });
//});
