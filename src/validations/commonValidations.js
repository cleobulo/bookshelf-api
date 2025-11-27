/**
 * Common validation utilities
 * Used by multiple validation functions
 */

const { ValidationError } = require('./errors');

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate ID parameter (common for routes like GET /:id)
 * @param {any} id - The ID to validate
 * @throws {ValidationError}
 * @returns {number} The validated ID as number
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
  EMAIL_REGEX,
  validateId,
};
