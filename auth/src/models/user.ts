import mongoose from "mongoose";

// an interface which describes properties for a new User
interface UserAttrs {
  email: string;
  password: string;
}

// define structure of a Document
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// define a DAO object. All communication with dn will be done through this object
const User = mongoose.model("User", userSchema);

// create a new User thru this function. It will handle mongo / typestript. If call new User({email: 'e', password: 'p'}) directly, no  typescript checks will be made
const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

// example: passing in an object which is defined as UserAttrs
// buildUser({
//   email: "k@y.com",
//   password: "pp",
// });

export { User, buildUser };
