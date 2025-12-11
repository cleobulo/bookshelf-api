const { validateBook } = require('../validations/bookValidations');
const { ValidationError } = require('../validations/errors');

describe('Book Validations', () => {
  describe('validateBook', () => {
    it('should validate a correct book', () => {
      const book = {
        title: 'The Lord of the Rings',
        authorId: 1,
      };

      expect(() => validateBook(book)).not.toThrow();
    });

    it('should throw ValidationError for missing title', () => {
      const book = {
        authorId: 1,
      };

      expect(() => validateBook(book)).toThrow(ValidationError);
    });

    it('should throw ValidationError for empty title', () => {
      const book = {
        title: '',
        authorId: 1,
      };

      expect(() => validateBook(book)).toThrow(ValidationError);
    });

    it('should throw ValidationError for title exceeding max length', () => {
      const book = {
        title: 'a'.repeat(260),
        authorId: 1,
      };

      expect(() => validateBook(book)).toThrow(ValidationError);
    });

    it('should throw ValidationError for missing authorId', () => {
      const book = {
        title: 'The Lord of the Rings',
      };

      expect(() => validateBook(book)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid authorId (not a number)', () => {
      const book = {
        title: 'The Lord of the Rings',
        authorId: 'invalid',
      };

      expect(() => validateBook(book)).toThrow(ValidationError);
    });

    it('should throw ValidationError for negative authorId', () => {
      const book = {
        title: 'The Lord of the Rings',
        authorId: -1,
      };

      expect(() => validateBook(book)).toThrow(ValidationError);
    });

    it('should throw ValidationError for zero authorId', () => {
      const book = {
        title: 'The Lord of the Rings',
        authorId: 0,
      };

      expect(() => validateBook(book)).toThrow(ValidationError);
    });
  });
});
