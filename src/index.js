const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { expressAuth } = require('./auth');
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
 } = require('./controllers');


async function loadMethods(app) {
  // REST endpoint to register a new user
  app.post('/register', registerUserController);

  // REST endpoint to login and receive a token
  app.post('/login', loginUserController);

  // REST endpoint to get authenticated user data (requires authentication)
  app.get('/me', expressAuth, meUserController);

  // REST endpoint to list all books (requires authentication)
  app.get('/books', expressAuth, listAllBooksController);

  // REST endpoint to create a new book (requires authentication)
  app.post('/books', expressAuth, createBookController);

  // REST endpoint to update a book (requires authentication)
  app.put('/books/:id', expressAuth, updateBookController);

  // REST endpoint to delete a book (requires authentication)
  app.delete('/books/:id', expressAuth, deleteBookController);

  // ============ Authors Endpoints ============

  // REST endpoint to list all authors
  app.get('/authors', listAllAuthorsController);

  // REST endpoint to get a single author by ID
  app.get('/authors/:id', getAuthorByIdController);

  // REST endpoint to create a new author (requires authentication)
  app.post('/authors', expressAuth, createAuthorController);

  // REST endpoint to update an author (requires authentication)
  app.put('/authors/:id', expressAuth, updateAuthorController);

  // REST endpoint to delete an author (requires authentication)
  app.delete('/authors/:id', expressAuth, deleteAuthorController);

  // ============ Notes Endpoints ============

  // REST endpoint to list notes for a book (requires authentication)
  app.get('/books/:bookId/notes', expressAuth, listNotesByBookController);

  // REST endpoint to get a single note (requires authentication)
  app.get('/notes/:id', expressAuth, getNoteByIdController);

  // REST endpoint to create a note (requires authentication)
  app.post('/notes', expressAuth, createNoteController);

  // REST endpoint to update a note (requires authentication)
  app.put('/notes/:id', expressAuth, updateNoteController);

  // REST endpoint to delete a note (requires authentication)
  app.delete('/notes/:id', expressAuth, deleteNoteController);
  
  return app;
}

async function start() {
  let app = express();
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

  app = await loadMethods(app);

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
}

start();
