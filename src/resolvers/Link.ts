import { Context } from "../@types/context";

const postedBy = (parent, args, context: Context) => {
  return context.prisma.link
    .findUnique({
      where: {
        id: parent.id,
      },
    })
    .postedBy();
};

const votes = (parent, args, context: Context) => {
  return context.prisma.link
    .findUnique({
      where: {
        id: parent.id,
      },
    })
    .votes();
};

export default {
  postedBy,
  votes,
};
