import express from "express";
// is needed to run multiple tests in a single it(). Without this package tests run in sync and timeout
import "express-async-errors";
import { json } from "body-parser";

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
    // when true, allow https only. Send a cookie only if it is a secured request
    secure: process.env.NODE_ENV !== "test",
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

export { app };
