export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    //Object.setPrototypeOf(this, CustomError.prototype);
  }

  // returns an array of objects which have properties message of type string and optional field of type string
  abstract serializeErrors(): { message: string; field?: string }[];
}
