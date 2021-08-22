import { PrismaClient } from "@prisma/client";
import { Context } from "./@types/context";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Link from "./resolvers/Link";
import User from "./resolvers/User";
import { getUserId } from "./utils";
const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

const resolvers = {
  Query,
  Mutation,
  Link,
  User,
};

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: ({ req }) => {
    return {
      prisma,
      userId:
        req && req.headers.authorization ? Number(getUserId(req, null)) : null,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server is running on ${url}`);
});
