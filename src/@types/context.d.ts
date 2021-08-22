import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";

export type Context = {
  prisma: PrismaClient;
  pubsub: PubSub;
  userId: number | null;
};
