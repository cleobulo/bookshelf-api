/**
 * Book validation functions
 * Validates book creation and update data
 */

const { ValidationError } = require('./errors');

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

module.exports = {
  validateBook,
};
