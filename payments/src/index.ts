import mongoose from "mongoose";

import { app } from "./app";

import { natsWrapper } from "./nats-wrapper";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-creates-listener";

// initialize start up
const start = async () => {
  // check that all requires env vars are set
  if (!process.env.JWT_KEY) {
    throw new Error("JWT key is not defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Mongo URL is not defined");
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS cluster id is not defined");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS client id is not defined");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS URL is not defined");
  }

  if (!process.env.STRIPE_KEY) {
    throw new Error("Stripe key is not defined");
  }

  try {
    // url points to nats
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    // if we delete a nats pod, we will loose a NATS connection.
    // When the pod restarts, ticket pod, will also be restarted, this code re-run.
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });

    process.on("SIGINT", () => {
      natsWrapper.client.close();
    });

    process.on("SIGTERM", () => {
      natsWrapper.client.close();
    });

    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to tickets mongodb");
  } catch (err) {
    console.log(err);
  }
};

start();

app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!");
});
