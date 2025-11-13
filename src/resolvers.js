const { generateToken, authenticate } = require('./auth');
const { findUserByEmail, createUser, validateUserCredentials, getUserById } = require('./data');

const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => (books.find(b => b.id === id)),
    me: async (_, __, context) => {
      try {
        const payload = authenticate(context);
        const found = getUserById(payload.userId);
        if (!found) {
          throw new Error('Unauthorized');
        }
        return { id: found.id, email: found.email, token: '' };
      } catch (error) {
        throw new Error('Unauthorized');
      }
    },
  },
  Mutation: {
    addBook: (_, { title, authorId }) => {
      const newBook = { id: String(books.length + 1), title, authorId };
      books.push(newBook);
      return newBook;
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
