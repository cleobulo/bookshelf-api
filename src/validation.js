/**
 * Validation schemas and helper functions
 * Pure JavaScript validation without external dependencies
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation error class
class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Validate user registration data
 * @param {Object} data - { email, password, passwordConfirm }
 * @throws {ValidationError}
 */
const validateUserRegistration = (data) => {
  const { email, password, passwordConfirm } = data;

  // Check required fields
  if (!email) {
    throw new ValidationError('Email é obrigatório', 'email');
  }
  if (!password) {
    throw new ValidationError('Senha é obrigatória', 'password');
  }
  if (!passwordConfirm) {
    throw new ValidationError('Confirmação de senha é obrigatória', 'passwordConfirm');
  }

  // Validate email format
  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError('Formato de email inválido', 'email');
  }

  // Validate email length
  if (email.length > 255) {
    throw new ValidationError('Email muito longo (máximo 255 caracteres)', 'email');
  }

  // Validate password length
  if (password.length < 6) {
    throw new ValidationError('Senha deve ter no mínimo 6 caracteres', 'password');
  }

  if (password.length > 255) {
    throw new ValidationError('Senha muito longa (máximo 255 caracteres)', 'password');
  }

  // Check password confirmation match
  if (password !== passwordConfirm) {
    throw new ValidationError('Senhas não coincidem', 'passwordConfirm');
  }
};

/**
 * Validate user login data
 * @param {Object} data - { email, password }
 * @throws {ValidationError}
 */
const validateUserLogin = (data) => {
  const { email, password } = data;

  if (!email) {
    throw new ValidationError('Email é obrigatório', 'email');
  }
  if (!password) {
    throw new ValidationError('Senha é obrigatória', 'password');
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError('Formato de email inválido', 'email');
  }
};

/**
 * Validate book creation/update data
 * @param {Object} data - { title, authorId }
 * @throws {ValidationError}
 */
const validateBook = (data) => {
  const { title, authorId } = data;

  if (!title) {
    throw new ValidationError('Título do livro é obrigatório', 'title');
  }

  if (typeof title !== 'string') {
    throw new ValidationError('Título deve ser uma string', 'title');
  }

  if (title.trim().length === 0) {
    throw new ValidationError('Título não pode estar vazio', 'title');
  }

  if (title.length > 255) {
    throw new ValidationError('Título muito longo (máximo 255 caracteres)', 'title');
  }

  if (!authorId) {
    throw new ValidationError('ID do autor é obrigatório', 'authorId');
  }

  if (!Number.isInteger(authorId)) {
    throw new ValidationError('ID do autor deve ser um número inteiro', 'authorId');
  }

  if (authorId <= 0) {
    throw new ValidationError('ID do autor deve ser um número positivo', 'authorId');
  }
};

/**
 * Validate author creation/update data
 * @param {Object} data - { name, bio }
 * @throws {ValidationError}
 */
const validateAuthor = (data) => {
  const { name, bio } = data;

  if (!name) {
    throw new ValidationError('Nome do autor é obrigatório', 'name');
  }

  if (typeof name !== 'string') {
    throw new ValidationError('Nome deve ser uma string', 'name');
  }

  if (name.trim().length === 0) {
    throw new ValidationError('Nome não pode estar vazio', 'name');
  }

  if (name.length > 255) {
    throw new ValidationError('Nome muito longo (máximo 255 caracteres)', 'name');
  }

  // Bio is optional but if provided, must be valid
  if (bio !== undefined && bio !== null) {
    if (typeof bio !== 'string') {
      throw new ValidationError('Bio deve ser uma string', 'bio');
    }

    if (bio.length > 1000) {
      throw new ValidationError('Bio muito longa (máximo 1000 caracteres)', 'bio');
    }
  }
};

/**
 * Validate note creation/update data
 * @param {Object} data - { content, pageNumber, bookId }
 * @throws {ValidationError}
 */
const validateNote = (data) => {
  const { content, pageNumber, bookId } = data;

  if (!content) {
    throw new ValidationError('Conteúdo da nota é obrigatório', 'content');
  }

  if (typeof content !== 'string') {
    throw new ValidationError('Conteúdo deve ser uma string', 'content');
  }

  if (content.trim().length === 0) {
    throw new ValidationError('Conteúdo não pode estar vazio', 'content');
  }

  if (content.length > 5000) {
    throw new ValidationError('Conteúdo muito longo (máximo 5000 caracteres)', 'content');
  }

  // Page number is optional but if provided, must be valid
  if (pageNumber !== undefined && pageNumber !== null) {
    if (!Number.isInteger(pageNumber)) {
      throw new ValidationError('Número da página deve ser um número inteiro', 'pageNumber');
    }

    if (pageNumber <= 0) {
      throw new ValidationError('Número da página deve ser um número positivo', 'pageNumber');
    }
  }

  if (!bookId) {
    throw new ValidationError('ID do livro é obrigatório', 'bookId');
  }

  if (!Number.isInteger(bookId)) {
    throw new ValidationError('ID do livro deve ser um número inteiro', 'bookId');
  }

  if (bookId <= 0) {
    throw new ValidationError('ID do livro deve ser um número positivo', 'bookId');
  }
};

/**
 * Validate ID parameter (common for routes like GET /:id)
 * @param {any} id - The ID to validate
 * @throws {ValidationError}
 */
const validateId = (id) => {
  if (!id) {
    throw new ValidationError('ID é obrigatório', 'id');
  }

  const numId = parseInt(id, 10);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw new ValidationError('ID deve ser um número inteiro positivo', 'id');
  }

  return numId;
};

module.exports = {
  ValidationError,
  validateUserRegistration,
  validateUserLogin,
  validateBook,
  validateAuthor,
  validateNote,
  validateId,
};
