const { validateAuthor } = require('../validations/authorValidations');
const { ValidationError } = require('../validations/errors');

describe('Author Validations', () => {
  describe('validateAuthor', () => {
    it('should validate a correct author', () => {
      const author = {
        name: 'J.R.R. Tolkien',
      };

      expect(() => validateAuthor(author)).not.toThrow();
    });

    it('should validate author with bio', () => {
      const author = {
        name: 'J.R.R. Tolkien',
        bio: 'English writer and philologist',
      };

      expect(() => validateAuthor(author)).not.toThrow();
    });

    it('should throw ValidationError for missing name', () => {
      const author = {
        bio: 'English writer and philologist',
      };

      expect(() => validateAuthor(author)).toThrow(ValidationError);
    });

    it('should throw ValidationError for empty name', () => {
      const author = {
        name: '',
      };

      expect(() => validateAuthor(author)).toThrow(ValidationError);
    });

    it('should throw ValidationError for name exceeding max length', () => {
      const author = {
        name: 'a'.repeat(260),
      };

      expect(() => validateAuthor(author)).toThrow(ValidationError);
    });

    it('should throw ValidationError for bio exceeding max length', () => {
      const author = {
        name: 'J.R.R. Tolkien',
        bio: 'a'.repeat(1001),
      };

      expect(() => validateAuthor(author)).toThrow(ValidationError);
    });
  });
});
