const { createTestDatabase } = require('./testDatabase');

describe('Book Controller - Integration Tests', () => {
  let testDb;
  let userId;
  let authorId;

  beforeAll(() => {
    testDb = createTestDatabase();
    const user = testDb.createUser('booktest@test.com', 'password123');
    userId = user.id;
    const author = testDb.createAuthor('Test Author', 'A test author');
    authorId = author.id;
  });

  describe('Book operations', () => {
    let bookId;

    it('should create a book', () => {
      const book = testDb.createBook('Test Book', authorId, userId);

      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('title', 'Test Book');
      expect(book).toHaveProperty('authorId', authorId);
      expect(book).toHaveProperty('userId', userId);

      bookId = book.id;
    });

    it('should retrieve a book by id', () => {
      const book = testDb.getBookById(bookId);

      expect(book).toBeDefined();
      expect(book).toHaveProperty('id', bookId);
      expect(book).toHaveProperty('title', 'Test Book');
    });

    it('should list all books', () => {
      const books = testDb.getBooks();

      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
      expect(books.some(b => b.id === bookId)).toBe(true);
    });

    it('should update a book', () => {
      const updatedBook = testDb.updateBook(bookId, 'Updated Test Book', authorId);

      expect(updatedBook).toHaveProperty('title', 'Updated Test Book');
      expect(updatedBook).toHaveProperty('id', bookId);
    });

    it('should delete a book', () => {
      const bookToDelete = testDb.createBook('To Delete', authorId, userId);
      const deleted = testDb.deleteBook(bookToDelete.id);

      expect(deleted).toBe(true);
      const book = testDb.getBookById(bookToDelete.id);
      expect(book).toBeUndefined();
    });

    it('should handle non-existent book gracefully', () => {
      const book = testDb.getBookById(99999);
      expect(book).toBeUndefined();
    });
  });

  describe('Book-Author relationship', () => {
    it('should create books with different authors', () => {
      const author1 = testDb.createAuthor('Author One');
      const author2 = testDb.createAuthor('Author Two');

      const book1 = testDb.createBook('Book One', author1.id, userId);
      const book2 = testDb.createBook('Book Two', author2.id, userId);

      expect(book1).toHaveProperty('authorId', author1.id);
      expect(book2).toHaveProperty('authorId', author2.id);
    });
  });
});
