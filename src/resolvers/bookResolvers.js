const { authenticate } = require('../auth');
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../data');

/**
 * Book Query and Mutation Resolvers
 */
const bookResolvers = {
  Query: {
    /**
     * List all books
     * @public
     */
    books: () => getBooks(),

    /**
     * Get a specific book by ID
     * @param {number} id - Book ID
     * @public
     */
    book: (_, { id }) => getBookById(id),
  },
  Mutation: {
    /**
     * Add a new book
     * @param {string} title - Book title
     * @param {number} authorId - Author ID
     * @requires Authentication
     */
    addBook: async (_, { title, authorId }, context) => {
      try {
        const payload = authenticate(context);
        return createBook(title, authorId || null, payload.userId);
      } catch (error) {
        throw new Error('Unauthorized');
      }
    },

    /**
     * Update an existing book
     * @param {number} id - Book ID
     * @param {string} title - New title
     * @param {number} authorId - New author ID
     */
    updateBook: (_, { id, title, authorId }) => {
      return updateBook(id, title, authorId || null);
    },

    /**
     * Delete a book
     * @param {number} id - Book ID
     */
    deleteBook: (_, { id }) => {
      deleteBook(id);
      return true;
    },
  },
};

module.exports = bookResolvers;
