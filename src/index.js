const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { createUser, findUserByEmail, validateUserCredentials, getBooks, createBook } = require('./data');
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
      if (!title || !authorId) {
        return res.status(400).json({ error: 'title and authorId are required' });
      }

      const newBook = createBook(title, authorId);
      return res.status(201).json(newBook);
    } catch (err) {
      console.error('POST /books error:', err);
      return res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
}

start();
