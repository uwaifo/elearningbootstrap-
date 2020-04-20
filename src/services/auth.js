import jwt from "jsonwebtoken";
//import constants from "../config/constants";
import User from "../models/User";

//User Authentication Function
export async function authUser(userId) {
  if (!userId) {
    throw new Error("Unauthorized");
  }
  //Verifying user id from our database
  const me = await User.findById(userId);

  //Checking if user existing in DB
  if (!me) {
    throw new Error("Unauthorized");
  }
  return me;
}

//Decoding json web token from the user request headers
export function decodeToken(token) {
  //console.log(token);
  //Getting the Bearer from the headers
  const arr = token.split(" ");
  if (arr[0] === "Bearer") {
    //Verifying and validating token
    let token = jwt.verify(arr[1], process.env.JWT_SECRET);

    return token;
  }
  throw new Error("Invalid token");
}
