const {
  validateUserRegistration,
  validateUserLogin,
} = require('../validations/userValidations');
const { ValidationError } = require('../validations/errors');

describe('User Validations', () => {
  describe('validateUserRegistration', () => {
    it('should validate a correct user registration', () => {
      const user = {
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      };

      expect(() => validateUserRegistration(user)).not.toThrow();
    });

    it('should throw ValidationError for missing email', () => {
      const user = {
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      expect(() => validateUserRegistration(user)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid email format', () => {
      const user = {
        email: 'invalid-email',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      expect(() => validateUserRegistration(user)).toThrow(ValidationError);
    });

    it('should throw ValidationError for password too short', () => {
      const user = {
        email: 'test@example.com',
        password: '123',
        passwordConfirm: '123',
      };

      expect(() => validateUserRegistration(user)).toThrow(ValidationError);
    });

    it('should throw ValidationError for mismatched passwords', () => {
      const user = {
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'different123',
      };

      expect(() => validateUserRegistration(user)).toThrow(ValidationError);
    });

    it('should throw ValidationError for email exceeding max length', () => {
      const user = {
        email: 'a'.repeat(250) + '@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      };

      expect(() => validateUserRegistration(user)).toThrow(ValidationError);
    });
  });

  describe('validateUserLogin', () => {
    it('should validate correct login credentials', () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      expect(() => validateUserLogin(credentials)).not.toThrow();
    });

    it('should throw ValidationError for missing email', () => {
      const credentials = {
        password: 'password123',
      };

      expect(() => validateUserLogin(credentials)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid email format', () => {
      const credentials = {
        email: 'not-an-email',
        password: 'password123',
      };

      expect(() => validateUserLogin(credentials)).toThrow(ValidationError);
    });

    it('should throw ValidationError for missing password', () => {
      const credentials = {
        email: 'test@example.com',
      };

      expect(() => validateUserLogin(credentials)).toThrow(ValidationError);
    });

    it('should throw ValidationError for empty password', () => {
      const credentials = {
        email: 'test@example.com',
        password: '',
      };

      expect(() => validateUserLogin(credentials)).toThrow(ValidationError);
    });
  });
});
