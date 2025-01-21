import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import request from "supertest";
import { app } from "../app";

declare global {
  var signin: () => string[];

  var generateMongooseId: () => string;
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // build a jwt payload
  const payload = {
    id: global.generateMongooseId(),
    email: "eee@test.com",
  };

  // create jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // put jwt token on a session object
  const session = { jwt: token };

  // turn session into JSON
  const sessionJson = JSON.stringify(session);

  // encode JSON into base64. (When data is set inside a cookie, it is encoded as base64)
  const base64 = Buffer.from(sessionJson).toString("base64");

  // return a string with our cookie
  return [`session=${base64}`];
};

global.generateMongooseId = () => new mongoose.Types.ObjectId().toHexString();
