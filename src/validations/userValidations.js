/**
 * User validation functions
 * Validates registration and login data
 */

const { ValidationError } = require('./errors');
const { EMAIL_REGEX } = require('./commonValidations');

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

module.exports = {
  validateUserRegistration,
  validateUserLogin,
};
