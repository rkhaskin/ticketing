// this is a client library to communicate with nats streaming server
import nats, { Message, Subscription } from "node-nats-streaming";
import { randomBytes } from "crypto";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Connected to listener");

  // manual acknowledgement is that a service is required to ack() that the message has been processed all way through. If within some predefined time the ack is not received
  // by nats, the server will send the same message to the other nstance of the queue group
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("account-service");

  // if a service is a member of a queue group, a message will be sent to only one of many members of a queue group.
  // Channel to Queue groups is one-to-many.
  // if listeners subscribed to a channel, not to a queue group, all will receive the message.
  // Queue groups also tell the nats server not to clear caches with transactions, which is important for durable subscriptions

  const subscription = stan.subscribe(
    "ticket:created",
    "orders-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    console.log("Message received");

    subscription.on("close", () => {
      console.log("NATS connection close");
      process.exit();
    });

    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()} with data ${data}`);

      // tell the server we are done with messaging
      msg.ack();
    }
  });
});

// close with interrupt
process.on("SIGINT", () => {
  stan.close();
});

// close with terminate (CTRL C)
process.on("SIGTERM", () => {
  stan.close();
});
