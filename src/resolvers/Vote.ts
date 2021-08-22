import { Context } from "../@types/context";

const link = (parent, args, context: Context) => {
  return context.prisma.vote
    .findUnique({
      where: {
        id: parent.id,
      },
    })
    .link();
};

const user = (parent, args, context: Context) => {
  return context.prisma.vote
    .findUnique({
      where: {
        id: parent.id,
      },
    })
    .user();
};

export default {
  link,
  user,
};
