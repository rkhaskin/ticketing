import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

// add current user to express Request interface
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

/*
  check if the user is logged in
*/
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // see if cookie is present
  if (!req.session?.jwt) {
    {
      return next();
    }
  }

  // the jwt is present. validate if it has been tempered with
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
};
