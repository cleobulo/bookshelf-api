const { getAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } = require('../data');

/**
 * Author Query and Mutation Resolvers
 */
const authorResolvers = {
  Query: {
    /**
     * List all authors
     * @public
     */
    authors: () => getAuthors(),

    /**
     * Get a specific author by ID
     * @param {number} id - Author ID
     * @public
     */
    author: (_, { id }) => getAuthorById(id),
  },
  Mutation: {
    /**
     * Add a new author
     * @param {string} name - Author name
     * @param {string} bio - Author biography (optional)
     */
    addAuthor: (_, { name, bio }) => {
      return createAuthor(name, bio || null);
    },

    /**
     * Update an existing author
     * @param {number} id - Author ID
     * @param {string} name - New name
     * @param {string} bio - New biography
     */
    updateAuthor: (_, { id, name, bio }) => {
      return updateAuthor(id, name, bio || null);
    },

    /**
     * Delete an author
     * @param {number} id - Author ID
     */
    deleteAuthor: (_, { id }) => {
      deleteAuthor(id);
      return true;
    },
  },
};

module.exports = authorResolvers;
