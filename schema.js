const { gql } = require("apollo-server-lambda");

const typeDefs = gql`
type Mutation {
  createTodo(text: String!): Todo!
}

type Query {
  getTodos: [Todo!]
}

type Todo {
  id: ID!
  text: String!
  completed: Boolean!
}
`;

module.exports = typeDefs;
