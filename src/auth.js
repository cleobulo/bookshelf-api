const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-this';

// Gera um token JWT (inclui email para conveniência)
const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, SECRET_KEY, { expiresIn: '7d' });
};

// Verifica e decodifica o token
const verifyToken = (token) => {
  try {
    const result = jwt.verify(token, SECRET_KEY);
    return result;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Extrai o token do header Authorization
const getTokenFromContext = (context) => {
  const authHeader = context.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  return token;
};

// Middleware para verificar autenticação
const authenticate = (context) => {
  const token = getTokenFromContext(context);
  if (!token) {
    throw new Error('Authentication required');
  }
  return verifyToken(token);
};

// Express middleware version: verifica header Authorization e anexa payload em req.user
const expressAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const payload = verifyToken(token);
    // anexa usuário decodificado ao request
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = {
  generateToken,
  verifyToken,
  getTokenFromContext,
  authenticate,
  expressAuth,
};
