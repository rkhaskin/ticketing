import express from "express";
// is needed to run multiple tests in a single it(). Without this package tests run in sync and timeout
import "express-async-errors";
import { json } from "body-parser";

import cookieSession from "cookie-session";

import {
  errorHandler,
  NotFoundError,
  currentUser,
  requireAuth,
} from "@tickets_rk/common";

import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";

const app = express();
// requests will be sent to express through ingress, which acts as a proxy. If I have cookieSession.secure = true, I need to turn on this flag
app.set("trust proxy", true);
// extract body from request in json format
app.use(json());

// sets req.session property
app.use(
  cookieSession({
    signed: false,
    // when true, allow https only. Send a cookie only if it is a secured request
    secure: process.env.NODE_ENV !== "test",
  })
);

// set currentUser on req
app.use(currentUser);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

// any other routes go here
app.get("*", async () => {
  throw new NotFoundError();
});

// define error handler. Any error thrown from any of the routes will get here
app.use(errorHandler);

export { app };
