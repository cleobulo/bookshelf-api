const { generateToken } = require('./auth');
const { 
  createUser, 
  findUserByEmail, 
  validateUserCredentials, 
  getBooks, 
  createBook, 
  getAuthors, 
  getAuthorById, 
  createAuthor, 
  updateAuthor, 
  deleteAuthor,
  getNotesByBookId,
  getNoteById,
  createNote,
  updateNote,
  deleteNote } = require('./data');
const { ValidationError, validateUserRegistration, validateUserLogin } = require('./validation');

// Registra um novo usuário
const registerUserController = async (req, res) => {
    try {
      validateUserRegistration(req.body || {});

      const { email, password } = req.body;

      const existing = findUserByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'User already exists' });
      }

      const newUser = await createUser(email, password);
      const token = generateToken(newUser.id, newUser.email);

      return res.status(201).json({ id: newUser.id, email: newUser.email, token });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, field: err.field });
      }
      console.error('POST /register error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
};

// Login de usuário existente
const loginUserController = async (req, res) => {
    try {
      validateUserLogin(req.body || {});

      const { email, password } = req.body;

      const user = await validateUserCredentials(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user.id, user.email);
      return res.status(200).json({ id: user.id, email: user.email, token });
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message, field: err.field });
      }
      console.error('POST /login error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
};

// Retorna dados do usuário autenticado
const meUserController = (req, res) => {
    try {
      const userId = req.user.userId;
      const { getUserById } = require('./data');
      const user = getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ id: user.id, email: user.email });
    } catch (err) {
      console.error('GET /me error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
};

// Lista todos os livros
const listAllBooksController = (req, res) => {
    try {
      const list = getBooks();
      return res.status(200).json(list);
    } catch (err) {
      console.error('GET /books error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
};

// Cria um novo livro
const createBookController = (req, res) => {
    try {
      const { validateBook, validateId } = require('./validation');
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

// Atualiza um registro existente
const updateBookController = (req, res) => {
    try {
      const { validateBook, validateId } = require('./validation');
      const { id } = req.params;
      validateId(id);
      validateBook(req.body || {});

      const { title, authorId } = req.body;
      const { updateBook } = require('./data');
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

// Deleta um registro existente
const deleteBookController = (req, res) => {
    try {
      const { validateId } = require('./validation');
      const { id } = req.params;
      validateId(id);
      const { deleteBook } = require('./data');
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

// Listar todos os autores
const listAllAuthorsController = (req, res) => {
    try {
      const list = getAuthors();
      return res.status(200).json(list);
    } catch (err) {
      console.error('GET /authors error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
};

// Retorno um autor especificado pelo ID
const getAuthorByIdController = (req, res) => {
    try {
      const { id } = req.params;
      const author = getAuthorById(id);
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }
      return res.status(200).json(author);
    } catch (err) {
      console.error('GET /authors/:id error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
};

// Criar um novo autor
const createAuthorController = (req, res) => {
    try {
      const { validateAuthor } = require('./validation');
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

// Atualizar um autor existente
const updateAuthorController = (req, res) => {
    try {
      const { validateAuthor, validateId } = require('./validation');
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

// Deletar um autor existente
const deleteAuthorController = (req, res) => {
    try {
      const { validateId } = require('./validation');
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

// Listar todas as notas de um livro
const listNotesByBookController = (req, res) => {
    try {
      const { bookId } = req.params;
      const notes = getNotesByBookId(bookId, req.user.userId);
      return res.status(200).json(notes);
    } catch (err) {
      console.error('GET /books/:bookId/notes error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
};

// Pegar uma nota específica (pelo ID)
const getNoteByIdController = (req, res) => {
    try {
      const { validateId } = require('./validation');
      const { id } = req.params;
      validateId(id);
      const note = getNoteById(id);
      
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      
      // Verifica se o note pertence ao usuário
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

// Criar uma nova nota
const createNoteController = (req, res) => {
    try {
      const { validateNote } = require('./validation');
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

// Atualizar uma nota existente
const updateNoteController = (req, res) => {
    try {
      const { validateNote, validateId } = require('./validation');
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

// Deletar uma nota existente
const deleteNoteController = (req, res) => {
    try {
      const { validateId } = require('./validation');
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
  registerUserController,
  loginUserController,
  meUserController,
  listAllBooksController,
  createBookController,
  updateBookController,
  deleteBookController,
  listAllAuthorsController,
  getAuthorByIdController,
  createAuthorController,
  updateAuthorController,
  deleteAuthorController,
  listNotesByBookController,
  getNoteByIdController,
    createNoteController,
    updateNoteController,
    deleteNoteController,
};