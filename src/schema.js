const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String!
    author: Author!
    reviews: [Review!]!
  }

  type Author {
    id: ID!
    name: String!
    books: [Book!]!
  }
  
  type Review {
    id: ID!
    text: String!
    rating: Int!
    book: Book!
  }

  type User {
    id: ID!
    email: String!
    token: String!
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
    me: User
  }

  type Mutation {
    addBook(title: String!, authorId: ID!): Book!
    login(email: String!, password: String!): User!
    register(email: String!, password: String!): User!
  }
`;

module.exports = typeDefs;