import mongoose from "mongoose";

import { app } from "./app";

// initialize start up
const start = async () => {
  // check that all requires env vars are set
  if (!process.env.JWT_KEY) {
    throw new Error("JWT key is not defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Mongo URL is not defined");
  }

  try {
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
