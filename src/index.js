const { GraphQLServer } = require("graphql-yoga");

//  Define GraphQL Schema
const typeDefs = `
type Query {
    info: String!
}
`;

//Define resolvers
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`
  }
};

//Bundle resolver and schema with GraphQLServer - tells which operations are accepted and how to be resolved
const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log(`Server running on http://localhost:4000`));
