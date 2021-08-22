import { Context } from "../@types/context";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import { APP_SECRET } from "../utils";
const signup = async (parent, args, context: Context, info) => {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.prisma.user.create({
    data: {
      email: args.email,
      name: args.name,
      password,
    },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

const login = async (parent, args, context: Context, info) => {
  console.log(args);
  const user = await context.prisma.user.findUnique({
    where: {
      email: args.email,
    },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  // passwordが違うときはここで弾かれる
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

const post = async (parent, args, context: Context, info) => {
  const { userId } = context;

  if (userId === null) {
    throw new Error("null user id");
  }

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });

  context.pubsub.publish("NEW_LINK", newLink);

  return newLink;
};

export default {
  signup,
  login,
  post,
};
