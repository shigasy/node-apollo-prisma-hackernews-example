import { PrismaClient } from "@prisma/client";

// @ts-check
const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

interface Context {
  prisma: PrismaClient;
}

const resolvers = {
  Query: {
    info: () => "info",
    feed: async (parent, args, context: Context) => {
      return context.prisma.link.findMany();
    },
  },
  Mutation: {
    post: (parent, args, context: Context) => {
      const link = context.prisma.link.create({
        data: {
          description: args.description,
          url: args.url,
        },
      });
      // apollo serverはresolverから返されたオブジェクトを検出してPromiseを自動的に解決できるらしい
      // async awaitいるかなと思ったけど、なくても自動で解決してくれるっぽい
      return link;
    },
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
};

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => {
  console.log(`Server is running on ${url}`);
});
