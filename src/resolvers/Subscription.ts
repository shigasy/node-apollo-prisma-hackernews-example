import { Context } from "../@types/context";

const newLinkSubscribe = (parent, args, context: Context, info) => {
  return context.pubsub.asyncIterator("NEW_LINK");
};

const newLink = {
  subscribe: newLinkSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

export default {
  newLink,
};
