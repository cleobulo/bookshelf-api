const bcrypt = require('bcryptjs');

// Dados simulados em memória. Em produção, troque por um DB.
const users = [
	// usuário de teste (senha: password123)
	{ id: '1', email: 'test@example.com', password: bcrypt.hashSync('password123', 8) },
];

// Books in-memory
const books = [
  // exemplo
  { id: '1', title: 'The Hobbit', authorId: '1' },
];

function findUserByEmail(email) {
	return users.find(u => u.email === email);
}

function getUserById(id) {
	return users.find(u => u.id === id);
}

async function createUser(email, password) {
	const existing = findUserByEmail(email);
	if (existing) {
		throw new Error('User already exists');
	}
	const hashed = await bcrypt.hash(password, 8);
	const newUser = { id: String(users.length + 1), email, password: hashed };
	users.push(newUser);
	return newUser;
}

async function validateUserCredentials(email, password) {
	const user = findUserByEmail(email);
	if (!user) return null;
	const ok = await bcrypt.compare(password, user.password);
	return ok ? user : null;
}

// Books helpers
function getBooks() {
	return books;
}

function createBook(title, authorId) {
	if (!title) throw new Error('title is required');
	if (!authorId) throw new Error('authorId is required');
	const newBook = { id: String(books.length + 1), title, authorId };
	books.push(newBook);
	return newBook;
}

module.exports = {
	findUserByEmail,
	getUserById,
	createUser,
	validateUserCredentials,
  getBooks,
  createBook,
};