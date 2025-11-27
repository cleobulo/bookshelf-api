const { getAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } = require('../data');
const { ValidationError, validateAuthor, validateId } = require('../validation');

/**
 * List all authors (public)
 * @route GET /authors
 */
const listAllAuthorsController = (req, res) => {
  try {
    const list = getAuthors();
    return res.status(200).json(list);
  } catch (err) {
    console.error('GET /authors error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

/**
 * Get a specific author by ID (public)
 * @route GET /authors/:id
 */
const getAuthorByIdController = (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    const author = getAuthorById(id);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    return res.status(200).json(author);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, field: err.field });
    }
    console.error('GET /authors/:id error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

/**
 * Create a new author (authenticated)
 * @route POST /authors
 */
const createAuthorController = (req, res) => {
  try {
    validateAuthor(req.body || {});

    const { name, bio } = req.body;
    const newAuthor = createAuthor(name, bio || null);
    return res.status(201).json(newAuthor);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, field: err.field });
    }
    console.error('POST /authors error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

/**
 * Update an existing author (authenticated)
 * @route PUT /authors/:id
 */
const updateAuthorController = (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    validateAuthor(req.body || {});

    const { name, bio } = req.body;
    const updated = updateAuthor(id, name, bio || null);

    if (!updated) {
      return res.status(404).json({ error: 'Author not found' });
    }

    return res.status(200).json(updated);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, field: err.field });
    }
    console.error('PUT /authors/:id error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

/**
 * Delete an existing author (authenticated)
 * @route DELETE /authors/:id
 */
const deleteAuthorController = (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    deleteAuthor(id);
    return res.status(204).send();
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, field: err.field });
    }
    console.error('DELETE /authors/:id error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

module.exports = {
  listAllAuthorsController,
  getAuthorByIdController,
  createAuthorController,
  updateAuthorController,
  deleteAuthorController,
};
