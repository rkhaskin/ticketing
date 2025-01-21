import mongoose from "mongoose";

import { Password } from "../services/password";

// an interface which describes properties of an instance of a new User which we want to send to the db. (UserDetail)
interface UserAttrs {
  email: string;
  password: string;
}

// an interface that describes properties of a User Model. Model represents the entire collection of data
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface which describes properties of a saved record. Document represents a single record
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// define structure of a Document
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

// add a custom method to mongo schema: add build() to do a typescript validation on properties we use to create a new record
// if a just do new User(), there will be no type checking
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// define a DAO object. All communication with db will be done through this object
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// example:
// User.build({
//   email: "test@test.com",
//   password: "",
// });

export { User };
