const { GraphQLServer } = require("graphql-yoga");

//  Define GraphQL Schema
const typeDefs = `
type Query {
    info: String!
    feed: [Link!]!
}

type Link {
    id: ID!
    description: String!
    url: String!
}
`;

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];

//Define resolvers
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },
};

//Bundle resolver and schema with GraphQLServer - tells which operations are accepted and how to be resolved
const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log(`Server running on http://localhost:4000`));
