import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

// export class RequestValidationError extends Error {
//   errors: ValidationError[] = [];
//   constructor(errors: ValidationError[]) {
//     errors = errors;
//     super();
//   }
// }

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Error");

    // only because we are extending a built in class (Error). If not present, serializeErrors() will not be visible
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      if (error.type === "field") {
        return {
          message: error.msg,
          field: error.path,
        };
      }
      return { message: error.msg };
    });
  }
}
