const { nanoid } = require('nanoid');
let books = []; // Temporary storage for books

const addBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  // Validation
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Failed to add book. Please provide the book\'s name.'
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Failed to add book. readPage cannot be greater than pageCount.'
    }).code(400);
  }

  const id = nanoid();
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const book = { id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt };
  books.push(book);

  return h.response({
    status: 'success',
    message: 'Book successfully added',
    data: {
      bookId: id
    }
  }).code(201);
};

const getBooks = (request, h) => {
  return h.response({
    status: 'success',
    data: {
      books: books.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  }).code(200);
};

const getBookById = (request, h) => {
  const { bookId } = request.params;
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Book not found'
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      book
    }
  }).code(200);
};

const updateBook = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Failed to update book. Please provide the book\'s name.'
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Failed to update book. readPage cannot be greater than pageCount.'
    }).code(400);
  }

  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Failed to update book. Id not found.'
    }).code(404);
  }

  const updatedAt = new Date().toISOString();
  books[bookIndex] = { ...books[bookIndex], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt };

  return h.response({
    status: 'success',
    message: 'Book successfully updated'
  }).code(200);
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Failed to delete book. Id not found.'
    }).code(404);
  }

  books.splice(bookIndex, 1);
  return h.response({
    status: 'success',
    message: 'Book successfully deleted'
  }).code(200);
};

module.exports = { addBook, getBooks, getBookById, updateBook, deleteBook };
