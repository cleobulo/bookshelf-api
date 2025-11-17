const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

// Inicializa o banco de dados SQLite
const dbPath = path.join(__dirname, '..', 'bookshelf.db');
const db = new Database(dbPath);

// Ativa foreign keys
db.pragma('foreign_keys = ON');

// Cria as tabelas se não existirem
function initDb() {
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
  `);
}

// Inicia o banco na primeira vez
initDb();

// ============ Users ============

function findUserByEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
}

function getUserById(id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
}

async function createUser(email, password) {
  const existing = findUserByEmail(email);
  if (existing) {
    throw new Error('User already exists');
  }
  
  const hashed = await bcrypt.hash(password, 8);
  const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
  const result = stmt.run(email, hashed);
  
  return { id: result.lastInsertRowid, email, password: hashed };
}

async function validateUserCredentials(email, password) {
  const user = findUserByEmail(email);
  if (!user) return null;
  
  const ok = await bcrypt.compare(password, user.password);
  return ok ? user : null;
}

// ============ Books ============

function getBooks() {
  const stmt = db.prepare('SELECT * FROM books ORDER BY created_at DESC');
  return stmt.all();
}

function getBookById(id) {
  const stmt = db.prepare('SELECT * FROM books WHERE id = ?');
  return stmt.get(id);
}

function createBook(title, authorId, userId) {
  if (!title) throw new Error('title is required');
  if (!userId) throw new Error('userId is required');
  
  const stmt = db.prepare('INSERT INTO books (title, author_id, user_id) VALUES (?, ?, ?)');
  const result = stmt.run(title, authorId || null, userId);
  
  return { id: result.lastInsertRowid, title, author_id: authorId, user_id: userId };
}

function updateBook(id, title, authorId) {
  const stmt = db.prepare('UPDATE books SET title = ?, author_id = ? WHERE id = ?');
  stmt.run(title, authorId || null, id);
  return getBookById(id);
}

function deleteBook(id) {
  const stmt = db.prepare('DELETE FROM books WHERE id = ?');
  stmt.run(id);
}

// ============ Authors ============

function getAuthors() {
  const stmt = db.prepare('SELECT * FROM authors ORDER BY name ASC');
  return stmt.all();
}

function getAuthorById(id) {
  const stmt = db.prepare('SELECT * FROM authors WHERE id = ?');
  return stmt.get(id);
}

function getAuthorByName(name) {
  const stmt = db.prepare('SELECT * FROM authors WHERE name = ?');
  return stmt.get(name);
}

function createAuthor(name, bio) {
  if (!name) throw new Error('name is required');
  
  const existing = getAuthorByName(name);
  if (existing) {
    throw new Error('Author already exists');
  }
  
  const stmt = db.prepare('INSERT INTO authors (name, bio) VALUES (?, ?)');
  const result = stmt.run(name, bio || null);
  
  return { id: result.lastInsertRowid, name, bio: bio || null };
}

function updateAuthor(id, name, bio) {
  if (!name) throw new Error('name is required');
  
  const stmt = db.prepare('UPDATE authors SET name = ?, bio = ? WHERE id = ?');
  stmt.run(name, bio || null, id);
  return getAuthorById(id);
}

function deleteAuthor(id) {
  const stmt = db.prepare('DELETE FROM authors WHERE id = ?');
  stmt.run(id);
}

// Fecha a conexão ao sair
process.on('exit', () => db.close());

module.exports = {
  db,
  findUserByEmail,
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
};
