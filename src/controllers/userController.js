const { generateToken } = require('../auth');
const { createUser, findUserByEmail, validateUserCredentials, getUserById } = require('../data');
const { ValidationError, validateUserRegistration, validateUserLogin } = require('../validation');

/**
 * Register a new user
 * @route POST /register
 */
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

/**
 * Login an existing user
 * @route POST /login
 */
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

/**
 * Get authenticated user data
 * @route GET /me
 */
const meUserController = (req, res) => {
  try {
    const userId = req.user.userId;
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

module.exports = {
  registerUserController,
  loginUserController,
  meUserController,
};
