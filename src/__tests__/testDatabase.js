const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

/**
 * Create an in-memory database for testing
 * @returns {Object} Database connection with all functions
 */
function createTestDatabase() {
  const db = new Database(':memory:');
  
  // Ativa foreign keys
  db.pragma('foreign_keys = ON');

  // Cria as tabelas
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author_id INTEGER,
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      page_number INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // User functions
  function getUser(id) {
    const stmt = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  }

  function getUserByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  function getUserById(id) {
    return getUser(id);
  }

  function createUser(email, password) {
    const hashedPassword = bcrypt.hashSync(password, 8);
    const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    const result = stmt.run(email, hashedPassword);
    return getUser(result.lastInsertRowid);
  }

  function validateUserCredentials(email, password) {
    const user = getUserByEmail(email);
    if (!user) return null;
    const isValid = bcrypt.compareSync(password, user.password);
    return isValid ? { id: user.id, email: user.email, created_at: user.created_at } : null;
  }

  // Book functions
  function getBooks() {
    const stmt = db.prepare('SELECT id, title, author_id as authorId, user_id as userId, created_at as createdAt FROM books');
    return stmt.all();
  }

  function getBookById(id) {
    const stmt = db.prepare('SELECT id, title, author_id as authorId, user_id as userId, created_at as createdAt FROM books WHERE id = ?');
    return stmt.get(id);
  }

  function createBook(title, authorId, userId) {
    const stmt = db.prepare('INSERT INTO books (title, author_id, user_id) VALUES (?, ?, ?)');
    const result = stmt.run(title, authorId, userId);
    return getBookById(result.lastInsertRowid);
  }

  function updateBook(id, title, authorId) {
    const stmt = db.prepare('UPDATE books SET title = ?, author_id = ? WHERE id = ?');
    stmt.run(title, authorId, id);
    return getBookById(id);
  }

  function deleteBook(id) {
    const stmt = db.prepare('DELETE FROM books WHERE id = ?');
    return stmt.run(id).changes > 0;
  }

  // Author functions
  function getAuthors() {
    const stmt = db.prepare('SELECT id, name, bio, created_at as createdAt FROM authors');
    return stmt.all();
  }

  function getAuthorById(id) {
    const stmt = db.prepare('SELECT id, name, bio, created_at as createdAt FROM authors WHERE id = ?');
    return stmt.get(id);
  }

  function getAuthorByName(name) {
    const stmt = db.prepare('SELECT id, name, bio, created_at as createdAt FROM authors WHERE name = ?');
    return stmt.get(name);
  }

  function createAuthor(name, bio = null) {
    const stmt = db.prepare('INSERT INTO authors (name, bio) VALUES (?, ?)');
    const result = stmt.run(name, bio);
    return getAuthorById(result.lastInsertRowid);
  }

  function updateAuthor(id, name, bio = null) {
    const stmt = db.prepare('UPDATE authors SET name = ?, bio = ? WHERE id = ?');
    stmt.run(name, bio, id);
    return getAuthorById(id);
  }

  function deleteAuthor(id) {
    const stmt = db.prepare('DELETE FROM authors WHERE id = ?');
    return stmt.run(id).changes > 0;
  }

  // Note functions
  function getNotesByBookId(bookId) {
    const stmt = db.prepare('SELECT id, book_id as bookId, user_id as userId, content, page_number as pageNumber, created_at as createdAt, updated_at as updatedAt FROM notes WHERE book_id = ?');
    return stmt.all(bookId);
  }

  function getNoteById(id) {
    const stmt = db.prepare('SELECT id, book_id as bookId, user_id as userId, content, page_number as pageNumber, created_at as createdAt, updated_at as updatedAt FROM notes WHERE id = ?');
    return stmt.get(id);
  }

  function createNote(bookId, userId, content, pageNumber = null) {
    const stmt = db.prepare('INSERT INTO notes (book_id, user_id, content, page_number) VALUES (?, ?, ?, ?)');
    const result = stmt.run(bookId, userId, content, pageNumber);
    return getNoteById(result.lastInsertRowid);
  }

  function updateNote(id, content, pageNumber = null) {
    const stmt = db.prepare('UPDATE notes SET content = ?, page_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    stmt.run(content, pageNumber, id);
    return getNoteById(id);
  }

  function deleteNote(id) {
    const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
    return stmt.run(id).changes > 0;
  }

  return {
    db,
    getUser,
    getUserByEmail,
    getUserById,
    createUser,
    validateUserCredentials,
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getAuthors,
    getAuthorById,
    getAuthorByName,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    getNotesByBookId,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
  };
}

module.exports = { createTestDatabase };
