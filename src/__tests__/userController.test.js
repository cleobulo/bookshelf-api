const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { createTestDatabase } = require('./testDatabase');

describe('User Controller - Integration Tests', () => {
  let app;
  let testDb;
  let token;
  let userId;

  beforeAll(async () => {
    // Create test database
    testDb = createTestDatabase();

    // Create express app
    app = express();
    app.use(express.json());

    // Create a test user
    const user = testDb.createUser('test@test.com', 'password123');
    userId = user.id;

    // Generate token
    token = jwt.sign(
      { id: userId, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: '7d' }
    );
  });

  describe('User registration and authentication', () => {
    it('should create a user and store in database', () => {
      const user = testDb.createUser('newuser@test.com', 'password123');

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email', 'newuser@test.com');
      expect(user).not.toHaveProperty('password');
    });

    it('should validate credentials correctly', () => {
      const user = testDb.createUser('loginuser@test.com', 'password123');
      const validated = testDb.validateUserCredentials('loginuser@test.com', 'password123');

      expect(validated).toHaveProperty('id');
      expect(validated).toHaveProperty('email', 'loginuser@test.com');
    });

    it('should reject invalid credentials', () => {
      testDb.createUser('checkpass@test.com', 'correctpassword');
      const result = testDb.validateUserCredentials('checkpass@test.com', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should reject non-existent user', () => {
      const result = testDb.validateUserCredentials('nonexistent@test.com', 'password');

      expect(result).toBeNull();
    });
  });

  describe('Book CRUD operations', () => {
    let authorId;
    let bookId;

    beforeAll(() => {
      const author = testDb.createAuthor('Test Author', 'A test author');
      authorId = author.id;
    });

    it('should create a book', () => {
      const book = testDb.createBook('Test Book', authorId, userId);

      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('title', 'Test Book');
      expect(book).toHaveProperty('authorId', authorId);

      bookId = book.id;
    });

    it('should retrieve a book by id', () => {
      const book = testDb.getBookById(bookId);

      expect(book).toHaveProperty('id', bookId);
      expect(book).toHaveProperty('title', 'Test Book');
    });

    it('should list all books', () => {
      const books = testDb.getBooks();

      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
    });

    it('should update a book', () => {
      const updated = testDb.updateBook(bookId, 'Updated Title', authorId);

      expect(updated).toHaveProperty('title', 'Updated Title');
    });

    it('should delete a book', () => {
      const deleted = testDb.deleteBook(bookId);

      expect(deleted).toBe(true);
      const book = testDb.getBookById(bookId);
      expect(book).toBeUndefined();
    });
  });

  describe('Author CRUD operations', () => {
    let authorId;

    it('should create an author', () => {
      const author = testDb.createAuthor('George Orwell', 'British author');

      expect(author).toHaveProperty('id');
      expect(author).toHaveProperty('name', 'George Orwell');
      expect(author).toHaveProperty('bio', 'British author');

      authorId = author.id;
    });

    it('should retrieve author by id', () => {
      const author = testDb.getAuthorById(authorId);

      expect(author).toHaveProperty('name', 'George Orwell');
    });

    it('should retrieve author by name', () => {
      const author = testDb.getAuthorByName('George Orwell');

      expect(author).toHaveProperty('id', authorId);
    });

    it('should list all authors', () => {
      const authors = testDb.getAuthors();

      expect(Array.isArray(authors)).toBe(true);
      expect(authors.length).toBeGreaterThan(0);
    });

    it('should update an author', () => {
      const updated = testDb.updateAuthor(authorId, 'George Orwell Updated', 'New bio');

      expect(updated).toHaveProperty('name', 'George Orwell Updated');
      expect(updated).toHaveProperty('bio', 'New bio');
    });

    it('should delete an author', () => {
      const author = testDb.createAuthor('To Delete', 'Will be deleted');
      const deleted = testDb.deleteAuthor(author.id);

      expect(deleted).toBe(true);
    });
  });

  describe('Note CRUD operations', () => {
    let noteId;
    let bookId;
    let authorId;

    beforeAll(() => {
      const author = testDb.createAuthor('Note Test Author');
      authorId = author.id;
      const book = testDb.createBook('Book for Notes', authorId, userId);
      bookId = book.id;
    });

    it('should create a note', () => {
      const note = testDb.createNote(bookId, userId, 'Great book!', 42);

      expect(note).toHaveProperty('id');
      expect(note).toHaveProperty('content', 'Great book!');
      expect(note).toHaveProperty('pageNumber', 42);

      noteId = note.id;
    });

    it('should retrieve note by id', () => {
      const note = testDb.getNoteById(noteId);

      expect(note).toHaveProperty('content', 'Great book!');
    });

    it('should list notes by book id', () => {
      const notes = testDb.getNotesByBookId(bookId);

      expect(Array.isArray(notes)).toBe(true);
      expect(notes.length).toBeGreaterThan(0);
    });

    it('should update a note', () => {
      const updated = testDb.updateNote(noteId, 'Updated note content', 50);

      expect(updated).toHaveProperty('content', 'Updated note content');
      expect(updated).toHaveProperty('pageNumber', 50);
    });

    it('should delete a note', () => {
      const deleted = testDb.deleteNote(noteId);

      expect(deleted).toBe(true);
    });
  });
});
