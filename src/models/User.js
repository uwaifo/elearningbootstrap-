import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import timestamps from "mongoose-timestamp";
import { hashSync, compareSync } from "bcrypt-nodejs";
//import constants from "../config/constants";

const UserSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  emailVerifyStatus: {
    default: false,
    type: Boolean
  },
  phone: String,
  onboarding_stage: {
    default: 1,
    type: Number
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course"
  },
  password: String,
  gender: String,
  town: String,
  state: String,
  slot_reservation: {
    default: true,
    type: Boolean
  },
  balance: {
    default: false,
    type: Boolean
  }
});

UserSchema.plugin(timestamps);

//Creating user model methods
UserSchema.pre("save", function(next) {
  if (this.isModified("password")) {
    this.password = this._hashPassword(this.password);
    return next();
  }
  return next();
});

UserSchema.methods = {
  //Creating user token
  createToken() {
    return jwt.sign(
      {
        _id: this._id
      },
      process.env.JWT_SECRET
    );
  },

  //Hashing user password
  _hashPassword(password) {
    return hashSync(password);
  },

  //Verifying user password
  verifyPass(password) {
    let cp = compareSync(password, this.password);
    return cp;
  }
};

export default mongoose.model("User", UserSchema);
