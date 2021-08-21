const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

const links = [
  {
    id: "ID",
    description: "desc",
    url: "url",
  },
];

const resolvers = {
  Query: {
    info: () => "info",
    feed: () => links,
  },
  Mutation: {
    post: (parent, args) => {
      const idCount = links.length;

      const link = {
        id: `link-${idCount + 1}`,
        description: args.description,
        url: args.url,
      };
      console.log(link);
      links.push(link);
      return link;
    },
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server is running on ${url}`);
});
