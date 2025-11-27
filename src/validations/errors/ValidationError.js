/**
 * Custom ValidationError class
 * Used across all validation functions
 */
class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

module.exports = ValidationError;
