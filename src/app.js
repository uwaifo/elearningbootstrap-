import dotenv from "dotenv";
dotenv.config();
const colors = require("colors");

import { ApolloServer, gql } from "apollo-server";
import jwt from "jsonwebtoken";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import "./config/db_conn";

//const PORT = 8017;
//const schema =
const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen(process.env.PORT, () => {
  console.log(
    `🚀 . . Server is Listening at http://localhost:${process.env.PORT}`.yellow
      .bold
  );
});
//process.env.GRAPHQL_PATH
