const info = () => {
  return "info";
};

const feed = (parent, args, context, info) => {
  return context.prisma.link.findMany();
};

export default { info, feed };
