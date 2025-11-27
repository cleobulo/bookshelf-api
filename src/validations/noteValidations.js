/**
 * Note validation functions
 * Validates note creation and update data
 */

const { ValidationError } = require('./errors');

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

module.exports = {
  validateNote,
};
