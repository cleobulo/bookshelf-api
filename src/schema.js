const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String!
    author_id: ID
    user_id: ID!
    created_at: String
  }

  type Author {
    id: ID!
    name: String!
    bio: String
    created_at: String
  }
  
  type Note {
    id: ID!
    book_id: ID!
    user_id: ID!
    content: String!
    page_number: Int
    created_at: String
    updated_at: String
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
    token: String
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
    authors: [Author!]!
    author(id: ID!): Author
    notes(bookId: ID!): [Note!]!
    me: User
  }

  type Mutation {
    addBook(title: String!, authorId: ID): Book!
    updateBook(id: ID!, title: String!, authorId: ID): Book
    deleteBook(id: ID!): Boolean
    
    addAuthor(name: String!, bio: String): Author!
    updateAuthor(id: ID!, name: String!, bio: String): Author
    deleteAuthor(id: ID!): Boolean
    
    addNote(bookId: ID!, content: String!, pageNumber: Int): Note!
    updateNote(id: ID!, content: String!, pageNumber: Int): Note
    deleteNote(id: ID!): Boolean
    
    login(email: String!, password: String!): User!
    register(email: String!, password: String!): User!
  }
`;

module.exports = typeDefs;