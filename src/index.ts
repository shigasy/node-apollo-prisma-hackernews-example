import { PrismaClient } from "@prisma/client";
import { Context } from "./@types/context";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Link from "./resolvers/Link";
import User from "./resolvers/User";
import Subscription from "./resolvers/Subscription";
import { getUserId } from "./utils";
import { PubSub } from "graphql-subscriptions";
import { ApolloServer } from "apollo-server-express";
const fs = require("fs");
const path = require("path");

import express from "express";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";

(async function () {
  const app = express();

  const httpServer = createServer(app);

  const resolvers = {
    Query,
    Mutation,
    Subscription,
    Link,
    User,
  };

  const schema = makeExecutableSchema({
    typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
    resolvers,
  });

  const prisma = new PrismaClient();
  const pubsub = new PubSub();
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return {
        prisma,
        pubsub,
        userId:
          req && req.headers.authorization
            ? Number(getUserId(req, null))
            : null,
      };
    },
  });
  await server.start();
  server.applyMiddleware({ app });

  // apollo-server v3からsubscriptionに対応していなかったから、websocketが使えるように
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onOperation: (message, params, websocket) => {
        return {
          ...params,
          context: {
            prisma,
            pubsub,
          },
        };
      },
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    }
  );

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(
      `Server is now running on http://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();
