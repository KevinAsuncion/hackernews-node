const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");

//Define resolvers
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info);
    }
  },
  Mutation: {
    post: (root, args, context, info) => {
      return context.db.mutation.createLink(
        {
          data: {
            url: args.url,
            description: args.description
          }
        },
        info
      );
    }
  }
};

//Bundle resolver,schema, and prisma with GraphQLServer - tells which operations are accepted and how to be resolved
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: "src/generated/prisma.graphql",
      endpoint: "https://us1.prisma.sh/kevinramosasuncion-d3881a/database/dev",
      secret: "mysecret123",
      debug: true
    })
  })
});

server.start(() => console.log(`Server running on http://localhost:4000`));
