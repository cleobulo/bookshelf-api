const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const { expressAuth } = require('../auth');
const {
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
} = require('../controllers');

let serverInstance = null;

async function createServer() {
  if (serverInstance) {
    return serverInstance;
  }

  const app = express();
  app.use(express.json());

  // Add error handling middleware
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  });

  // Setup GraphQL
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ headers: req.headers, req }),
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // REST routes
  app.post('/register', registerUserController);
  app.post('/login', loginUserController);
  app.get('/me', expressAuth, meUserController);

  app.get('/books', expressAuth, listAllBooksController);
  app.post('/books', expressAuth, createBookController);
  app.put('/books/:id', expressAuth, updateBookController);
  app.delete('/books/:id', expressAuth, deleteBookController);

  app.get('/authors', expressAuth, listAllAuthorsController);
  app.get('/authors/:id', expressAuth, getAuthorByIdController);
  app.post('/authors', expressAuth, createAuthorController);
  app.put('/authors/:id', expressAuth, updateAuthorController);
  app.delete('/authors/:id', expressAuth, deleteAuthorController);

  app.get('/notes', expressAuth, listNotesByBookController);
  app.get('/notes/:id', expressAuth, getNoteByIdController);
  app.post('/notes', expressAuth, createNoteController);
  app.put('/notes/:id', expressAuth, updateNoteController);
  app.delete('/notes/:id', expressAuth, deleteNoteController);

  serverInstance = app;
  return app;
}

module.exports = { createServer };
