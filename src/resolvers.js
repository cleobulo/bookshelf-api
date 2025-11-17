const { generateToken, authenticate } = require('./auth');
const { 
  findUserByEmail, 
  createUser, 
  validateUserCredentials, 
  getUserById, 
  getBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook, 
  getAuthors, 
  getAuthorById, 
  createAuthor, 
  updateAuthor, 
  deleteAuthor } = require('./data');

const resolvers = {
  Query: {
    books: () => getBooks(),
    book: (_, { id }) => getBookById(id),
    authors: () => getAuthors(),
    author: (_, { id }) => getAuthorById(id),
    me: async (_, __, context) => {
      try {
        const payload = authenticate(context);
        const found = getUserById(payload.userId);
        if (!found) {
          throw new Error('Unauthorized');
        }
        return { id: found.id, email: found.email };
      } catch (error) {
        throw new Error('Unauthorized');
      }
    },
  },
  Mutation: {
    addBook: async (_, { title, authorId }, context) => {
      try {
        const payload = authenticate(context);
        return createBook(title, authorId || null, payload.userId);
      } catch (error) {
        throw new Error('Unauthorized');
      }
    },
    updateBook: (_, { id, title, authorId }) => {
      return updateBook(id, title, authorId || null);
    },
    deleteBook: (_, { id }) => {
      deleteBook(id);
      return true;
    },
    addAuthor: (_, { name, bio }) => {
      return createAuthor(name, bio || null);
    },
    updateAuthor: (_, { id, name, bio }) => {
      return updateAuthor(id, name, bio || null);
    },
    deleteAuthor: (_, { id }) => {
      deleteAuthor(id);
      return true;
    },
    login: async (_, { email, password }) => {
      const user = await validateUserCredentials(email, password);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      const token = generateToken(user.id, user.email);
      return { id: user.id, email: user.email, token };
    },
    register: async (_, { email, password }) => {
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      const newUser = await createUser(email, password);
      const token = generateToken(newUser.id, newUser.email);
      return { id: newUser.id, email: newUser.email, token };
    },
  },
};

module.exports = resolvers;
