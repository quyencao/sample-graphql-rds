const { gql } = require("apollo-server-lambda");

const typeDefs = gql`
type Mutation {
  register(email: String!, password: String!): User!
}

type Query {
  getUsers: [User!]
}

type User {
  id: ID!
  email: String!
}
`;

module.exports = typeDefs;
