const { authenticate } = require('../auth');
const { getNotesByBookId, getNoteById, createNote, updateNote, deleteNote } = require('../data');

/**
 * Note Query and Mutation Resolvers
 */
const noteResolvers = {
  Query: {
    /**
     * List all notes for a specific book
     * @param {number} bookId - Book ID
     * @requires Authentication
     */
    notes: async (_, { bookId }, context) => {
      try {
        const payload = authenticate(context);
        return getNotesByBookId(bookId, payload.userId);
      } catch (error) {
        throw new Error('Unauthorized');
      }
    },
  },
  Mutation: {
    /**
     * Add a new note
     * @param {number} bookId - Book ID
     * @param {string} content - Note content
     * @param {number} pageNumber - Page number (optional)
     * @requires Authentication
     */
    addNote: async (_, { bookId, content, pageNumber }, context) => {
      try {
        const payload = authenticate(context);
        return createNote(bookId, payload.userId, content, pageNumber || null);
      } catch (error) {
        throw new Error(error.message || 'Error creating note');
      }
    },

    /**
     * Update an existing note
     * @param {number} id - Note ID
     * @param {string} content - New content
     * @param {number} pageNumber - New page number (optional)
     * @requires Authentication
     */
    updateNote: async (_, { id, content, pageNumber }, context) => {
      try {
        const payload = authenticate(context);
        return updateNote(id, payload.userId, content, pageNumber || null);
      } catch (error) {
        throw new Error(error.message || 'Error updating note');
      }
    },

    /**
     * Delete a note
     * @param {number} id - Note ID
     * @requires Authentication
     */
    deleteNote: async (_, { id }, context) => {
      try {
        const payload = authenticate(context);
        deleteNote(id, payload.userId);
        return true;
      } catch (error) {
        throw new Error(error.message || 'Error deleting note');
      }
    },
  },
};

module.exports = noteResolvers;
