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

export default {
  postedBy,
};
