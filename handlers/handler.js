const { nanoid } = require('nanoid');
let books = []; // Temporary storage for books

const addBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  // Validation
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount.'
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
    message: 'Buku berhasil ditambahkan',
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
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400);
  }

  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan.'
    }).code(404);
  }

  const updatedAt = new Date().toISOString();
  books[bookIndex] = { ...books[bookIndex], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui'
  }).code(200);
};

const deleteBook = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = books.findIndex(b => b.id === bookId);

  if (bookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404);
  }

  books.splice(bookIndex, 1);
  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus'
  }).code(200);
};

module.exports = { addBook, getBooks, getBookById, updateBook, deleteBook };
