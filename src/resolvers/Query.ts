import { Prisma, PrismaClient } from "@prisma/client";
import { Context } from "../@types/context";

const info = () => {
  return "info";
};

const feed = async (parent, args, context: Context, info) => {
  const where = args.filter
    ? {
        OR: [
          { description: { contains: args.filter } },
          { url: { contains: args.filter } },
        ],
      }
    : undefined;

  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  });
  const count = await context.prisma.link.count({
    where,
  });

  return {
    links,
    count,
  };
};

export default { info, feed };
