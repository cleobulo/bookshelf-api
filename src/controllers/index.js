const { registerUserController, loginUserController, meUserController } = require('./userController');
const { listAllBooksController, createBookController, updateBookController, deleteBookController } = require('./bookController');
const { listAllAuthorsController, getAuthorByIdController, createAuthorController, updateAuthorController, deleteAuthorController } = require('./authorController');
const { listNotesByBookController, getNoteByIdController, createNoteController, updateNoteController, deleteNoteController } = require('./noteController');

module.exports = {
  // User controllers
  registerUserController,
  loginUserController,
  meUserController,
  // Book controllers
  listAllBooksController,
  createBookController,
  updateBookController,
  deleteBookController,
  // Author controllers
  listAllAuthorsController,
  getAuthorByIdController,
  createAuthorController,
  updateAuthorController,
  deleteAuthorController,
  // Note controllers
  listNotesByBookController,
  getNoteByIdController,
  createNoteController,
  updateNoteController,
  deleteNoteController,
};
