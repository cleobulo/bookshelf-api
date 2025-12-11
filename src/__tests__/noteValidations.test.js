const { validateNote } = require('../validations/noteValidations');
const { ValidationError } = require('../validations/errors');

describe('Note Validations', () => {
  describe('validateNote', () => {
    it('should validate a correct note', () => {
      const note = {
        content: 'This is a great book',
        bookId: 1,
      };

      expect(() => validateNote(note)).not.toThrow();
    });

    it('should validate note with page number', () => {
      const note = {
        content: 'This is a great book',
        bookId: 1,
        pageNumber: 42,
      };

      expect(() => validateNote(note)).not.toThrow();
    });

    it('should throw ValidationError for missing content', () => {
      const note = {
        bookId: 1,
      };

      expect(() => validateNote(note)).toThrow(ValidationError);
    });

    it('should throw ValidationError for empty content', () => {
      const note = {
        content: '',
        bookId: 1,
      };

      expect(() => validateNote(note)).toThrow(ValidationError);
    });

    it('should throw ValidationError for content exceeding max length', () => {
      const note = {
        content: 'a'.repeat(5001),
        bookId: 1,
      };

      expect(() => validateNote(note)).toThrow(ValidationError);
    });

    it('should throw ValidationError for missing bookId', () => {
      const note = {
        content: 'This is a great book',
      };

      expect(() => validateNote(note)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid bookId', () => {
      const note = {
        content: 'This is a great book',
        bookId: 'invalid',
      };

      expect(() => validateNote(note)).toThrow(ValidationError);
    });

    it('should throw ValidationError for negative bookId', () => {
      const note = {
        content: 'This is a great book',
        bookId: -1,
      };

      expect(() => validateNote(note)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid pageNumber', () => {
      const note = {
        content: 'This is a great book',
        bookId: 1,
        pageNumber: -5,
      };

      expect(() => validateNote(note)).toThrow(ValidationError);
    });
  });
});
