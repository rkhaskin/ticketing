import mongoose from "mongoose";

import { Password } from "../services/password";

// an interface which describes properties for a new User
interface UserAttrs {
  email: string;
  password: string;
}

// an interface that describes properties of a User Model. Returns a User Doc
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// an interface which describes properties of a User Document
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

// add a custom method to mongo schema: add build()
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// define a DAO object. All communication with dn will be done through this object
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// example:
// User.build({
//   email: "test@test.com",
//   password: "",
// });

export { User };
