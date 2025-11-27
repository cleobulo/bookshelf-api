const { getBooks, createBook, updateBook, deleteBook } = require('../data');
const { ValidationError, validateBook, validateId } = require('../validations');

/**
 * List all books (authenticated)
 * @route GET /books
 */
const listAllBooksController = (req, res) => {
  try {
    const list = getBooks();
    return res.status(200).json(list);
  } catch (err) {
    console.error('GET /books error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

/**
 * Create a new book (authenticated)
 * @route POST /books
 */
const createBookController = (req, res) => {
  try {
    validateBook(req.body || {});

    const { title, authorId } = req.body;
    const userId = req.user.userId;
    const newBook = createBook(title, authorId || null, userId);
    return res.status(201).json(newBook);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, field: err.field });
    }
    console.error('POST /books error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

/**
 * Update an existing book (authenticated)
 * @route PUT /books/:id
 */
const updateBookController = (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    validateBook(req.body || {});

    const { title, authorId } = req.body;
    const updated = updateBook(id, title, authorId || null);

    if (!updated) {
      return res.status(404).json({ error: 'Book not found' });
    }

    return res.status(200).json(updated);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, field: err.field });
    }
    console.error('PUT /books/:id error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

/**
 * Delete an existing book (authenticated)
 * @route DELETE /books/:id
 */
const deleteBookController = (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
    deleteBook(id);
    return res.status(204).send();
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: err.message, field: err.field });
    }
    console.error('DELETE /books/:id error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

module.exports = {
  listAllBooksController,
  createBookController,
  updateBookController,
  deleteBookController,
};
