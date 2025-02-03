import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "../events/listeners/order-created-listener";

// initialize start up
const start = async () => {
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS cluster id is not defined");
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS client id is not defined");
  }

  if (!process.env.NATS_URL) {
    throw new Error("NATS URL is not defined");
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

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log(err);
  }
};

start();
