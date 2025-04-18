const { nanoid } = require('nanoid');
const books = require('./booksData'); // Gantilah dengan path ke file data buku jika diperlukan

// Menambahkan Buku
const addBook = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Failed to add book. Please provide a book name',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Failed to add book. readPage cannot be greater than pageCount',
    }).code(400);
  }

  const id = nanoid();
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  return h.response({
    status: 'success',
    message: 'Book successfully added',
    data: {
      bookId: id,
    },
  }).code(201);
};

// Menampilkan Semua Buku
const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading) {
    filteredBooks = filteredBooks.filter((book) => book.reading === (reading === '1'));
  }

  if (finished) {
    filteredBooks = filteredBooks.filter((book) => book.finished === (finished === '1'));
  }

  return h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  }).code(200);
};

// Menampilkan Detail Buku Berdasarkan ID
const getBookById = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Book not found',
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      book,
    },
  }).code(200);
};

// Memperbarui Data Buku Berdasarkan ID
const updateBookById = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Failed to update book. Please provide a book name',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Failed to update book. readPage cannot be greater than pageCount',
    }).code(400);
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Failed to update book. Id not found',
    }).code(404);
  }

  const updatedAt = new Date().toISOString();
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished: pageCount === readPage,
    updatedAt,
  };

  return h.response({
    status: 'success',
    message: 'Book successfully updated',
  }).code(200);
};

// Menghapus Buku Berdasarkan ID
const deleteBookById = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Failed to delete book. Id not found',
    }).code(404);
  }

  books.splice(index, 1);

  return h.response({
    status: 'success',
    message: 'Book successfully deleted',
  }).code(200);
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
