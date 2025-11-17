const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
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
const { generateToken, expressAuth } = require('./auth');

async function start() {
  const app = express();
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ headers: req.headers, req }),
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.get('/', (req, res) => {
    res.send('Welcome to the Bookshelf API. Go to /graphql for GraphQL playground.');
  });

  // REST endpoint to register a new user
  app.post('/register', async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
      }

      const existing = findUserByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'User already exists' });
      }

      const newUser = await createUser(email, password);
      const token = generateToken(newUser.id, newUser.email);

      return res.status(201).json({ id: newUser.id, email: newUser.email, token });
    } catch (err) {
      console.error('POST /register error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // REST endpoint to login and receive a token
  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
      }

      const user = await validateUserCredentials(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user.id, user.email);
      return res.status(200).json({ id: user.id, email: user.email, token });
    } catch (err) {
      console.error('POST /login error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // REST endpoint to get authenticated user data (requires authentication)
  app.get('/me', expressAuth, (req, res) => {
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
  });

  // REST endpoint to list all books (requires authentication)
  app.get('/books', expressAuth, (req, res) => {
    try {
      const list = getBooks();
      return res.status(200).json(list);
    } catch (err) {
      console.error('GET /books error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // REST endpoint to create a new book (requires authentication)
  app.post('/books', expressAuth, (req, res) => {
    try {
      const { title, authorId } = req.body || {};
      if (!title) {
        return res.status(400).json({ error: 'title is required' });
      }

      const userId = req.user.userId;
      const newBook = createBook(title, authorId || null, userId);
      return res.status(201).json(newBook);
    } catch (err) {
      console.error('POST /books error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // REST endpoint to update a book (requires authentication)
  app.put('/books/:id', expressAuth, (req, res) => {
    try {
      const { id } = req.params;
      const { title, authorId } = req.body || {};
      
      if (!title) {
        return res.status(400).json({ error: 'title is required' });
      }

      const { updateBook } = require('./data');
      const updated = updateBook(id, title, authorId || null);
      
      if (!updated) {
        return res.status(404).json({ error: 'Book not found' });
      }

      return res.status(200).json(updated);
    } catch (err) {
      console.error('PUT /books/:id error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // REST endpoint to delete a book (requires authentication)
  app.delete('/books/:id', expressAuth, (req, res) => {
    try {
      const { id } = req.params;
      const { deleteBook } = require('./data');
      deleteBook(id);
      return res.status(204).send();
    } catch (err) {
      console.error('DELETE /books/:id error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // ============ Authors Endpoints ============

  // REST endpoint to list all authors
  app.get('/authors', (req, res) => {
    try {
      const list = getAuthors();
      return res.status(200).json(list);
    } catch (err) {
      console.error('GET /authors error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // REST endpoint to get a single author by ID
  app.get('/authors/:id', (req, res) => {
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
  });

  // REST endpoint to create a new author (requires authentication)
  app.post('/authors', expressAuth, (req, res) => {
    try {
      const { name, bio } = req.body || {};
      if (!name) {
        return res.status(400).json({ error: 'name is required' });
      }

      const newAuthor = createAuthor(name, bio || null);
      return res.status(201).json(newAuthor);
    } catch (err) {
      console.error('POST /authors error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // REST endpoint to update an author (requires authentication)
  app.put('/authors/:id', expressAuth, (req, res) => {
    try {
      const { id } = req.params;
      const { name, bio } = req.body || {};
      
      if (!name) {
        return res.status(400).json({ error: 'name is required' });
      }

      const updated = updateAuthor(id, name, bio || null);
      
      if (!updated) {
        return res.status(404).json({ error: 'Author not found' });
      }

      return res.status(200).json(updated);
    } catch (err) {
      console.error('PUT /authors/:id error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // REST endpoint to delete an author (requires authentication)
  app.delete('/authors/:id', expressAuth, (req, res) => {
    try {
      const { id } = req.params;
      deleteAuthor(id);
      return res.status(204).send();
    } catch (err) {
      console.error('DELETE /authors/:id error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // ============ Notes Endpoints ============

  // REST endpoint to list notes for a book (requires authentication)
  app.get('/books/:bookId/notes', expressAuth, (req, res) => {
    try {
      const { bookId } = req.params;
      const notes = getNotesByBookId(bookId, req.user.userId);
      return res.status(200).json(notes);
    } catch (err) {
      console.error('GET /books/:bookId/notes error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // REST endpoint to get a single note (requires authentication)
  app.get('/notes/:id', expressAuth, (req, res) => {
    try {
      const { id } = req.params;
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
      console.error('GET /notes/:id error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // REST endpoint to create a note (requires authentication)
  app.post('/notes', expressAuth, (req, res) => {
    try {
      const { bookId, content, pageNumber } = req.body || {};
      
      if (!bookId || !content) {
        return res.status(400).json({ error: 'bookId and content are required' });
      }

      const newNote = createNote(bookId, req.user.userId, content, pageNumber || null);
      return res.status(201).json(newNote);
    } catch (err) {
      console.error('POST /notes error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // REST endpoint to update a note (requires authentication)
  app.put('/notes/:id', expressAuth, (req, res) => {
    try {
      const { id } = req.params;
      const { content, pageNumber } = req.body || {};
      
      if (!content) {
        return res.status(400).json({ error: 'content is required' });
      }

      const updated = updateNote(id, req.user.userId, content, pageNumber || null);
      return res.status(200).json(updated);
    } catch (err) {
      console.error('PUT /notes/:id error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  // REST endpoint to delete a note (requires authentication)
  app.delete('/notes/:id', expressAuth, (req, res) => {
    try {
      const { id } = req.params;
      deleteNote(id, req.user.userId);
      return res.status(204).send();
    } catch (err) {
      console.error('DELETE /notes/:id error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
}

start();
