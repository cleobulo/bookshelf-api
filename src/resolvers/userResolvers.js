const { generateToken, authenticate } = require('../auth');
const { findUserByEmail, createUser, validateUserCredentials, getUserById } = require('../data');

/**
 * User Query and Mutation Resolvers
 */
const userResolvers = {
  Query: {
    /**
     * Get authenticated user data
     * @requires Authentication
     */
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
    /**
     * User login
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Object} User object with token
     */
    login: async (_, { email, password }) => {
      const user = await validateUserCredentials(email, password);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      const token = generateToken(user.id, user.email);
      return { id: user.id, email: user.email, token };
    },

    /**
     * User registration
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Object} User object with token
     */
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

module.exports = userResolvers;
