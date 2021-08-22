import { Context } from "../@types/context";

const links = (parent, args, context: Context) => {
  return context.prisma.user
    .findUnique({
      where: {
        id: parent.id,
      },
    })
    .links();
};

export default {
  links,
};
