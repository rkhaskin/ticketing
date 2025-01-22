// this is a client library to communicate with nats streaming server
import nats from "node-nats-streaming";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

// there is no async / await here. Need to use event-driven approach
stan.on("connect", () => {
  const data = JSON.stringify({
    id: "aaaaa",
    title: "Concert",
    price: 10,
  });

  stan.publish("ticket:created", data, () => {
    console.log("Event published");
  });
});
