/**
 * Central validation module
 * Re-exports all validation functions and utilities
 */

const { ValidationError } = require('./errors');
const { EMAIL_REGEX, validateId } = require('./commonValidations');
const { validateUserRegistration, validateUserLogin } = require('./userValidations');
const { validateBook } = require('./bookValidations');
const { validateAuthor } = require('./authorValidations');
const { validateNote } = require('./noteValidations');

module.exports = {
  // Error class
  ValidationError,
  // Common utilities
  EMAIL_REGEX,
  validateId,
  // User validations
  validateUserRegistration,
  validateUserLogin,
  // Book validations
  validateBook,
  // Author validations
  validateAuthor,
  // Note validations
  validateNote,
};
