import express from "express";
// allow node app to throw errors from async function
import "express-async-errors";
import { json } from "body-parser";

import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";

import { NotFoundError } from "./errors/not-found-error";

const app = express();
// requests will be sent to express through ingress, which acts as a proxy. If I have cookieSession.secure = true, I need to turn on this flag
app.set("trust proxy", true);
// extract body from request in json format
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // allow https only
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// any other routes go here
app.get("*", async () => {
  throw new NotFoundError();
});

// define error handler. Any error thrown from any of the routes will get here
app.use(errorHandler);

// initialize start up
const start = async () => {
  // check that all requires env vars are set
  if (!process.env.JWT_KEY) {
    throw new Error("JWT key is not defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("connected to mongodb");
  } catch (err) {
    console.log(err);
  }
};

start();

app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!");
});
