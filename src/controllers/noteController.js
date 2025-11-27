const { getNotesByBookId, getNoteById, createNote, updateNote, deleteNote } = require('../data');
const { ValidationError, validateNote, validateId } = require('../validation');

/**
 * List all notes for a specific book (authenticated)
 * @route GET /books/:bookId/notes
 */
const listNotesByBookController = (req, res) => {
  try {
    const { bookId } = req.params;
    validateId(bookId);
    const notes = getNotesByBookId(bookId, req.user.userId);
    return res.status(200).json(notes);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, field: err.field });
    }
    console.error('GET /books/:bookId/notes error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

/**
 * Get a specific note by ID (authenticated, private)
 * @route GET /notes/:id
 */
const getNoteByIdController = (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    const note = getNoteById(id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Check if note belongs to the authenticated user
    if (note.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden: you can only view your own notes' });
    }

    return res.status(200).json(note);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, field: err.field });
    }
    console.error('GET /notes/:id error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

/**
 * Create a new note (authenticated)
 * @route POST /notes
 */
const createNoteController = (req, res) => {
  try {
    validateNote(req.body || {});

    const { bookId, content, pageNumber } = req.body;
    const newNote = createNote(bookId, req.user.userId, content, pageNumber || null);
    return res.status(201).json(newNote);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, field: err.field });
    }
    console.error('POST /notes error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

/**
 * Update an existing note (authenticated, private)
 * @route PUT /notes/:id
 */
const updateNoteController = (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    validateNote(req.body || {});

    const { content, pageNumber } = req.body;
    const updated = updateNote(id, req.user.userId, content, pageNumber || null);
    return res.status(200).json(updated);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, field: err.field });
    }
    console.error('PUT /notes/:id error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

/**
 * Delete an existing note (authenticated, private)
 * @route DELETE /notes/:id
 */
const deleteNoteController = (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    deleteNote(id, req.user.userId);
    return res.status(204).send();
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, field: err.field });
    }
    console.error('DELETE /notes/:id error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

module.exports = {
  listNotesByBookController,
  getNoteByIdController,
  createNoteController,
  updateNoteController,
  deleteNoteController,
};
