/**
 * Author validation functions
 * Validates author creation and update data
 */

const { ValidationError } = require('./errors');

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

module.exports = {
  validateAuthor,
};
